Il progetto sophon
------------------
.. default-domain:: py
.. default-role:: obj
.. module:: sophon

Il progetto Django Sophon aggiunge varie funzionalità al template base dei progetti Django.


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

      `.SophonAdminSite` è selezionata come classe predefinita per il sito di amministrazione.


Impostazioni dinamiche
^^^^^^^^^^^^^^^^^^^^^^
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
^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.auth1

La classe `rest_framework.authentication.TokenAuthentication` viene modificata per ottenere un comportamento conforme agli standard del web.

.. class:: BearerTokenAuthentication(rest_framework.authentication.TokenAuthentication)

   .. attribute:: keyword = "Bearer"

      Si configura `rest_framework` per accettare header di autenticazione nella forma ``Bearer <token>``, invece che ``Token <token>``.

.. module:: sophon.auth2

La view `rest_framework.authtoken.views.ObtainAuthToken` viene estesa per aggiungere dati alla risposta di autenticazione riuscita.

.. class:: CustomObtainAuthToken(rest_framework.authtoken.views.ObtainAuthToken)

   .. method:: post(self, request, *args, **kwargs)

      In particolare, viene aggiunta una chiave ``user``, che contiene i dettagli sull'utente che ha effettuato il login.
