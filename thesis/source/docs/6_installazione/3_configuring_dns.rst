:github_url: https://github.com/Steffo99/sophon/blob/main/thesis/source/6_installazione/3_configuring_dns.rst

Configurazione DNS
==================

Si scelga il dominio (o sottodominio) sul quale si vuole che Sophon sia accessibile e si aggiungano i seguenti record DNS, sostituendo il dominio ``ilmiosophon.it`` con il proprio nome di dominio, e gli indirizzi IPv4 e IPv6 del server al posto di `0.0.0.0` e `1234::1234`:

.. code-block:: dns

   *.ilmiosophon.it 1800 IN A    0.0.0.0
   *.ilmiosophon.it 1800 IN AAAA 1234::1234
   ilmiosophon.it   1800 IN A    0.0.0.0
   ilmiosophon.it   1800 IN AAAA 1234::1234

Sophon sarà quindi accessibile ai seguenti indirizzi:

- l'interfaccia web al dominio base (``https://ilmiosophon.it/``);
- l'API al dominio base prefisso con ``api.`` (``https://api.ilmiosophon.it/``);
- i notebook al dominio base prefissi con lo slug del notebook (``https://ilmionotebook.ilmiosophon.it/``).
