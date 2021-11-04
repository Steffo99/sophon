Modulo proxy
============

Il *modulo proxy* consiste in un webserver che riceve tutte le richieste HTTP dirette ad uno degli altri moduli e le smista in base a regole statiche e dinamiche.


Tecnologie utilizzate
---------------------

- Il server web `Apache HTTPd <https://httpd.apache.org/>`_
   - Il modulo `mod_rewrite <https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html>`_
   - Il modulo `mod_proxy <https://httpd.apache.org/docs/2.4/mod/mod_proxy.html>`_
   - Il modulo `mod_proxy_http <https://httpd.apache.org/docs/2.4/mod/mod_proxy_http.html>`_
   - Il modulo `mod_proxy_wstunnel <https://httpd.apache.org/docs/2.4/mod/mod_proxy_wstunnel.html>`_


Funzionamento del modulo
------------------------

