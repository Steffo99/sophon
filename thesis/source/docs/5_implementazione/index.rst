.. index::
   pair: Sophon; realizzazione

***********************
Realizzazione di Sophon
***********************

Terminato il progetto, si è passati a realizzarne una versione funzionante su calcolatore.

.. todo:: Inserire nell'indice tutte le sezioni.


.. index::
   pair: implementazione; backend

Realizzazione del modulo backend
================================
.. default-domain:: py

Il modulo backend è stato realizzato come un package `Python` denominato ``sophon``, e poi `containerizzato <Containerizzazione del modulo backend>`, creando un'immagine :ref:`Docker` standalone.


Il project Django
-----------------
.. module:: sophon

Il package è stato creato utilizzando l'utility ``startproject`` di Django, la quale crea una cartella di script `Python` con i quali partire per lo sviluppo di una nuovo software web.

La cartella generata è stata modificata significativamente: ne si è modificata la struttura in modo tale da trasformarla da un insieme di script a un vero e proprio modulo Python eseguibile e distribuibile, e si sono aggiunte nuove funzionalità di utilità generale all'applicazione, quali una `pagina di amministrazione personalizzata <Pagina di amministrazione personalizzata>`, il `caricamento dinamico delle impostazioni <Caricamento dinamico delle impostazioni>` e vari `miglioramenti all'autenticazione <Miglioramenti all'autenticazione>`


Pagina di amministrazione personalizzata
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.admin

La pagina di amministrazione viene personalizzata con la classe `SophonAdminSite`, che modifica alcuni parametri della classe base.

Inoltre, il template predefinito viene sovrascritto da quello all'interno del file ``templates/admin/base.html``, che sostituisce il foglio di stile con uno personalizzato per Sophon.

.. class:: SophonAdminSite(django.contrib.admin.AdminSite)

   .. attribute:: site_header = "Sophon Server Administration"

      Il nome della pagina nell'header viene modificato a *Sophon Server Administration*.

   .. attribute:: site_title = "Sophon Server Administration"

      Il titolo della pagina nell'header viene anch'esso modificato a *Sophon Server Administration*.

   .. attribute:: site_url = None

      Il collegamento *View Site* viene rimosso, in quanto è possibile accedere all'interfaccia web di Sophon da più domini contemporaneamente.

   .. attribute:: index_title = "Resources Administration"

      Il titolo dell'indice viene modificato a *Resources Administration*.

.. class:: SophonAdminConfig(django.contrib.admin.apps.AdminConfig)

   .. attribute:: default_site = "sophon.admin.SophonAdminSite"

      :class:`.SophonAdminSite` è selezionata come classe predefinita per il sito di amministrazione.


Caricamento dinamico delle impostazioni
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.settings

Il file di impostazioni viene modificato per **permettere la configurazione attraverso variabili di ambiente** invece che attraverso la modifica del file ``settings.py``, rendendo la `containerizzazione <Containerizzazione del modulo backend>` molto più semplice.

.. code-block:: python

   try:
       DATABASE_ENGINE = os.environ["DJANGO_DATABASE_ENGINE"]
   except KeyError:
       log.warning("DJANGO_DATABASE_ENGINE was not set, defaulting to PostgreSQL")
       DATABASE_ENGINE = "django.db.backends.postgresql"
   log.debug(f"{DATABASE_ENGINE = }")

Inoltre, viene configurato il modulo `logging` per emettere testo colorato di più facile comprensione usando il package `coloredlogs`.

.. code-block:: python

   "detail": {
       "()": coloredlogs.ColoredFormatter,
       "format": "{asctime:>19} | {name:<24} | {levelname:>8} | {message}",
       "style": "{",
   }


Miglioramenti all'autenticazione
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.auth1

La classe `rest_framework.authentication.TokenAuthentication` viene modificata per ottenere un comportamento conforme agli standard del web.

.. class:: BearerTokenAuthentication(rest_framework.authentication.TokenAuthentication)

   .. attribute:: keyword = "Bearer"

      Si configura `rest_framework` per accettare header di autenticazione nella forma ``Bearer <token>``, invece che il default di `rest_framework` ``Token <token>``.

.. module:: sophon.auth2

La view `rest_framework.authtoken.views.ObtainAuthToken` viene estesa per aggiungere dati alla risposta di autenticazione riuscita.

.. class:: CustomObtainAuthToken(rest_framework.authtoken.views.ObtainAuthToken)

   .. method:: post(self, request, *args, **kwargs)

      In particolare, viene aggiunta una chiave ``user``, che contiene i dettagli sull'utente che ha effettuato il login.


L'app Sophon Core
-----------------
.. module:: sophon.core

L'app `sophon.core` è l'app principale del progetto, e non può essere disattivata, in quanto dipendenza obbligatoria di tutte le altre app.


Aggiunta di un nuovo comando di gestione
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.core.management.commands.initsuperuser

Per permettere l'integrazione la creazione automatica del primo superutente quando Sophon viene eseguito da Docker, viene introdotto dall'app il comando di gestione ``initsuperuser``.

.. class:: Command

   Questo comando crea automaticamente un superutente con le credenziali specificate in :env:`DJANGO_SU_USERNAME`, :env:`DJANGO_SU_EMAIL` e :env:`DJANGO_SU_PASSWORD`.


Modello base astratto
^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.core.models

Viene estesa la classe astratta `django.db.models.Model` con funzioni per stabilire il `livello di accesso <Livelli di accesso>` di un `utente <Utenti in Sophon>` all'oggetto e per generare automaticamente i `rest_framework.serializers.ModelSerializer` in base ad esso.

.. class:: SophonModel(django.db.models.Model)

   .. method:: can_edit(self, user: django.contrib.auth.models.User) -> bool
      :abstractmethod:

      Controlla se un utente può modificare l'oggetto attuale.

      :param user: L'utente da controllare.
      :returns: :data:`True` se l'utente deve poter modificare l'oggetto, altrimenti :data:`False`.

   .. method:: can_admin(self, user: django.contrib.auth.models.User) -> bool
      :abstractmethod:

      Controlla se un utente può amministrare l'oggetto attuale.

      :param user: L'utente da controllare.
      :returns: :data:`True` se l'utente deve poter amministrare l'oggetto, altrimenti :data:`False`.

   .. classmethod:: get_fields(cls) -> set[str]

      :returns: il :class:`set` di nomi di campi che devono essere mostrati quando viene richiesto l'oggetto attraverso l'API.

   .. classmethod:: get_editable_fields(cls) -> set[str]

      :returns: il :class:`set` di nomi di campi di cui deve essere permessa la modifica se l'utente può modificare (:meth:`.can_edit`) l'oggetto.

   .. classmethod:: get_administrable_fields(cls) -> set[str]

      :returns: il :class:`set` di nomi di campi di cui deve essere permessa la modifica se l'utente può amministrare (:meth:`.can_admin`) l'oggetto.

   .. classmethod:: get_creation_fields(cls) -> set[str]

      :returns: il :class:`set` di nomi di campi che possono essere specificati dall'utente al momento della creazione dell'oggetto.


Modello di autorizzazione astratto
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Viene definito un nuovo modello astratto, basato su `SophonModel`, che permette di determinare i permessi dell'`utente <Utenti in Sophon>` in base alla sua appartenenza al gruppo a cui è collegato l'oggetto implementatore.

.. class:: SophonGroupModel(SophonModel)

   .. method:: get_group(self) -> ResearchGroup
      :abstractmethod:

      :returns: Il gruppo a cui appartiene l'oggetto.

   .. classmethod:: get_access_to_edit(cls) -> sophon.core.enums.SophonGroupAccess

      :returns: Il livello di autorità all'interno del gruppo necessario per modificare l'oggetto.

   .. classmethod:: get_access_to_admin(cls) -> sophon.core.enums.SophonGroupAccess

      :returns: Il livello di autorità all'interno del gruppo necessario per amministrare l'oggetto.

   .. method:: get_access_serializer(self, user: User) -> typing.Type[rest_framework.serializers.ModelSerializer]

      :returns: Restituisce il `rest_framework.serializers.ModelSerializer` adeguato al livello di autorità dell'utente.


