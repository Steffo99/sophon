Comunicazione con il server
---------------------------
.. default-domain:: js


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

.. function:: useViewSet(baseRoute)

   Questo hook implementa tutte le azioni :py:mod:`rest_framework` di un viewset in lettura e scrittura.

   Richiede di essere chiamato all'interno di un :data:`AuthorizationContext`.

   .. function:: async list(config = {})
   .. function:: async retrieve(pk, config = {})
   .. function:: async create(config)
   .. function:: async update(pk, config)
   .. function:: async destroy(pk, config)

   Viene inoltre fornito supporto per le azioni personalizzate.

   .. function:: async command(config)

      Permette azioni personalizzate su tutto il viewset.

   .. function:: async action(config)

      Permette azioni personalizzate su uno specifico oggetto del viewset.


Emulazione di viewset
^^^^^^^^^^^^^^^^^^^^^

Viene creato un hook che tiene traccia degli oggetti restituiti da un determinato viewset, ed emula i risultati delle azioni effettuate, minimizzando i rerender e ottenendo una ottima user experience.

.. function:: useManagedViewSet(baseRoute, pkKey, refreshOnMount)

   .. attribute:: viewset

      Il viewset restituito da :func:`useViewSet`, utilizzato come interfaccia di basso livello per effettuare azioni.

   .. attribute:: state

      Lo stato del viewset, che tiene traccia degli oggetti e delle azioni in corso su di essi.

      Gli oggetti all'interno di esso sono istanze di :class:`ManagedResource`, create usando wrapper di :func:`.update`, :func:`.destroy` e :func:`.action`, che permettono di modificare direttamente l'oggetto senza preoccuparsi dell'indice a cui si trova nell'array.

   .. attribute:: dispatch

      Riduttore che permette di alterare lo :attr:`.state`.

   .. function:: async refresh()

      Ricarica gli oggetti del viewset.

      Viene chiamata automaticamente al primo render se ``refreshOnMount`` è :data:`True`.

   .. function:: async create(data)

      Crea un nuovo oggetto nel viewset con i dati specificati come argomento, e lo aggiunge allo stato se la richiesta va a buon fine.

   .. function:: async command(method, cmd, data)

      Esegue l'azione personalizzata ``cmd`` su tutto il viewset, utilizzando il metodo ``method`` e con i dati specificati in ``data``.

      Se la richiesta va a buon fine, il valore restituito dal backend sostituisce nello stato le risorse dell'intero viewset.

   .. function:: async update(index, data)

      Modifica l'oggetto alla posizione ``index`` dell'array :attr:`.state` con i dati specificati in ``data``.

      Se la richiesta va a buon fine, la modifica viene anche applicata all'interno di :attr:`.state`

   .. function:: async destroy(index)

      Elimina l'oggetto alla posizione ``index`` dell'array :attr:`.state`.

      Se la richiesta va a buon fine, l'oggetto viene eliminato anche da :attr:`.state`.

   .. function:: async action(index, method, act, data)

      Esegue l'azione personalizzata ``act`` sull'oggetto alla posizione ``index`` dell'array :attr:`.state`, utilizzando il metodo ``method`` e con i dati specificati in ``data``.

      Se la richiesta va a buon fine, il valore restituito dal backend sostituisce l'oggetto utilizzato in :attr:`.state`.
