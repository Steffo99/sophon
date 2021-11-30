:github_url: https://github.com/Steffo99/sophon/blob/main/thesis/source/6_installazione/7_host_reverse_proxy.rst

Configurazione del webserver dell'host
======================================

Si configuri il webserver dell'host per inoltrare tutto il traffico dalla porta 443 (o 80, se si è selezionato ``http`` in :envvar:`DJANGO_PROXY_PROTOCOL`) alla porta locale 30033.

Sono allegate le istruzioni per il webserver `Apache HTTPd`_; possono essere però adattate se si vuole usare un webserver diverso, come `NGINX`_ o `caddy`_.

.. _Apache HTTPd: https://httpd.apache.org/
.. _nginx: https://www.nginx.com/
.. _caddy: https://caddyserver.com/


Con Apache HTTPd
----------------

Ci si assicuri che `mod_rewrite`_, `mod_proxy`_, `mod_proxy_http`_ e `mod_proxy_wstunnel`_ siano attivati.

Si aggiungano i seguenti ``VirtualHost`` alla configurazione:

.. code-block:: apacheconf

   <VirtualHost *:80>
       ServerName "ilmiosophon.it"
       ServerAlias "*.ilmiosophon.it"

       RewriteEngine On
       RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
   </VirtualHost>

.. code-block:: apacheconf

   <VirtualHost *:443>
       ServerName "ilmiosophon.it"
       ServerAlias "*.ilmiosophon.it"

       SSLEngine on
       SSLCertificateFile      "/SOSTITUISCIMI/CON/IL/PERCORSO/ALLA/FULL/CHAIN/SSL"
       SSLCertificateKeyFile   "/SOSTITUISCIMI/CON/IL/PERCORSO/ALLA/CHIAVE/PRIVATA/SSL"

       ProxyPreserveHost On
       RequestHeader set "X-Forwarded-Proto" expr=%{REQUEST_SCHEME}

       RewriteEngine On
       RewriteCond %{HTTP:Upgrade} =websocket [NC]
       RewriteRule /(.*)           ws://127.0.0.1:30033/$1 [P,L]
       RewriteRule /(.*)           http://127.0.0.1:30033/$1 [P,L]

       Protocols h2 http/1.1
       Header always set Strict-Transport-Security "max-age=63072000"
   </VirtualHost>

Infine, si riavvii `Apache HTTPd`_:

.. code-block:: console

   root:/dock/sophon# systemctl restart httpd


.. _mod_rewrite: https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html
.. _mod_proxy: https://httpd.apache.org/docs/2.4/mod/mod_proxy.html
.. _mod_proxy_http: https://httpd.apache.org/docs/2.4/mod/mod_proxy_http.html
.. _mod_proxy_wstunnel: https://httpd.apache.org/docs/2.4/mod/mod_proxy_wstunnel.html