.. class:: sophon.core.enums.SophonGroupAccess(enum.IntEnum)

   Enumerazione che stabilisce il livello di autorità che un `utente <Utenti in Sophon>` può avere all'interno di un `gruppo di ricerca <Gruppi di ricerca in Sophon>`.

   .. attribute:: NONE = 0

      Ospite.

   .. attribute:: REGISTERED = 10

      Utente registrato.

   .. attribute:: MEMBER = 50

      Membro del gruppo al quale appartiene l'oggetto.

   .. attribute:: OWNER = 100

      Creatore del gruppo al quale appartiene l'oggetto.

   .. attribute:: SUPERUSER = 200

      Superutente con privilegi universali.


Modello dei dettagli dell'istanza
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Viene creato il modello che rappresenta i dettagli dell'`istanza di Sophon <Istanza in Sophon>`.

.. class:: SophonInstanceDetails(SophonModel)

   .. attribute:: id: IntegerField [1]

      Impostando ``1`` come unica scelta per il campo della chiave primaria ``id``, si crea un modello "singleton", ovvero un modello di cui può esistere un'istanza sola in tutto il database.

      L'istanza unica viene creata dalla migrazione ``0004_sophoninstancedetails.py``.

   .. attribute:: name: CharField

      Il titolo dell'istanza Sophon.

   .. attribute:: description: TextField

      La descrizione dell'istanza Sophon, da visualizzare in un riquadro "A proposito dell'istanza".

   .. attribute:: theme: CharField ["sophon", "paper", "royalblue", "hacker", "amber"]

      Il tema `Bluelib` dell'istanza.

   .. method:: version: str
      :property:

      :returns: La versione installata del pacchetto :mod:`sophon`.


Modello del gruppo di ricerca
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Viene creato il modello che rappresenta un `gruppo di ricerca <Gruppi di ricerca in Sophon>`.

.. class:: ResearchGroup(SophonGroupModel)

   .. attribute:: slug: SlugField

      L'identificatore del gruppo di ricerca, usato nei percorsi dell'API.

   .. attribute:: name: CharField

      Il nome del gruppo di ricerca.

   .. attribute:: description: TextField

      La descrizione del gruppo di ricerca, da visualizzare in un riquadro "A proposito del gruppo".

   .. attribute:: members: ManyToManyField → django.contrib.auth.models.User

      Elenco dei membri del gruppo. L'utente `.owner` è ignorato, in quanto è considerato sempre parte del gruppo.

   .. attribute:: owner: ForeignKey → django.contrib.auth.models.User

      Il creatore e proprietario del gruppo, con privilegi amministrativi.

   .. attribute:: access: CharField ["MANUAL", "OPEN"]

      La `modalità di accesso <Membri e modalità di accesso>` del gruppo.


Estensione ai permessi di Django
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.core.permissions

I permessi di `rest_framework` vengono estesi con due nuove classi che utilizzano il `modello di autorizzazione astratto <Modello di autorizzazione astratto>` precedentemente definito.

.. class:: Edit(rest_framework.permissions.BasePermission)

   Consente l'interazione solo agli utenti che possono modificare (`.can_edit`) l'oggetto.

.. class:: Admin(rest_framework.permissions.BasePermission)

   Consente l'interazione solo agli utenti che possono amministrare (`.can_admin`) l'oggetto.


Viewset astratti
^^^^^^^^^^^^^^^^
.. module:: sophon.core.views

Vengono definiti tre viewset in grado di utilizzare i metodi aggiunti dalle classi astratte `.models.SophonModel` e `.models.SophonGroupModel`.

.. class:: ReadSophonViewSet(rest_framework.viewsets.ReadOnlyModelViewSet, metaclass=abc.ABCMeta)

   Classe **astratta** che estende la classe base `rest_framework.viewsets.ReadOnlyModelViewSet` con metodi di utilità mancanti nell'implementazione originale, allacciandola inoltre a `.models.SophonGroupModel`.

   .. method:: get_queryset(self) -> QuerySet
      :abstractmethod:

      Imposta come astratto (e quindi obbligatorio) il metodo `rest_framework.viewsets.ReadOnlyModelViewSet.get_queryset`.

   .. method:: permission_classes(self)
      :property:

      Sovrascrive il campo di classe `rest_framework.viewsets.ReadOnlyModelViewSet.permission_classes` con una funzione, permettendone la selezione dei permessi richiesti al momento di ricezione di una richiesta HTTP (invece che al momento di definizione della classe).

      Delega la selezione delle classi a `.get_permission_classes`.

   .. method:: get_permission_classes(self) -> typing.Collection[typing.Type[permissions.BasePermission]]

      Funzione che permette la selezione dei permessi necessari per effetuare una determinata richiesta al momento di ricezione di quest'ultima.

      Utile per le classi che erediteranno da questa.

   .. method:: get_serializer_class(self) -> typing.Type[Serializer]

      Funzione che permette la selezione del `rest_framework.serializers.Serializer` da utilizzare per una determinata richiesta al momento di ricezione di quest'ultima.

      Utilizza:

         - il serializzatore **in sola lettura** per elencare gli oggetti (azione ``list``);
         - il serializzatore **di creazione** per creare nuovi oggetti (azione ``create``) e per generare i metadati del viewset (azione ``metadata``);
         - il serializzatore ottenuto da `.models.SophonGroupModel.get_access_serializer` per la visualizzazione dettagliata (azione ``retrieve``), la modifica (azioni ``update`` e ``partial_update``) e l'eliminazione (azione ``destroy``) di un singolo oggetto;
         - il serializzatore ottenuto da `.get_custom_serializer_classes` per le azioni personalizzate.

      .. seealso::

         `.models.SophonGroupModel`

   .. method:: get_custom_serializer_classes(self) -> t.Type[Serializer]

      Permette alle classi che ereditano da questa di selezionare quale `rest_framework.serializers.Serializer` utilizzare per le azioni personalizzate.

.. class:: WriteSophonViewSet(rest_framework.viewsets.ModelViewSet, ReadSophonViewSet, metaclass=abc.ABCMeta)

   Classe **astratta** che estende la classe base `ReadSophonViewSet` aggiungendoci i metodi di `rest_framework.viewsets.ModelViewSet` che effettuano modifiche sugli oggetti.

   Depreca i metodi ``perform_*`` di `rest_framework`, introducendone versioni migliorate con una signature diversa dal nome di ``hook_*``.

   .. method:: perform_create(self, serializer)

      .. deprecated:: 0.1

      Metodo di `rest_framework` rimosso da Sophon.

   .. method:: perform_update(self, serializer)

      .. deprecated:: 0.1

      Metodo di `rest_framework` rimosso da Sophon.

   .. method:: perform_destroy(self, serializer)

      .. deprecated:: 0.1

      Metodo di `rest_framework` rimosso da Sophon.

   .. method:: hook_create(self, serializer) -> dict[str, typing.Any]

      Funzione chiamata durante l'esecuzione dell'azione di creazione oggetto ``create``.

      :param serializer: Il `~rest_framework.serializers.Serializer` già "riempito" contenente i dati dell'oggetto che sta per essere creato.
      :raises .HTTPException: È possibile interrompere la creazione dell'oggetto con uno specifico codice errore sollevando una `.HTTPException` all'interno della funzione.
      :returns: Un `dict` da unire a quello del `~rest_framework.serializers.Serializer` per formare l'oggetto da creare.

   .. method:: hook_update(self, serializer) -> dict[str, t.Any]

      Funzione chiamata durante l'esecuzione delle azioni di modifica oggetto ``update`` e ``partial_update``.

      :param serializer: Il `~rest_framework.serializers.Serializer` già "riempito" contenente i dati dell'oggetto che sta per essere modificato.
      :raises .HTTPException: È possibile interrompere la creazione dell'oggetto con uno specifico codice errore sollevando una `.HTTPException` all'interno della funzione.
      :returns: Un `dict` da unire a quello del `~rest_framework.serializers.Serializer` per formare l'oggetto da modificare.

   .. method:: hook_destroy(self, serializer) -> dict[str, typing.Any]

      Funzione chiamata durante l'esecuzione dell'azione di eliminazione oggetto ``destroy``.

      :raises .HTTPException: È possibile interrompere la creazione dell'oggetto con uno specifico codice errore sollevando una `.HTTPException` all'interno della funzione.

.. exception:: sophon.core.errors.HTTPException

   Tipo di eccezione che è possibile sollevare nei metodi ``hook_*`` di `.WriteSophonViewSet` per interrompere l'azione in corso senza applicare le modifiche.

   .. attribute:: status: int

      Permette di specificare il codice errore con cui rispondere alla richiesta interrotta.


