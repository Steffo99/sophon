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

.. class:: ApacheDB

   Classe che permette il recupero, la creazione, la modifica e l'eliminazioni di chiavi di un database `dbm.gnu` come se quest'ultimo fosse un `dict` con supporto a chiavi e valori `str` e `bytes`.

   .. staticmethod:: convert_to_bytes(item: typing.Union[str, bytes]) -> bytes

      Tutte le `str` passate a questa classe vengono convertite in `bytes` attraverso questa funzione, che effettua un encoding in ASCII e solleva un errore se quest'ultimo fallisce.


Assegnazione porta effimera
^^^^^^^^^^^^^^^^^^^^^^^^^^^

In modalità sviluppo, è necessario trovare una porta libera a cui rendere accessibile i container Docker dei notebook.

.. function:: get_ephemeral_port() -> int

   Questa funzione apre e chiude immediatamente un `socket.socket` all'indirizzo ``localhost:0`` in modo da ricevere dal sistema operativo un numero di porta sicuramente libero.


Modello dei notebook
^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.notebooks.models

Viene definito il modello rappresentante un :ref:`notebook`.

.. class:: Notebook(SophonGroupModel)

   .. attribute:: slug: SlugField
   .. attribute:: project: ForeignKey → sophon.projects.models.ResearchProject
   .. attribute:: name: CharField
   .. attribute:: locked_by: ForeignKey → django.contrib.auth.models.User
   .. attribute:: container_image: CharField ["ghcr.io/steffo99/sophon-jupyter"]
   .. attribute:: jupyter_token: CharField

      Il token segreto che verrà passato attraverso le variabili di ambiente al container Docker dell'oggetto per permettere solo agli utenti autorizzati di accedere a quest'ultimo.

   .. attribute:: container_id: CharField
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

   .. method:: stop_container(self) -> None

      Arresta il container Docker dell'oggetto.

   .. method:: sleep_until_container_has_started(self) -> None

      Attende che il container Docker dell'oggetto si sia avviato.

