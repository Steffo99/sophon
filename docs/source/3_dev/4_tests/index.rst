Test effettuati
===============

Per motivi di tempo necessario, sono state selezionate solo alcune parti di codice su cui effettuare test.


Tutti i viewset di :py:mod:`sophon.core`
----------------------------------------
.. default-domain:: py
.. default-role:: py:obj
.. module:: sophon.core.tests


Test case generici
^^^^^^^^^^^^^^^^^^

Vengono definiti alcuni test case generici per facilitare le interazioni tra ``APITestCase`` e viewset.

.. note::

   I nomi delle funzioni usano nomi con capitalizzazione inconsistente in quanto lo stesso modulo `unittest` non rispetta lo stile suggerito in :pep:`8`.

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


Alcune interazioni di `sophon.notebooks`
----------------------------------------
.. default-domain:: py
.. default-role:: py:obj
.. module:: sophon.notebooks.tests

Vengono definiti alcuni test case per alcune interazioni dell'app `sophon.notebooks`.

.. class:: JupyterTestCase(TestCase)

   Test case che testa la generazione dei token per Jupyter.

.. class:: ApacheTestCase(TestCase)

   Test case che testa la conversione in `bytes` per la rubrica `dbm` del :ref:`modulo proxy`.


Alcune interazioni complicate del frontend
------------------------------------------
.. default-domain:: js
.. default-role:: js:class

Vengono infine definiti test case per alcune interazioni ritenute particolarmente complesse del frontend.


Encoding dell'URL dell'istanza nell'URL della pagina
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

- encodes pathless URL
- encodes URL with port number
- encodes URL with simple path
- encodes URL with colon in path
- does not encode URL with ``%3A`` in path
- decodes pathless URL
- decodes URL with port number
- decodes URL with simple path
- decodes URL with colon in path


Parsing dei segmenti del path
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

- parses empty path
- parses instance path
- parses research group path
- parses research project path
- parses notebook path
