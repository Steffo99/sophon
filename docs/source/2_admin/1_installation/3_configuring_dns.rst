Configurazione DNS
==================

Si scelga il dominio (o sottodominio) sul quale si vuole che Sophon sia accessibile e si aggiungano i seguenti record DNS, sostituendo il dominio scelto a ``DOMINIO`` e gli indirizzi IPv4 e IPv6 del server al posto di `0.0.0.0` e `1234::1234`:

.. code-block:: dns

   *.DOMINIO 1800 IN A    0.0.0.0
   *.DOMINIO 1800 IN AAAA 1234::1234
   DOMINIO   1800 IN A    0.0.0.0
   DOMINIO   1800 IN AAAA 1234::1234

Sophon sarà accessibile ai seguenti indirizzi:

- l'interfaccia web a ``https://DOMINIO/``;
- l'API a ``https://api.DOMINIO/``;
- i notebook a ``https://SLUG.DOMINIO/``.
