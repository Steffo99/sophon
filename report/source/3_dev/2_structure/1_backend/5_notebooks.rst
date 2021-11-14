L'app sophon.notebooks
----------------------
.. default-domain:: py
.. default-role:: obj
.. module:: sophon.notebooks


L'app `sophon.notebooks` è un app secondaria che dipende da `sophon.projects` che introduce in Sophon il concetto di :ref:`notebook`.

.. caution::

   Anche se l'app `sophon.notebooks` è opzionale (il progetto può funzionare senza di essa), si sconsiglia di disattivarla, in quanto il :ref:`modulo frontend` si aspetta che l'app sia attiva e solleverà un errore nel caso che i viewset forniti da questa app non siano disponibile.


Funzionamento di un notebook
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Internamente, un notebook non è altro che un container Docker accessibile ad un determinato indirizzo il cui stato è sincronizzato con un oggetto del database del :ref:`modulo backend`.


Modalità sviluppo
"""""""""""""""""

Per facilitare lo sviluppo di Sophon, sono previste due modalità di operazione di quest'ultimo:

- nella prima, la **modalità sviluppo**, il :ref:`modulo proxy` non è in esecuzione, ed è possibile collegarsi direttamente ai container attraverso collegamenti a ``localhost``;

- nella seconda, la **modalità produzione**, il :ref:`modulo proxy` è in esecuzione all'interno di un container Docker, e si collega agli altri container attraverso i rispettivi network Docker agli indirizzi comunicatogli dal :ref:`modulo backend`.

  .. image:: notebooks_diagram.png


Gestione della rubrica del proxy
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.notebooks.apache

Viene creata una classe per la gestione della rubrica del proxy, utilizzando il modulo `dbm.gnu`, supportato da HTTPd.

La rubrica mappa gli URL pubblici dei notebook a URL privati relativi al :ref:`modulo proxy`, in modo da effettuare reverse proxying **dinamico**.

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

Per facilitare l'utilizzo del daemon Docker per la gestione dei container dei notebook, viene utilizzato il modulo `docker`.

.. function:: get_docker_client() -> docker.DockerClient

   Funzione che crea un client Docker con le variabili di ambiente del modulo.

.. data:: client: docker.DockerClient = lazy_object_proxy.Proxy(get_docker_client)

   Viene creato un client Docker globale con inizializzazione lazy al fine di non tentare connessioni (lente!) al daemon quando non sono necessarie.


Controllo dello stato di salute
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Il modulo `docker` viene esteso implementando supporto per l'istruzione ``HEALTHCHECK`` dei ``Dockerfile``.

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


Generazione di token sicuri
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Si è scelto di rendere completamente trasparente all'utente il meccanismo di autenticazione a JupyterLab.

Pertanto, si è verificata la necessità di generare token crittograficamente sicuri da richiedere per l'accesso a JupyterLab.

.. function:: generate_secure_token() -> str

   Funzione che utilizza `secrets.token_urlsafe` per generare un token valido e crittograficamente sicuro.


Modello dei notebook
^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.notebooks.models

Viene definito il modello rappresentante un :ref:`notebook`.

.. class:: Notebook(SophonGroupModel)

   .. attribute:: slug: SlugField

      Lo slug dei notebook prevede ulteriori restrizioni oltre a quelle previste dallo `django.db.models.SlugField`:

      - non può essere uno dei seguenti valori: ``api``, ``static``, ``proxy``, ``backend``, ``frontend``, ``src``;
      - non può iniziare o finire con un trattino ``-``.

   .. attribute:: project: ForeignKey → sophon.projects.models.ResearchProject
   .. attribute:: name: CharField
   .. attribute:: locked_by: ForeignKey → django.contrib.auth.models.User

   .. attribute:: container_image: CharField ["ghcr.io/steffo99/sophon-jupyter"]

      Campo che specifica l'immagine che il client Docker dovrà avviare per questo notebook.

      Al momento ne è configurata una sola per semplificare l'esperienza utente, ma altre possono essere specificate per permettere agli utenti più scelta.

      .. note::

         Al momento, le immagini specificate devono esporre un server web sulla porta ``8888``, e supportare il protocollo di connessione di Jupyter, ovvero :samp:`{PROTOCOLLO}://immagine:8888/lab?token={TOKEN}` e :samp:`{PROTOCOLLO}://immagine:8888/tree?token={TOKEN}`.

   .. attribute:: jupyter_token: CharField

      Il token segreto che verrà passato attraverso le variabili di ambiente al container Docker dell'oggetto per permettere solo agli utenti autorizzati di accedere a quest'ultimo.

   .. attribute:: container_id: CharField

      L'id assegnato dal daemon Docker al container di questo oggetto.

      Se il notebook non è avviato, questo attributo varrà `None`.

   .. attribute:: port: IntegerField

      La porta assegnata al container Docker dell'oggetto nel caso in cui Sophon sia avviato in "modalità sviluppo", ovvero con il :ref:`modulo proxy` in esecuzione sul sistema host.

   .. attribute:: internal_url: CharField

      L'URL a cui è accessibile il container Docker dell'oggetto nel caso in cui Sophon non sia avviato in "modalità sviluppo", ovvero con il :ref:`modulo proxy` in esecuzione all'interno di un container.

   .. method:: log(self) -> logging.Logger
      :property:

      Viene creato un `logging.Logger` per ogni oggetto della classe, in modo da facilitare il debug relativo ad uno specifico notebook.

      Il nome del logger ha la forma :samp:`sophon.notebooks.models.Notebook.{NOTEBOOK_SLUG}`.

   .. method:: enable_proxying(self) -> None

      Aggiunge l'indirizzo del notebook alla rubrica del proxy.

   .. method:: disable_proxying(self) -> None

      Rimuove l'indirizzo del notebook dalla rubrica del proxy.

   .. method:: sync_container(self) -> t.Optional[docker.models.containers.Container]

      Sincronizza lo stato dell'oggetto nel database con lo stato del container Docker nel sistema.

   .. method:: create_container(self) -> docker.models.containers.Container

      Crea e configura un container Docker per l'oggetto, con l'immagine specificata in `.container_image`.

   .. method:: start(self) -> None

      Tenta di creare e avviare un container Docker per l'oggetto, bloccando fino a quando esso non sarà avviato con `~.docker.sleep_until_container_has_started`.

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

   Accessibile all'URL :samp:`/api/notebooks/by-project/{PROJECT_SLUG}/{NOTEBOOK_SLUG/`.