.. class:: SophonGroupViewSet(WriteSophonViewSet, metaclass=abc.ABCMeta)

   Classe **astratta** che estende la classe base `.WriteSophonViewSet` estendendo gli ``hook_*`` con verifiche dei permessi dell'utente che tenta di effettuare l'azione.

   .. method:: get_group_from_serializer(self, serializer) -> models.ResearchGroup
      :abstractmethod:

      Metodo necessario a trovare il gruppo a cui apparterrà un oggetto prima che il suo serializzatore venga elaborato.

      :param serializer: Il `~rest_framework.serializers.Serializer` già "riempito" contenente i dati dell'oggetto.


Viewset concreti
^^^^^^^^^^^^^^^^

Vengono poi definiti tre viewset e una view che permettono interazioni tra l'utente e i modelli definiti nell'app.

.. class:: UsersByIdViewSet(ReadSophonViewSet)

   Viewset in sola lettura che permette di recuperare gli utenti dell'istanza partendo dal loro ``id``.

   Accessibile all'URL :samp:`/api/core/users/by-id/{ID}/`.

.. class:: UsersByUsernameViewSet(ReadSophonViewSet)

   Viewset in sola lettura che permette di recuperare gli utenti dell'istanza partendo dal loro ``username``.

   Accessibile all'URL :samp:`/api/core/users/by-username/{USERNAME}/`.

.. class:: ResearchGroupViewSet(WriteSophonViewSet)

   Viewset in lettura e scrittura che permette di interagire con i gruppi di ricerca.

   Accessibile all'URL :samp:`/api/core/groups/{GROUP_SLUG}/`.

   .. method:: join(self, request: Request, pk: int) -> Response

      Azione personalizzata che permette ad un utente di unirsi ad un gruppo aperto.

      Utilizza `.models.SophonGroupModel.get_access_serializer`.

   .. method:: leave(self, request: Request, pk: int) -> Response

      Azione personalizzata che permette ad un utente di abbandonare un gruppo di cui non è proprietario.

      Utilizza `.models.SophonGroupModel.get_access_serializer`.

.. class:: SophonInstanceDetailsView(APIView)

   View che restituisce il valore attuale dell'unico oggetto `.models.SophonInstanceDetails`.

   Accessibile tramite richieste ``GET`` all'URL :samp:`/api/core/instance/`.


Pagina di amministrazione
^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.core.admin

Vengono infine registrati nella pagina di amministrazione i modelli concreti definiti in questa app, effettuando alcune personalizzazioni elencate in seguito.

.. class:: ResearchGroupAdmin(SophonAdmin)

   Per i gruppi di ricerca, viene specificato un ordinamento, permesso il filtraggio e selezionati i campi più importanti da visualizzare nella lista.

.. class:: SophonInstanceDetails(SophonAdmin)

   Per i dettagli dell'istanza, vengono disattivate tutte le azioni, impedendo la creazione o eliminazione del singleton.


Testing in Sophon Core
^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.core.tests

Per verificare che i `modelli <Modello base astratto>` e `viewset <Viewset astratti>` funzionassero correttamente e non avessero problemi di `sicurezza <Sicurezza>`, sono stati realizzati degli unit test in grado di rilevare la presenza di errori all'interno dell'app.

Test case generici
^^^^^^^^^^^^^^^^^^

Vengono definiti alcuni test case generici per facilitare le interazioni tra ``APITestCase`` e viewset.

.. note::

   I nomi delle funzioni usano nomi con capitalizzazione inconsistente, in quanto lo stesso modulo `unittest` non rispetta lo stile suggerito in :pep:`8`.

.. class:: BetterAPITestCase(APITestCase)

   .. method:: as_user(self, username: str, password: str = None) -> typing.ContextManager[None]

      Context manager che permette di effettuare richieste all'API come uno specifico utente, effettuando il logout quando sono state effettuate le richieste necessarie.

   .. method:: assertData(self, data: ReturnDict, expected: dict)

      Asserzione che permette di verificare che l'oggetto restituito da una richiesta all'API contenga almeno le chiavi e i valori contenuti nel dizionario ``expected``.

.. class:: ReadSophonTestCase(BetterAPITestCase, metaclass=abc.ABCMeta)

   Classe **astratta** che implementa metodi per testare rapidamente le azioni di un `.views.ReadSophonViewSet`.

   .. classmethod:: get_basename(cls) -> str

      Metodo **astratto** che deve restituire il basename del viewset da testare.

   .. classmethod:: get_url(cls, kind: str, *args, **kwargs) -> str

      Metodo utilizzato dal test case per trovare gli URL ai quali possono essere effettuate le varie azioni.

   I seguenti metodi permettono di effettuare azioni sul viewset:

   .. method:: list(self) -> rest_framework.response.Response
   .. method:: retrieve(self, pk) -> rest_framework.response.Response
   .. method:: custom_list(self, method: str, action: str, data: dict = None) -> rest_framework.response.Response
   .. method:: custom_detail(self, method: str, action: str, pk, data: dict = None) -> rest_framework.response.Response

   I seguenti metodi asseriscono che una determinata azione con determinati parametri risponderà con il codice di stato ``code``, e restituiscono i dati contenuti nella risposta se l'azione è riuscita (``200 <= code < 300``)

   .. method:: assertActionList(self, code: int = 200) -> typing.Optional[ReturnDict]
   .. method:: assertActionRetrieve(self, pk, code: int = 200) -> typing.Optional[ReturnDict]
   .. method:: assertActionCustomList(self, method: str, action: str, data: dict = None, code: int = 200) -> typing.Optional[ReturnDict]
   .. method:: assertActionCustomDetail(self, method: str, action: str, pk, data: dict = None, code: int = 200) -> typing.Optional[ReturnDict]


.. class:: WriteSophonTestCase(ReadSophonTestCase, metaclass=abc.ABCMeta)

   Classe **astratta** che estende `.ReadSophonTestCase` con le azioni di un `.views.WriteSophonViewSet`.

   .. method:: create(self, data) -> rest_framework.response.Response
   .. method:: update(self, pk, data) -> rest_framework.response.Response
   .. method:: destroy(self, pk) -> rest_framework.response.Response

   .. method:: assertActionCreate(self, data, code: int = 201) -> typing.Optional[ReturnDict]
   .. method:: assertActionUpdate(self, pk, data, code: int = 200) -> typing.Optional[ReturnDict]
   .. method:: assertActionDestroy(self, pk, code: int = 200) -> typing.Optional[ReturnDict]


Test case concreti
^^^^^^^^^^^^^^^^^^

Vengono testate tutte le view dell'app tramite `.BetterAPITestCase` e tutti i viewset dell'app tramite `.ReadSophonTestCase` e `WriteSophonTestCase`.

.. class:: UsersByIdTestCase(ReadSophonTestCase)
.. class:: UsersByUsernameTestCase(ReadSophonTestCase)
.. class:: ResearchGroupTestCase(WriteSophonTestCase)
.. class:: SophonInstanceDetailsTestCase(BetterAPITestCase)


L'app Sophon Projects
---------------------
.. module:: sophon.projects

L'app `sophon.projects` è un app secondaria che dipende da `sophon.core` che introduce in Sophon il concetto di `progetto di ricerca <Progetti di ricerca in Sophon>`.

.. note::

   L'app `sophon.projects` teoricamente è opzionale, in quanto il modulo backend può funzionare senza di essa, e può essere rimossa dal modulo `sophon.settings`.

   Non è però possibile rimuoverla nella versione finale distribuita, in quanto il modulo `sophon.settings` non è modificabile dall'esterno, e in quanto il `modulo frontend <Modulo frontend>` non prevede questa funzionalità e si aspetta che i percorsi API relativi all'app siano disponibili.

   Inoltre, rimuovendo l'app `sophon.projects` non sarà più possibile usare l'app `sophon.notebooks`, in quanto dipende da essa.


Modello del progetto di ricerca
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.projects.models

Viene introdotto un modello concreto che rappresenta un `progetto di ricerca <Progetti di ricerca in Sophon>`.

.. class:: ResearchProject(SophonGroupModel)

   .. attribute:: slug: SlugField

      L'identificatore del progetto di ricerca, usato nei percorsi dell'API.

   .. attribute:: group: ForeignKey → sophon.core.models.ResearchGroup

      Lo `~sophon.core.models.ResearchGroup.slug` del gruppo di ricerca al quale appartiene il progetto.

   .. attribute:: name: CharField

      Il nome completo del progetto di ricerca.

   .. attribute:: description: TextField

      La descrizione del progetto di ricerca, da visualizzare in un riquadro "A proposito del progetto".

   .. attribute:: visibility: CharField ["PUBLIC", "INTERNAL", "PRIVATE"]

      La `visibilità del progetto <Visibilità dei progetti>`.


