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

È collocato all'interno del repository in ``/backend``.


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

Il progetto Django Sophon aggiunge varie funzionalità al template base dei progetti Django.


Pagina di amministrazione personalizzata
""""""""""""""""""""""""""""""""""""""""

.. module:: sophon.admin

.. class:: SophonAdminSite(django.contrib.admin.AdminSite)

   La pagina di amministrazione viene personalizzata con la classe `SophonAdminSite`, che sovrascrive alcuni parametri della classe di default.

   Inoltre, il template predefinito viene sovrascritto da quello all'interno del file ``templates/admin/base.html``, che sostituisce il foglio di stile con uno personalizzato per Sophon.

   .. attribute:: site_header = "Sophon Server Administration"

      Il nome della pagina nell'header viene modificato a *Sophon Server Administration*.

   .. attribute:: site_title = "Sophon Server Administration"

      Il titolo della pagina nell'header viene anch'esso modificato a *Sophon Server Administration*.

   .. attribute:: site_url = None

      Il collegamento *View Site* viene rimosso, in quanto è possibile accedere all'interfaccia web di Sophon da più domini contemporaneamente.

   .. attribute:: index_title = "Resources Administration"

      Il titolo dell'indice viene modificato a *Resources Administration*.

.. class:: SophonAdminConfig(django.contrib.admin.apps.AdminConfig)

   La configurazione di default della pagina di amministrazione viene sovrascritta da questa classe.

   .. attribute:: default_site = "sophon.admin.SophonAdminSite"

      `.SophonAdminSite` è selezionata come classe predefinita.


Impostazioni dinamiche
""""""""""""""""""""""
.. module:: sophon.settings

Il file di impostazioni viene modificato per **permettere la configurazione attraverso variabili di ambiente** invece che attraverso il file ``settings.py``, rendendo il deployment con Docker molto più semplice.

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


Autenticazione migliorata
"""""""""""""""""""""""""
.. module:: sophon.auth1

.. class:: BearerTokenAuthentication(rest_framework.authentication.TokenAuthentication)

   La classe `rest_framework.authentication.TokenAuthentication` viene modificata per ottenere un comportamento conforme agli standard del web.

   .. attribute:: keyword = "Bearer"

      Si configura `rest_framework` per accettare header di autenticazione nella forma ``Bearer <token>``, invece che ``Token <token>``.

.. module:: sophon.auth2

.. class:: CustomObtainAuthToken(rest_framework.authtoken.views.ObtainAuthToken)

   La view `rest_framework.authtoken.views.ObtainAuthToken` viene estesa per aggiungere dati alla risposta di autenticazione riuscita.

   .. method:: post(self, request, *args, **kwargs)

      In particolare, viene aggiunta una chiave ``user``, che contiene i dettagli sull'utente che ha effettuato il login.

.. todo: whoa ma io mi ero scordato di sta cosa


L'app `sophon.core`
^^^^^^^^^^^^^^^^^^^
.. module:: sophon.core


L'app `sophon.projects`
^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.projects


L'app `sophon.notebooks`
^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.notebooks

