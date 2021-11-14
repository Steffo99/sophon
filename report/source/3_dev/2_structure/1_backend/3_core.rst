L'app sophon.core
-----------------
.. default-domain:: py
.. default-role:: obj
.. module:: sophon.core

L'app `sophon.core` è l'app principale del progetto, e non può essere disattivata, in quanto dipendenza obbligatoria di tutte le altre app.


Aggiunta di un nuovo comando di gestione
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.core.management.commands.initsuperuser

Per permettere l'integrazione la creazione automatica del primo :ref:`superutente` quando Sophon viene eseguito da Docker, viene introdotto dall'app il comando di gestione ``initsuperuser``.

.. class:: Command

   Questo comando crea automaticamente un :ref:`superutente` con le credenziali specificate in :ref:`\`\`DJANGO_SU_USERNAME\`\``, :ref:`\`\`DJANGO_SU_EMAIL\`\`` e :ref:`\`\`DJANGO_SU_PASSWORD\`\``.


Modello base astratto
^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.core.models

Viene estesa la classe astratta `django.db.models.Model` con funzioni per stabilire il livello di accesso di un utente all'oggetto e per generare automaticamente i `rest_framework.serializers.ModelSerializer` in base al livello di accesso.

.. class:: SophonModel(django.db.models.Model)

   .. method:: can_edit(self, user: django.contrib.auth.models.User) -> bool
      :abstractmethod:

      Controlla se un utente può modificare l'oggetto attuale.

      :param user: L'utente da controllare.
      :returns: `True` se l'utente deve poter modificare l'oggetto, altrimenti `False`.

   .. method:: can_admin(self, user: django.contrib.auth.models.User) -> bool
      :abstractmethod:

      Controlla se un utente può amministrare l'oggetto attuale.

      :param user: L'utente da controllare.
      :returns: `True` se l'utente deve poter amministrare l'oggetto, altrimenti `False`.

   .. classmethod:: get_fields(cls) -> set[str]

      :returns: il `set` di nomi di campi che devono essere mostrati quando viene richiesto l'oggetto attraverso l'API.

   .. classmethod:: get_editable_fields(cls) -> set[str]

      :returns: il `set` di nomi di campi di cui deve essere permessa la modifica se l'utente può modificare (`.can_edit`) l'oggetto.

   .. classmethod:: get_administrable_fields(cls) -> set[str]

      :returns: il `set` di nomi di campi di cui deve essere permessa la modifica se l'utente può amministrare (`.can_admin`) l'oggetto.

   .. classmethod:: get_creation_fields(cls) -> set[str]

      :returns: il `set` di nomi di campi che possono essere specificati dall'utente al momento della creazione dell'oggetto.


Modello di autorizzazione astratto
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Viene definito un nuovo modello astratto, basato su `SophonModel`, che permette di determinare i permessi dell'utente in base alla sua appartenenza al gruppo a cui è collegato l'oggetto implementatore.

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

   Enumerazione che stabilisce il livello di autorità che un utente può avere all'interno di un gruppo.

   .. attribute:: NONE = 0

      Utente :ref:`ospite`.

   .. attribute:: REGISTERED = 10

      :ref:`Utente` registrato.

   .. attribute:: MEMBER = 50

      Membro del :ref:`gruppo di ricerca`.

   .. attribute:: OWNER = 100

      Creatore del :ref:`gruppo di ricerca`.

   .. attribute:: SUPERUSER = 200

      :ref:`Superutente` con privilegi universali.


Modello dei dettagli dell'istanza
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Viene creato il modello che rappresenta i dettagli dell':ref:`istanza` Sophon.

.. class:: SophonInstanceDetails(SophonModel)

   .. attribute:: id: IntegerField [1]

      Impostando ``1`` come unica scelta per il campo della chiave primaria ``id``, si crea un modello "singleton", ovvero un modello di cui può esistere un'istanza sola in tutto il database.

      L'istanza unica viene creata dalla migrazione ``0004_sophoninstancedetails.py``.

   .. attribute:: name: CharField
   .. attribute:: description: TextField
   .. attribute:: theme: CharField ["sophon", "paper", "royalblue", "hacker", "amber"]

   .. method:: version: str
      :property:

      :returns: La versione installata del pacchetto `sophon`.

   .. seealso::

      :ref:`Sophon instance details` nella guida per l'amministratore.


Modello del gruppo di ricerca
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Viene creato il modello che rappresenta un :ref:`gruppo di ricerca`.

.. class:: ResearchGroup(SophonGroupModel)

   .. attribute:: slug: SlugField
   .. attribute:: name: CharField
   .. attribute:: description: TextField
   .. attribute:: members: ManyToManyField → django.contrib.auth.models.User
   .. attribute:: owner: ForeignKey → django.contrib.auth.models.User
   .. attribute:: access: CharField ["MANUAL", "OPEN"]


Estensione ai permessi di Django
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.core.permissions

I permessi di `rest_framework` vengono estesi con due nuove classi che utilizzano il :ref:`modello di autorizzazione` precedentemente definito.

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

   .. method:: perform_update(self, serializer)

      .. deprecated:: 0.1

   .. method:: perform_destroy(self, serializer)

      .. deprecated:: 0.1

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