Viewset del gruppo di ricerca
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.projects.views

Da una base comune, vengono creati due viewset per interagire con i progetti di ricerca.

.. class:: ResearchProjectViewSet(SophonGroupViewSet, metaclass=abc.ABCMeta)

   Classe **astratta** che effettua l'override di `~sophon.core.views.SophonGroupView.get_group_from_serializer` per entrambi i viewset che seguono.

.. class:: ResearchProjectsBySlugViewSet(ResearchProjectViewSet)

   Viewset in lettura e scrittura che permette di interagire con tutti i progetti di ricerca a cui l'utente loggato ha accesso.

   Accessibile all'URL :samp:`/api/projects/by-slug/{PROJECT_SLUG}/`.

.. class:: ResearchProjectsByGroupViewSet(ResearchProjectViewSet)

   Viewset in lettura e scrittura che permette di interagire con i progetti di ricerca a cui l'utente loggato ha accesso, filtrati per il gruppo a cui appartengono.

   Il filtraggio viene effettuato limitando il queryset.

   Accessibile all'URL :samp:`/api/projects/by-group/{GROUP_SLUG}/{PROJECT_SLUG}/`.


Amministrazione del gruppo di ricerca
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.projects.admin

Il modello `.models.ResearchProject` viene registrato nella pagina di amministrazione attraverso la seguente classe:

.. class:: ResearchProjectAdmin(sophon.core.admin.SophonAdmin)

   Classe per la pagina di amministrazione che specifica un ordinamento, permette il filtraggio per gruppo di appartenenza e visibilità, e specifica i campi da visualizzare nell'elenco dei progetti.


L'app Sophon Notebooks
----------------------
.. default-domain:: py
.. default-role:: obj
.. module:: sophon.notebooks


L'app `sophon.notebooks` è un app secondaria che dipende da `sophon.projects` che introduce in Sophon il concetto di `notebook <Notebook in Sophon>`.

.. note::

   L'app `sophon.notebooks` teoricamente è opzionale, in quanto il modulo backend può funzionare senza di essa, e può essere rimossa dal modulo `sophon.settings`.

   Non è però possibile rimuoverla nella versione finale distribuita, in quanto il modulo `sophon.settings` non è modificabile dall'esterno, e in quanto il `modulo frontend <Modulo frontend>` non prevede questa funzionalità e si aspetta che i percorsi API relativi all'app siano disponibili.


Funzionamento di un notebook
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Internamente, un notebook non è altro che un container :ref:`Docker` accessibile ad un determinato indirizzo il cui stato è sincronizzato con un oggetto del database del `modulo backend <Modulo backend>`.


