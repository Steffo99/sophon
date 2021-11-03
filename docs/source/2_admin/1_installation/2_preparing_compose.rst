Preparazione di Docker Compose
==============================

Come ``root``, si crei una nuova cartella sul proprio sistema operativo in cui archiviare le risorse relative a Sophon:

.. code-block:: console

   root:~# mkdir -p /dock/sophon

Successivamente, si scarichi il file ``docker-compose.yml`` all'interno della cartella dal repository di Sophon:

.. code-block:: console

   root:~# cd /dock/sophon

   root:/dock/sophon# wget "https://raw.githubusercontent.com/Steffo99/sophon/main/docker-compose.yml"
   --2021-11-02 18:03:05--  https://raw.githubusercontent.com/Steffo99/sophon/main/docker-compose.yml
   SSL_INIT
   Loaded CA certificate '/etc/ssl/certs/ca-certificates.crt'
   Resolving raw.githubusercontent.com (raw.githubusercontent.com)... 185.199.108.133,
   185.199.109.133, 185.199.110.133, ...
   Connecting to raw.githubusercontent.com (raw.githubusercontent.com) 185.199.108.133:443...
   connected.
   HTTP request sent, awaiting response... 200 OK
   Length: 2957 (2.9K) [text/plain]
   Saving to: ‘docker-compose.yml’

   docker-compose.yml  100%[===================>]   2.89K  --.-KB/s    in 0s

   2021-11-02 18:03:05 (48.0 MB/s) - ‘docker-compose.yml’ saved [2957/2957]
