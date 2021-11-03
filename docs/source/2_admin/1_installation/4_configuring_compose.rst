Configurazione ``docker-compose.yml``
=====================================

Si configuri con l'editor di testo preferito il file ``docker-compose.yml`` con le impostazioni desiderate.

.. code-block:: console

   root:/dock/sophon# open docker-compose.yml

In particolare, tutte le impostazioni precedute da ``# INSTALL`` vanno obbligatoriamente modificate.


``DJANGO_SECRET_KEY``
---------------------

Specifica la chiave segreta da usare per i cookie di sessione.

.. code-block:: yml

   - DJANGO_SECRET_KEY=do-not-use-this-key-in-production-or-you-will-get-hacked

.. tip::

   Un modo facile per impostare la chiave è premere velocemente tasti a caso sulla tastiera!

.. note::

   Cambiare la chiave segreta una volta installato Sophon invaliderà tutti gli accessi effettuati dagli utenti.

.. warning::

   La chiave segreta è un dato estremamente riservato: chiunque sia a conoscenza della chiave segreta potrà effettuare l'accesso come qualsiasi utente!

.. seealso::

   `SECRET_KEY <https://docs.djangoproject.com/en/3.2/ref/settings/#std:setting-SECRET_KEY>`_ nella documentazione di Django.


``DJANGO_PROXY_BASE_DOMAIN``
----------------------------

Specifica il dominio che dovrà essere usato come radice per il proxy, ovvero il ``DOMINIO`` per il quale si è configurato il DNS in precedenza.

.. code-block:: yml

   - DJANGO_PROXY_BASE_DOMAIN=prod.sophon.steffo.eu

.. note::

   Se non è specificato, Sophon verrà eseguito in modalità "sviluppo", e assegnerà porte libere del server ai :ref:`notebook` invece che sottodomini.

.. seealso::

   L'opzione :ref:`\`\`APACHE_PROXY_BASE_DOMAIN\`\`` più avanti in questa guida, che deve coincidere con questo valore.


``DJANGO_PROXY_PROTOCOL``
-------------------------

Specifica il protocollo che dovrà essere usato nei mapping del proxy.

Si consiglia caldamente di utilizzare ``https``, ma è un valore valido anche ``http``.

.. code-block:: yml

   - DJANGO_PROXY_PROTOCOL=https


``DJANGO_ALLOWED_HOSTS``
------------------------

Specifica i domini da cui possono provenire le richieste alla pagina di amministrazione.

Per specificare più domini, è necessario separarli con dei pipe ``|`` .

Eccetto in configurazioni speciali, deve essere uguale a ``api.DOMINIO``.

.. code-block:: yml

   - DJANGO_ALLOWED_HOSTS=api.prod.sophon.steffo.eu

.. seealso::

   `ALLOWED_HOSTS <https://docs.djangoproject.com/en/3.2/ref/settings/#allowed-hosts>`_ nella documentazione di Django


``DJANGO_ALLOWED_ORIGINS``
--------------------------

Specifica i domini da cui possono provenire le richieste all'API.

Per specificare più domini, è necessario separarli con dei pipe ``|`` .

Eccetto in configurazioni speciali, deve essere uguale a ``PROTOCOLLO://DOMINIO|https://sophon.steffo.eu``.

.. code-block:: yml

   - DJANGO_ALLOWED_ORIGINS=https://prod.sophon.steffo.eu|https://sophon.steffo.eu

.. seealso::

   `Access-Control-Allow-Origin <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin>`_ su MDN


``DJANGO_STATIC_URL``
---------------------

Specifica l'URL a cui saranno accessibili i file statici di Sophon.

Eccetto in configurazioni speciali, deve essere uguale a ``PROTOCOLLO://static.DOMINIO/django-static/``.

.. code-block:: yml

   - DJANGO_ALLOWED_ORIGINS=http://static.prod.sophon.steffo.eu/django-static/

.. warning::

   Ci si assicuri di inserire la barra finale, altrimenti Sophon non funzionerà correttamente!

.. seealso::

   `STATIC_URL <https://docs.djangoproject.com/en/3.2/ref/settings/#std:setting-STATIC_URL>`_ nella documentazione di Django


``DJANGO_LANGUAGE_CODE``
------------------------

Specifica la lingua che deve usare Sophon nei messaggi di errore.

Usa il formato `language code`_ di Django.

.. code-block:: yml

   - DJANGO_LANGUAGE_CODE=en-us

.. tip::

   Generalmente è una buona idea impostarlo a ``en-us`` per facilitare la risoluzione di eventuali problemi.

.. seealso::

   `LANGUAGE_CODE <https://docs.djangoproject.com/en/3.2/ref/settings/#language-code>`_ nella documentazione di Django

.. _language code: https://docs.djangoproject.com/en/3.2/topics/i18n/#term-language-code


``DJANGO_TIME_ZONE``
--------------------

Specifica il fuso orario che deve usare Sophon nell'interfaccia di amministrazione.

Usa il formato `tzdata`_.

.. code-block:: yml

   - DJANGO_TIME_ZONE=Europe/Rome

.. hint::

   Il fuso orario italiano è ``Europe/Rome``.

.. _tzdata: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones


``DJANGO_SU_USERNAME``
----------------------

Specifica il nome del :ref:`superutente` che verrà automaticamente creato qualora il database non contenga altri utenti.

.. code-block:: yml

   - DJANGO_SU_USERNAME=root


``DJANGO_SU_EMAIL``
-------------------

Specifica l'email del :ref:`superutente` che verrà automaticamente creato qualora il database non contenga altri utenti.

.. code-block:: yml

   - DJANGO_SU_USERNAME=bot@steffo.eu

.. note::

   Attualmente, l'email non è utilizzata, ma è richiesta da Django per la creazione di un nuovo utente.


``DJANGO_SU_PASSWORD``
----------------------

Specifica la password del :ref:`superutente` che verrà automaticamente creato qualora il database non contenga altri utenti.

.. code-block:: yml

   - DJANGO_SU_PASSWORD=square

.. warning::

   La password è un dato estremamente riservato, in quanto chiunque ne venga a conoscenza potrà accedere a Sophon con pieni privilegi!


``APACHE_PROXY_BASE_DOMAIN``
----------------------------

Specifica il dominio che dovrà essere usato come radice per il proxy, ovvero il ``DOMINIO`` per il quale si è configurato il DNS in precedenza.

.. code-block:: yml

   - APACHE_PROXY_BASE_DOMAIN=dev.sophon.steffo.eu

.. seealso::

   L'opzione :ref:`\`\`DJANGO_PROXY_BASE_DOMAIN\`\`` più indietro in questa guida, che deve coincidere con questo valore.