Modalità sviluppo
"""""""""""""""""

Per facilitare lo sviluppo di Sophon, sono state realizzate due modalità di operazione di quest'ultimo.

*  Nella prima, la **modalità sviluppo**, il `modulo proxy <Modulo proxy>` non è in esecuzione, ed è possibile collegarsi direttamente ai container all'indirizzo IP locale ``127.0.0.1``.

   Il `modulo frontend <Modulo frontend>` non supporta questa modalità, in quanto intesa solamente per lo sviluppo del modulo backend.

*  Nella seconda, la **modalità produzione**, il `modulo proxy <Modulo proxy>` è in esecuzione all'interno di un container Docker, e si collega ai `moduli Jupyter <Modulo Jupyter>` attraverso i relativi network Docker tramite  indirizzi presenti all'interno .

  .. image:: notebooks_diagram.png


Gestione della rubrica del proxy
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.notebooks.apache

Viene creata una classe per la gestione della rubrica del proxy, utilizzando il modulo `dbm.gnu`, supportato da HTTPd.

La rubrica mappa gli URL pubblici dei notebook a URL privati relativi al `modulo proxy <Modulo proxy>`, in modo da effettuare reverse proxying **dinamico**.

.. class:: ApacheDB

   Classe che permette il recupero, la creazione, la modifica e l'eliminazioni di chiavi di un database `dbm.gnu` come se quest'ultimo fosse un `dict` con supporto a chiavi e valori `str` e `bytes`.

   .. staticmethod:: convert_to_bytes(item: typing.Union[str, bytes]) -> bytes

      Tutte le `str` passate a questa classe vengono convertite in `bytes` attraverso questa funzione, che effettua un encoding in ASCII e solleva un errore se quest'ultimo fallisce.


Assegnazione porta effimera
^^^^^^^^^^^^^^^^^^^^^^^^^^^

In *modalità sviluppo*, è necessario trovare una porta libera a cui rendere accessibile i container Docker dei notebook.

.. function:: get_ephemeral_port() -> int

   Questa funzione apre e chiude immediatamente un `socket.socket` all'indirizzo ``localhost:0`` in modo da ricevere dal sistema operativo un numero di porta sicuramente libero.


Connessione al daemon Docker
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.notebooks.docker

Per facilitare l'utilizzo del daemon Docker per la gestione dei container dei notebook, viene utilizzato il modulo :mod:`docker`.

.. function:: get_docker_client() -> docker.DockerClient

   Funzione che crea un client Docker con le variabili di ambiente del modulo.

.. data:: client: docker.DockerClient = lazy_object_proxy.Proxy(get_docker_client)

   Viene creato un client Docker globale con inizializzazione lazy al fine di non tentare connessioni (lente!) al daemon quando non sono necessarie.


Controllo dello stato di salute
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Il modulo :mod:`docker` viene esteso implementando supporto per l'istruzione ``HEALTHCHECK`` dei ``Dockerfile``.

.. class:: HealthState(enum.IntEnum)

   Enumerazione che elenca gli stati possibili in cui può essere la salute di un container.

   .. attribute:: UNDEFINED = -2

      Il ``Dockerfile`` non ha un ``HEALTHCHECK`` definito.

   .. attribute:: STARTING = -1

      Il container Docker non mai completato con successo un ``HEALTHCHECK``.

   .. attribute:: HEALTHY = 0

      Il container Docker ha completato con successo l'ultimo ``HEALTHCHECK`` e quindi sta funzionando correttamente.

   .. attribute:: UNHEALTHY = 1

      Il container Docker ha fallito l'ultimo ``HEALTHCHECK``.


.. function:: get_health(container: docker.models.containers.Container) -> HealthState

   Funzione che utilizza l'API a basso livello del client Docker per recuperare l'`HealthState` dei container.

.. function:: sleep_until_container_has_started(container: docker.models.containers.Container) -> HealthState

   Funzione bloccante che restituisce solo quando lo stato del container specificato non è `HealthState.STARTING`.

   .. danger::

      L'implementazione di questa funzione potrebbe causare rallentamenti nella risposta alle pagine web per via di una chiamata al metodo `time.sleep` al suo interno.

      Ciò è dovuto al mancato supporto alle funzioni asincrone nella versione attuale di `rest_framework`.

      Si è deciso di mantenere comunque la funzionalità a scopi dimostrativi e per compatibilità futura.


Generazione di token sicuri
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Per rendere l'interfaccia grafica più `intuibile <intuibile>`, si è scelto di rendere trasparente all'utente il meccanismo di autenticazione a JupyterLab.

Pertanto, si è verificata la necessità di generare token crittograficamente sicuri da richiedere per l'accesso a JupyterLab.

.. function:: generate_secure_token() -> str

   Funzione che utilizza `secrets.token_urlsafe` per generare un token valido e crittograficamente sicuro.


Modello dei notebook
^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.notebooks.models

Viene definito il modello rappresentante un `notebook <Notebook in Sophon>`.

.. class:: Notebook(SophonGroupModel)

   .. attribute:: slug: SlugField

      Lo slug dei notebook prevede ulteriori restrizioni oltre a quelle previste dallo `django.db.models.SlugField`:

      * non può essere uno dei seguenti valori: ``api``, ``static``, ``proxy``, ``backend``, ``frontend``, ``src``;
      * non può iniziare o finire con un trattino ``-``.

   .. attribute:: project: ForeignKey → sophon.projects.models.ResearchProject

      Il `progetto <Progetti di ricerca in Sophon>` che include questo notebook.

   .. attribute:: name: CharField

      Il nome del notebook.

   .. attribute:: locked_by: ForeignKey → django.contrib.auth.models.User

      L'`utente <Utenti in Sophon>` che ha richiesto il blocco del notebook, o `None` in caso il notebook non sia bloccato.

   .. attribute:: container_image: CharField ["ghcr.io/steffo99/sophon-jupyter"]

      Campo che specifica l'immagine che il client :ref:`Docker` dovrà avviare per questo notebook.

      Al momento ne è supportata una sola per semplificare l'esperienza utente, ma altre possono essere aggiunte al file che definisce il modello per permettere agli utenti di scegliere tra più immagini.

      .. note::

         Al momento, Sophon si aspetta che tutte le immagini specificate espongano un server web sulla porta ``8888``, e supportino il protocollo di autenticazione di Jupyter, ovvero che sia possibile raggiungere il container ai seguenti indirizzi: :samp:`{PROTOCOLLO}://immagine:8888/lab?token={TOKEN}` e :samp:`{PROTOCOLLO}://immagine:8888/tree?token={TOKEN}`.

   .. attribute:: jupyter_token: CharField

      Il token segreto che verrà passato attraverso le variabili di ambiente al container Docker dell'oggetto per permettere solo agli utenti autorizzati di accedere a quest'ultimo.

   .. attribute:: container_id: CharField

      L'id assegnato dal daemon Docker al container di questo oggetto.

      Se il notebook non è avviato, questo attributo varrà `None`.

   .. attribute:: port: IntegerField

      La porta TCP locale assegnata al container Docker dell'oggetto nel caso in cui Sophon sia avviato in `modalità sviluppo <Modalità sviluppo>`.

   .. attribute:: internal_url: CharField

      L'URL a cui è accessibile il container Docker dell'oggetto nel caso in cui Sophon non sia avviato in `modalità sviluppo <Modalità sviluppo>`.

   .. method:: log(self) -> logging.Logger
      :property:

      Viene creato un `logging.Logger` per ogni oggetto della classe, in modo da facilitare il debug relativo ad uno specifico notebook.

      Il nome del logger ha la forma :samp:`sophon.notebooks.models.Notebook.{NOTEBOOK_SLUG}`.

   .. method:: enable_proxying(self) -> None

      Aggiunge l'indirizzo del notebook alla `rubrica del proxy <Gestione della rubrica del proxy>`.

   .. method:: disable_proxying(self) -> None

      Rimuove l'indirizzo del notebook dalla `rubrica del proxy <Gestione della rubrica del proxy>`.

   .. method:: sync_container(self) -> t.Optional[docker.models.containers.Container]

      Sincronizza lo stato dell'oggetto nel database con lo stato del container :ref:`Docker` nel sistema.

   .. method:: create_container(self) -> docker.models.containers.Container

      Crea e configura un container :ref:`Docker` per l'oggetto, con l'immagine specificata in `.container_image`.

   .. method:: start(self) -> None

      Tenta di creare e avviare un container :ref:`Docker` per l'oggetto, bloccando fino a quando esso non sarà avviato con `~.docker.sleep_until_container_has_started`.

   .. method:: stop(self) -> None

      Arresta il container Docker dell'oggetto.


Viewset dei notebook
^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.notebooks.views

Come per il modulo `sophon.projects`, vengono creati due viewset per interagire con i progetti di ricerca, basati entrambi su un viewset astratto che ne definisce le proprietà comuni.

.. class:: NotebooksViewSet(SophonGroupViewSet, metaclass=abc.ABCMeta)

   Classe **astratta** che effettua l'override di `~sophon.core.views.SophonGroupView.get_group_from_serializer` e definisce cinque azioni personalizzate per l'interazione con il notebook.

   .. method:: sync(self, request: Request, **kwargs) -> Response

      Azione personalizzata che sincronizza lo stato dell'oggetto dell'API con quello del daemon Docker.

   .. method:: start(self, request: Request, **kwargs) -> Response

      Azione personalizzata che avvia il notebook con `.models.Notebook.start`.

   .. method:: stop(self, request: Request, **kwargs) -> Response

      Azione personalizzata che arresta il notebook con `.models.Notebook.stop`.

   .. method:: lock(self, request: Request, **kwargs) -> Response

      Azione personalizzata che blocca il notebook impostando il campo `.models.Notebook.locked_by` all'utente che ha effettuato la richiesta.

   .. method:: unlock(self, request: Request, **kwargs) -> Response

      Azione personalizzata che sblocca il notebook impostando il campo `.models.Notebook.locked_by` a `None`.

.. class:: NotebooksBySlugViewSet(NotebooksViewSet)

   Viewset in lettura e scrittura che permette di interagire con tutti i notebook a cui l'utente loggato ha accesso.

   Accessibile all'URL :samp:`/api/notebooks/by-slug/{NOTEBOOK_SLUG}/`.

.. class:: NotebooksByProjectViewSet(NotebooksViewSet)

   Viewset in lettura e scrittura che permette di interagire con i notebook a cui l'utente loggato ha accesso, filtrati per il progetto di appartenenza.

   Accessibile all'URL :samp:`/api/notebooks/by-project/{PROJECT_SLUG}/{NOTEBOOK_SLUG}/`.


Containerizzazione del modulo backend
-------------------------------------

Il modulo backend è incapsulato in un'immagine :ref:`Docker` basata sull'immagine ufficiale `python:3.9.7-bullseye <https://hub.docker.com/_/python>`_.

L'immagine utilizza `Poetry` per installare le dipendenze, poi esegue il file ``docker_start.sh`` riportato sotto che effettua le migrazioni, prepara i file statici di Django e `prova a creare un superutente <Aggiunta di un nuovo comando di gestione>`, per poi avviare il progetto Django attraverso :mod:`gunicorn` sulla porta 8000.

.. code-block:: bash

   poetry run python -O ./manage.py migrate --no-input
   poetry run python -O ./manage.py collectstatic --no-input
   poetry run python -O ./manage.py initsuperuser
   poetry run python -O -m gunicorn sophon.wsgi:application --workers=4 --bind=0.0.0.0:8000


Realizzazione del modulo frontend
=================================
.. default-domain:: js

Il modulo frontend è stato realizzato come un package `Node.js` denominato ``@steffo/sophon-frontend``, e poi `containerizzato <Containerizzazione del modulo frontend>`, creando un'immagine :ref:`Docker` standalone, esattamente come per il `modulo backend <Containerizzazione del modulo backend>`.


Struttura delle directory
-------------------------

Le directory di :mod:`@steffo45/sophon-frontend` sono strutturate nella seguente maniera:

src/components
   Contiene i componenti React sia con le classi sia funzionali.

src/contexts
   Contiene i contesti React creati con :func:`React.createContext`.

src/hooks
   Contiene gli hook React personalizzati utilizzati nei componenti funzionali.

src/types
   Contiene estensioni ai tipi base TypeScript, come ad esempio i tipi restituiti dalla web API del :ref:`modulo backend`.

src/utils
   Contiene varie funzioni di utility.

public
   Contiene i file statici da servire assieme all'app.


Comunicazione con il backend
----------------------------

Sono state sviluppate alcune funzioni di utilità per facilitare la comunicazione con il `modulo backend <Realizzazione del modulo backend>`.


Axios
^^^^^

Per effettuare richieste all'API web, si è deciso di utilizzare la libreria :mod:`axios`, in quanto permette di creare dei "client" personalizzabili con varie proprietà.

In particolare, si è scelto di forkarla, integrando anticipatamente una proposta di funzionalità che permette alle richieste di essere interrotte attraverso degli :class:`AbortController`.


Client personalizzati
^^^^^^^^^^^^^^^^^^^^^

Per permettere all'utente di selezionare l'istanza da utilizzare e di comunicare con l'API con le proprie credenziali, si è scelto di creare client personalizzati partendo da due contesti.

All'interno di un contesto in cui è stata selezionata un'istanza (:data:`InstanceContext`), viene creato un client dal seguente hook:

.. function:: useInstanceAxios(config = {})

   Questo hook specifica il ``baseURL`` del client Axios, impostandolo all'URL dell'istanza selezionata.

All'interno di un contesto in cui è stato effettuato l'accesso come utente (:data:`AuthorizationContext`), viene creato invece un client dal seguente hook:

.. function:: useAuthorizedAxios(config = {})

   Questo hook specifica il valore dell'header ``Authorization`` da inviare in tutte le richieste effettuate a :samp:`Bearer {TOKEN}`, utilizzando il token ottenuto al momento dell'accesso.


Utilizzo di viewset
^^^^^^^^^^^^^^^^^^^

Viene implementato un hook che si integra con i viewset di Django, fornendo un API semplificato per effettuare azioni su di essi.

.. function:: useViewSet(baseRoute) → viewset

   Questo hook implementa tutte le azioni :py:mod:`rest_framework` di un viewset in lettura e scrittura.

   Richiede di essere chiamato all'interno di un :data:`AuthorizationContext`.

   .. function:: viewset.list(config = {})

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Richiede la lista di tutte le risorse del viewset.

   .. function:: viewset.retrieve(pk, config = {})

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Richiede i dettagli di una specifica risorsa del viewset.

   .. function:: viewset.create(config)

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Crea una nuova risorsa nel viewset.

   .. function:: viewset.update(pk, config)

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Aggiorna una specifica risorsa nel viewset.

   .. function:: viewset.destroy(pk, config)

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Elimina una specifica risorsa dal viewset.

   Viene inoltre fornito supporto per le azioni personalizzate.

   .. function:: viewset.command(config)

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Permette azioni personalizzate su tutto il viewset.

   .. function:: viewset.action(config)

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Permette azioni personalizzate su uno specifico oggetto del viewset.


Emulazione di viewset
^^^^^^^^^^^^^^^^^^^^^

Viene creato un hook che tiene traccia degli oggetti restituiti da un determinato viewset, ed emula i risultati delle azioni effettuate, minimizzando i rerender e ottenendo una ottima user experience.

.. function:: useManagedViewSet(baseRoute, pkKey, refreshOnMount) → managed

   .. attribute:: managed.viewset

      Il viewset restituito da :func:`useViewSet`, utilizzato come interfaccia di basso livello per effettuare azioni.

   .. attribute:: managed.state

      Lo stato del viewset, che tiene traccia degli oggetti e delle azioni in corso su di essi.

      Gli oggetti all'interno di esso sono istanze di :class:`ManagedResource`, create usando wrapper di :func:`.update`, :func:`.destroy` e :func:`.action`, che permettono di modificare direttamente l'oggetto senza preoccuparsi dell'indice a cui si trova nell'array.

   .. attribute:: managed.dispatch

      Riduttore che permette di alterare lo :attr:`.state`.

   .. function:: managed.refresh()

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Ricarica gli oggetti del viewset.

      Viene chiamata automaticamente al primo render se ``refreshOnMount`` è :data:`True`.

   .. function:: managed.create(data)

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Crea un nuovo oggetto nel viewset con i dati specificati come argomento, e lo aggiunge allo stato se la richiesta va a buon fine.

   .. function:: managed.command(method, cmd, data)

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Esegue l'azione personalizzata ``cmd`` su tutto il viewset, utilizzando il metodo ``method`` e con i dati specificati in ``data``.

      Se la richiesta va a buon fine, il valore restituito dal backend sostituisce nello stato le risorse dell'intero viewset.

   .. function:: managed.update(index, data)

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Modifica l'oggetto alla posizione ``index`` dell'array :attr:`.state` con i dati specificati in ``data``.

      Se la richiesta va a buon fine, la modifica viene anche applicata all'interno di :attr:`.state`

   .. function:: managed.destroy(index)

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Elimina l'oggetto alla posizione ``index`` dell'array :attr:`.state`.

      Se la richiesta va a buon fine, l'oggetto viene eliminato anche da :attr:`.state`.

   .. function:: managed.action(index, method, act, data)

      Funzione **asincrona**, che restituisce una :class:`Promise`.

      Esegue l'azione personalizzata ``act`` sull'oggetto alla posizione ``index`` dell'array :attr:`.state`, utilizzando il metodo ``method`` e con i dati specificati in ``data``.

      Se la richiesta va a buon fine, il valore restituito dal backend sostituisce l'oggetto utilizzato in :attr:`.state`.


Contesti innestati
------------------
.. default-domain:: js

Per minimizzare i re-render, l'applicazione è organizzata a "contesti innestati".


I contesti
^^^^^^^^^^

Viene definito un contesto per ogni tipo di risorsa selezionabile nell'interfaccia.

Essi sono, in ordine dal più esterno al più interno:

#. :data:`InstanceContext` (`Istanza <Istanza in Sophon>`)
#. :data:`AuthorizationContext` (`Utente <Utenti in Sophon>`)
#. :data:`GroupContext` (`Gruppo di ricerca <Gruppi di ricerca in Sophon>`)
#. :data:`ProjectContext` (`Progetto di ricerca <Progetti di ricerca in Sophon>`)
#. :data:`NotebookContext` (`Notebook <Notebook in Sophon>`)


Contenuto dei contesti
""""""""""""""""""""""

