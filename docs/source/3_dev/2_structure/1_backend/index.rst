Modulo backend
==============
.. default-domain:: py
.. default-role:: obj
.. py:currentmodule:: sophon

Il *modulo backend* consiste in un server web che consente agli utenti:

- Attraverso l'API:
   - *autenticazione* e *autorizzazione* degli utenti;
   - *visualizzazione*, *interazione*, *creazione*, *modifica* ed *eliminazione* di gruppi di ricerca, progetti di ricerca e notebook
   - *visualizzazione* di utenti e dettagli sull'istanza Sophon.

- Attraverso pagine web dinamiche:
   - *amministrazione* dell'istanza Sophon.

Inoltre, effettua le seguenti operazioni in risposta a determinate richieste effettuate dagli utenti:

- *configurazione*, *avvio* e *arresto* di container Docker basati sulle immagini specificate dai notebook;
- *configurazione*, *attivazione* e *disattivazione* del servizio di proxying effettuato dal :ref:`modulo proxy`.


Librerie e tecnologie utilizzate
--------------------------------

.. note::

   Sono elencate solo le principali librerie utilizzate; dipendenze e librerie minori non sono specificate, ma sono visibili all'interno del file ``poetry.lock``.

- Il linguaggio di programmazione `Python <https://www.python.org/>`_
   - Il gestore di dipendenze `Poetry <https://python-poetry.org/>`_
   - Il framework web `Django <https://www.djangoproject.com/>`_
      - L'estensione per Django `Django REST Framework <https://www.django-rest-framework.org/>`_
      - L'estensione per Django `Django CORS Headers <https://github.com/adamchainz/django-cors-headers>`_
   - L'adattatore database per PostgreSQL `Psycopg <https://pypi.org/project/psycopg2/>`_
   - Il `Docker SDK for Python <https://docker-py.readthedocs.io/en/stable/>`_
   - I server web `Gunicorn <https://gunicorn.org/>`_ e `Uvicorn <https://www.uvicorn.org/>`_
   - L'utilità `lazy-object-proxy <https://github.com/ionelmc/python-lazy-object-proxy>`_


Struttura del modulo
--------------------

Il modulo consiste nel package Python :mod:`sophon`, che contiene al suo interno un progetto Django, che a sua volta contiene tre app Django.

Il progetto `sophon`
^^^^^^^^^^^^^^^^^^^^
.. module:: sophon


L'app `sophon.core`
^^^^^^^^^^^^^^^^^^^
.. module:: sophon.core


L'app `sophon.projects`
^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.projects


L'app `sophon.notebooks`
^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.notebooks