Questi contesti possono avere tre tipi di valori: :data:`undefined` se ci si trova al di fuori del contesto, :data:`null` se non è stato selezionato alcun oggetto oppure **l'oggetto selezionato** se esso esiste.


URL contestuale
^^^^^^^^^^^^^^^

Si è definita la seguente struttura per gli URL del frontend di Sophon, in modo che essi identificassero universalmente una risorsa e che essi fossero human-readable.

.. code-block:: text

   /i/{ISTANZA}
      /l/logged-in
         /g/{GROUP_SLUG}
            /p/{PROJECT_SLUG}
               /n/{NOTEBOOK_SLUG}/

Ad esempio, l'URL per il notebook ``my-first-notebook`` dell'istanza demo di Sophon sarebbe:

.. code-block:: text

   /i/https:api.prod.sophon.steffo.eu:
      /l/logged-in
         /g/my-first-group
            /p/my-first-project
               /n/my-first-notebook/


Parsing degli URL contestuali
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Viene definita una funzione in grado di comprendere gli URL contestuali:

.. function:: parsePath(path)

   :param path: Il "path" da leggere.
   :returns:
      Un oggetto con le seguenti chiavi, dette "segmenti di percorso", le quali possono essere :data:`undefined` per indicare che non è stato selezionato un oggetto di quel tipo:

      - ``instance``: l'URL dell'istanza da utilizzare, con caratteri speciali sostituiti da ``:``
      - ``loggedIn``: :class:`Boolean`, se :data:`True` l'utente ha effettuato il login (anche come ospite)
      - ``researchGroup``: lo slug del `gruppo di ricerca <Gruppi di ricerca in Sophon>` selezionato
      - ``researchProject``: lo slug del `progetto di ricerca <Progetti di ricerca in Sophon>` selezionato
      - ``notebook``: lo slug del `notebook <Notebook in Sophon>` selezionato

      Ad esempio, l'URL precedente restituirebbe il seguente oggetto se processato:

      .. code-block:: js

         {
            "instance": "https:api.prod.sophon.steffo.eu:",
            "loggedIn": True,
            "researchGroup": "my-first-group",
            "researchProject": "my-first-project",
            "notebook": "my-first-notebook"
         }


Componenti contestuali
^^^^^^^^^^^^^^^^^^^^^^

Per ciascun contesto sono stati realizzati vari componenti.

I più significativi comuni a tutti i contesti sono i `ResourcePanel` e le `ListBox`.

.. function:: ResourcePanel({...})

   Panello che rappresenta un'`entità di Sophon <Entità di Sophon>`, diviso in quattro parti:

   *  icona (a sinistra)
   *  nome della risorsa (a destra dell'icona)
   *  bottoni (a destra)
   *  testo (a sinistra dei bottoni)

   .. figure:: resource_panel.png

      Un `ResourcePanel` rappresentante un `gruppo di ricerca <Gruppi di ricerca in Sophon>`.

.. function:: ListBox({...})

   Riquadro che mostra le risorse di un `useManagedViewSet` raffigurandole come tanti `ResourcePanel`.

   .. figure:: list_box.png

      Un `ListBox` che mostra l'elenco di notebook in un progetto.


Routing basato sui contesti
^^^^^^^^^^^^^^^^^^^^^^^^^^^

I valori dei contesti vengono utilizzati per selezionare i componenti da mostrare all'utente nell'interfaccia grafica attraverso i seguenti componenti:

.. function:: ResourceRouter({selection, unselectedRoute, selectedRoute})

   Componente che sceglie se renderizzare ``unselectedRoute`` o ``selectedRoute`` in base alla *nullità* o *non-nullità* di ``selection``.

.. function:: ViewSetRouter({viewSet, unselectedRoute, selectedRoute, pathSegment, pkKey})

   Componente basato su :func:`ResourceRouter` che seleziona automaticamente l'elemento del viewset avente il valore del segmento di percorso ``pathSegment`` alla chiave ``pkKey``.


Esempio di utilizzo di ViewSetRouter
""""""""""""""""""""""""""""""""""""

.. function:: GroupRouter({...props})

   Implementato come:

   .. code-block:: jsx

        <ViewSetRouter
            {...props}
            viewSet={useManagedViewSet<SophonResearchGroup>("/api/core/groups/", "slug")}
            pathSegment={"researchGroup"}
            pkKey={"slug"}
        />


Albero completo dei contesti
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

L'insieme di tutti i contesti è definito come componente :func:`App` nel modulo "principale" ``App.tsx``.

Se ne riassume la struttura in pseudocodice:

.. code-block:: html

   <InstanceContext>
      <InstanceRouter>
         unselected:
            <InstanceSelect>
         selected:
            <AuthorizationContext>
               <AuthorizationRouter>
                  unselected:
                     <UserLogin>
                  selected:
                     <GroupContext>
                        <GroupRouter>
                           unselected:
                              <GroupSelect>
                           selected:
                              <ProjectContext>
                                 <ProjectRouter>
                                    unselected:
                                       <ProjectSelect>
                                    selected:
                                       <NotebookContext>
                                          <NotebookRouter>
                                             unselected:
                                                <NotebookSelect>
                                             selected:
                                                <NotebookDetails>


Altri contesti
^^^^^^^^^^^^^^

Tema
""""

Il tema dell'istanza è implementato come uno speciale contesto globale :data:`ThemeContext` che riceve i dettagli dell'istanza a cui si è collegati dall':data:`InstanceContext`.


Cache
"""""

Viene salvato l'elenco di tutti i membri dell'`istanza <Istanza in Sophon>` in uno speciale contesto :data:`CacheContext` in modo da poter risolvere gli id degli utenti al loro username senza dover effettuare ulteriori richieste.


Containerizzazione del modulo frontend
--------------------------------------

Il modulo frontend è incapsulato in un'immagine :ref:`Docker` basata sull'immagine ufficiale `node:16.11.1-bullseye <https://hub.docker.com/_/node>`_.

L'immagine installa le dipendenze del modulo con `Yarn`, per poi eseguire il comando ``yarn run serve``, che avvia la procedura di preparazione della pagina e la rende disponibile su un webserver locale alla porta 3000.


Realizzazione del modulo proxy
==============================

Il modulo proxy consiste in un file di configurazione di `Apache HTTP Server`.

Il file di configurazione abilita i moduli httpd `rewrite`_, `proxy`_, `proxy_wstunnel`_ e `proxy_http`_, impostando quest'ultimo per inoltrare l'header `Host`_ alle pagine verso cui viene effettuato reverse proxying.

.. _rewrite: https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html
.. _proxy: https://httpd.apache.org/docs/2.4/mod/mod_proxy.html
.. _proxy_http: https://httpd.apache.org/docs/2.4/mod/mod_proxy_http.html
.. _proxy_wstunnel: https://httpd.apache.org/docs/2.4/mod/mod_proxy_wstunnel.html
.. _Host: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host

Inoltre, nel file di configurazione viene abilitato il ``RewriteEngine``, che viene utilizzato per effettuare reverse proxying secondo le seguenti regole:

#. Tutte le richieste verso ``static.`` prefisso ad :env:`APACHE_PROXY_BASE_DOMAIN` vengono processate direttamente dal webserver, utilizzando i file disponibili nella cartella ``/var/www/html/django-static`` che gli vengono forniti dal volume ``django-static`` del :ref:`modulo backend`.

   .. code-block:: apacheconf

      # If ENV:APACHE_PROXY_BASE_DOMAIN equals HTTP_HOST
      RewriteCond "static.%{ENV:APACHE_PROXY_BASE_DOMAIN} %{HTTP_HOST}" "^([^ ]+) \1$" [NC]
      # Process the request yourself
      RewriteRule ".?" - [L]

#. Tutte le richieste verso :env:`APACHE_PROXY_BASE_DOMAIN` senza nessun sottodominio vengono inoltrate al container Docker del :ref:`modulo frontend` utilizzando la risoluzione dei nomi di dominio di Docker Compose.

   .. code-block:: apacheconf

      # If ENV:APACHE_PROXY_BASE_DOMAIN equals HTTP_HOST
      RewriteCond "%{ENV:APACHE_PROXY_BASE_DOMAIN} %{HTTP_HOST}" "^([^ ]+) \1$" [NC]
      # Capture ENV:SOPHON_FRONTEND_NAME for substitution in the rewriterule
      RewriteCond "%{ENV:SOPHON_FRONTEND_NAME}" "^(.+)$" [NC]
      # Forward to the frontend
      RewriteRule "/(.*)" "http://%1/$1" [P,L]

#. Tutte le richieste verso ``api.`` prefisso ad :env:`APACHE_PROXY_BASE_DOMAIN` vengono inoltrate al container Docker del :ref:`modulo backend` utilizzando la risoluzione dei nomi di dominio di Docker Compose.

   .. code-block:: apacheconf

      # If api. prefixed to ENV:APACHE_PROXY_BASE_DOMAIN equals HTTP_HOST
      RewriteCond "api.%{ENV:APACHE_PROXY_BASE_DOMAIN} %{HTTP_HOST}" "^([^ ]+) \1$" [NC]
      # Capture ENV:SOPHON_BACKEND_NAME for substitution in the rewriterule
      RewriteCond "%{ENV:SOPHON_BACKEND_NAME}" "^(.+)$" [NC]
      # Forward to the backend
      RewriteRule "/(.*)" "http://%1/$1" [P,L]

#. Carica in memoria la rubrica dei notebook generata dal :ref:`modulo backend` e disponibile in ``/run/sophon/proxy/proxy.dbm`` attraverso il volume ``proxy-data``, assegnandogli il nome di ``sophonproxy``.

   .. code-block:: apacheconf

      # Create a map between the proxy file generated by Sophon and Apache
      RewriteMap "sophonproxy" "dbm=gdbm:/run/sophon/proxy/proxy.dbm"

#. Effettua il proxying dei websocket verso i notebook mappati dalla rubrica ``sophonproxy``.

   .. code-block:: apacheconf

      # If this is any other subdomain of ENV:APACHE_PROXY_BASE_DOMAIN
      RewriteCond ".%{ENV:APACHE_PROXY_BASE_DOMAIN} %{HTTP_HOST}" "^([^ ]+) [^ ]+\1$" [NC]
      # If this is a websocket connection
      RewriteCond "%{HTTP:Connection}" "Upgrade" [NC]
      RewriteCond "%{HTTP:Upgrade}" "websocket" [NC]
      # Forward to the notebook
      RewriteRule "/(.*)" "ws://${sophonproxy:%{HTTP_HOST}}/$1" [P,L]

#. Effettua il proxying delle richieste "normali" verso i notebook mappati dalla rubrica ``sophonproxy``.

   .. code-block:: apacheconf

      # If this is any other subdomain of ENV:APACHE_PROXY_BASE_DOMAIN
      RewriteCond ".%{ENV:APACHE_PROXY_BASE_DOMAIN} %{HTTP_HOST}" "^([^ ]+) [^ ]+\1$" [NC]
      # Forward to the notebook
      RewriteRule "/(.*)" "http://${sophonproxy:%{HTTP_HOST}}/$1" [P,L]

Tutte le regole usano il flag ``L`` di ``RewriteRule``, che porta il motore di rewriting a ignorare tutte le regole successive, come il ``return`` di una funzione di un linguaggio di programmazione imperativo.


Dockerizzazione del modulo proxy
--------------------------------

Il modulo proxy è incapsulato in un'immagine :ref:`Docker` basata sull'immagine ufficiale `httpd:2.4 <https://hub.docker.com/_/httpd>`_, che si limita ad applicare la configurazione personalizzata.


Realizzazione del modulo Jupyter
================================

Il *modulo Jupyter* consiste in un ambiente `Jupyter <https://jupyter.org/>`_ e `JupyterLab <https://jupyterlab.readthedocs.io/en/stable/>`_ modificato per una migliore integrazione con Sophon, in particolare con il :ref:`modulo frontend` e il :ref:`modulo backend`.

È collocato all'interno del repository in ``/jupyter``.


Sviluppo del tema per Jupyter
-----------------------------

Per rendere l'interfaccia grafica più consistente ed user-friendly, è stato sviluppato un tema colori personalizzato per `JupyterLab`.

È stato creato partendo dal template `jupyterlab/theme-cookiecutter <https://github.com/jupyterlab/theme-cookiecutter>`_, e in esso sono state modificati le variabili di stile (contenute nel file ``style/variables.css``) usando i colori del tema "The Sophonity" di `Bluelib`.

È stato poi pubblicato sull':abbr:`PyPI (Python Package Index)` e su `npm`, permettendone l'uso a tutti gli utenti di JupyterLab.

.. note::

   Per facilitarne la distribuzione e il riutilizzo anche esternamente a Sophon, il tema è stato creato in un repository `Git` esterno a quello del progetto.


Estensione del container Docker di Jupyter
------------------------------------------

Il ``Dockerfile`` del modulo ne crea un immagine Docker in quattro fasi:

#. **Base**: Parte dall'immagine base ``jupyter/scipy-notebook`` e ne altera i label.

   .. code-block:: docker

      FROM jupyter/scipy-notebook AS base
      # Set the maintainer label
      LABEL maintainer="Stefano Pigozzi <me@steffo.eu>"

#. **Env**: Configura le variabili di ambiente dell'immagine, attivando JupyterLab, configurando il riavvio automatico di Jupyter e permettendo all'utente non-privilegiato di acquisire i privilegi di root attraverso il comando ``sudo``.

   .. code-block:: docker

      FROM base AS env
      # Set useful envvars for Sophon notebooks
      ENV JUPYTER_ENABLE_LAB=yes
      ENV RESTARTABLE=yes
      ENV GRANT_SUDO=yes

#. **Extensions**: Installa, abilita e configura le estensioni necessarie all'integrazione con Sophon (attualmente, soltanto il tema JupyterLab Sophon).

   .. code-block:: docker

      FROM env AS extensions
      # As the default user...
      USER ${NB_UID}
      WORKDIR "${HOME}"
      # Install the JupyterLab Sophon theme
      RUN jupyter labextension install "jupyterlab_theme_sophon"
      # Enable the JupyterLab Sophon theme
      RUN jupyter labextension enable "jupyterlab_theme_sophon"
      # Set the JupyterLab Sophon theme as default
      RUN mkdir -p '.jupyter/lab/user-settings/@jupyterlab/apputils-extension/'
      RUN echo '{"theme": "JupyterLab Sophon"}' > ".jupyter/lab/user-settings/@jupyterlab/apputils-extension/themes.jupyterlab-settings"

#. **Healthcheck**: Installa `curl <https://curl.se/>`_, uno strumento in grado di effettuare richieste :abbr:`HTTP (HyperText Transfer Protocol` da linea di comando, e configura la verifica dello `stato di salute <Controllo dello stato di salute>` dell'immagine, al fine di comunicare al `modulo backend <Modulo backend>` il risultato di una richiesta di avvio.

   .. code-block:: docker

      FROM extensions AS healthcheck
      # As root...
      USER root
      # Install curl
      RUN apt-get update
      RUN apt-get install -y curl
      # Use curl to check the health status
      HEALTHCHECK --start-period=5s --timeout=5s --interval=10s CMD ["curl", "--output", "/dev/null", "http://localhost:8888"]

      # We probably should go back to the default user
      USER ${NB_UID}


Automazione di sviluppo
=======================

Al fine di snellire lo sviluppo del software, è stato configurato lo strumento di automazione `GitHub Actions <https://github.com/features/actions>`_ per effettuare automaticamente alcuni compiti.


Scansione automatica delle dipendenze
-------------------------------------

È stato abilitato su :ref:`GitHub` il supporto a `Dependabot <https://docs.github.com/en/code-security/supply-chain-security/managing-vulnerabilities-in-your-projects-dependencies/configuring-dependabot-security-updates>`_, un software che scansiona le dipendenze dei vari moduli e notifica gli sviluppatori qualora una o più di esse siano vulnerabili ad exploit.

.. figure:: dependabot.png

   Alcune vulnerabilità rilevate da Dependabot all'interno delle dipendenze di Sophon.


Controllo automatico del codice
-------------------------------

Sono state configurate due azioni, ``analyze-codeql-backend`` e ``analyze-codeql-frontend``, che usano `CodeQL <https://codeql.github.com/>`_ per scansionare staticamente il codice e identificare problemi o vulnerabilità.

La prima, ``analyze-codeql-backend``, viene eseguita solo quando viene inviato a GitHub nuovo codice relativo al `modulo backend <Modulo backend>`, ed effettua analisi specifiche a `Python`, mentre la seconda, ``analyze-codeql-frontend``, viene eseguita solo quando viene inviato nuovo codice del `modulo frontend <Modulo frontend>`, ed effettua analisi specifiche a JavaScript.

Si riportano due estratti relativi all'azione ``analyze-codeql-backend``.

.. code-block:: yaml

   on:
      push:
         branches: [ main ]
         paths:
            - "backend/**"

.. code-block:: yaml

   steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v1
        with:
          languages: "python"
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v1


Costruzione automatica delle immagini Docker
--------------------------------------------

Sono state configurate quattro azioni, ``build-docker-frontend``, ``build-docker-backend``, ``build-docker-jupyter`` e ``build-docker-proxy``, che costruiscono automaticamente l'immagine :ref:`Docker` di ciascun modulo qualora il relativo codice venga modificato.

L'immagine creata viene poi caricata sul `GitHub Container Registry <https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry>`_, da cui può poi essere scaricata attraverso :ref:`Docker`.

Si riporta un estratto relativo all'azione ``build-docker-proxy``.

.. code-block:: yml

   steps:
      - name: "Checkout repository"
        uses: actions/checkout@v2
      - name: "Login to GitHub Containers"
        run: echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u Steffo99 --password-stdin
      - name: "Build the docker container `ghcr.io/steffo99/sophon-proxy:latest`"
        run: docker build ./proxy --tag ghcr.io/steffo99/sophon-proxy:latest
      - name: "Upload the container to GitHub Containers"
        run: docker push ghcr.io/steffo99/sophon-proxy:latest


Costruzione automatica della documentazione
-------------------------------------------

Sono state configurate due azioni, ``build-sphinx-report`` e ``build-sphinx-thesis``, che compilano rispettivamente la documentazione richiesta per l'esame di Tecnologie Web e questa stessa tesi usando lo strumento `Sphinx <https://www.sphinx-doc.org/en/master/>`_.

La documentazione per l'esame viene compilata solo da `reStructuredText <https://docutils.sourceforge.io/rst.html>`_ ad HTML; la tesi, invece, viene compilata sia in HTML sia in PDF.

Si riporta un estratto relativo all'azione ``build-sphinx-thesis``.

.. code-block:: yml

   latexpdf:
      name: "Build PDF document"
      runs-on: ubuntu-latest
      steps:
         - name: "Update apt repositories"
           run: sudo apt-get update -y
         - name: "Checkout repository"
           uses: actions/checkout@v2
           with:
              lfs: true
         - name: "Checkout LFS objects"
           run: git lfs checkout
         - name: "Setup Python"
           uses: actions/setup-python@v2
           with:
              python-version: 3.9
         - name: "Setup Poetry"
           uses: abatilo/actions-poetry@v2.0.0
           with:
              poetry-version: 1.1.11
         - name: "Install LaTeX packages"
           run: sudo apt-get install -y latexmk texlive-latex-recommended texlive-latex-extra texlive-fonts-recommended texlive-luatex fonts-ebgaramond fonts-ebgaramond-extra fonts-firacode xindy
         - name: "Install backend dependencies"
           working-directory: backend/
           run: poetry install --no-interaction
         - name: "Find Poetry Python environment"
           working-directory: backend/
           run: echo "pythonLocation=$(poetry env list --full-path | cut -f1 -d' ')/bin" >> $GITHUB_ENV
         - name: "Build LaTeX document with Sphinx"
           working-directory: thesis/
           run: |
              source $pythonLocation/activate
              make latexpdf
         - name: "Upload build artifact"
           uses: actions/upload-artifact@v2
           with:
              name: "thesis.pdf"
              path: "thesis/build/latex/progettazioneesviluppodisophonapplicativocloudasupportodellaricerca.pdf"
