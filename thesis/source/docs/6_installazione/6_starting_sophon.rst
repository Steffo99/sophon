:github_url: https://github.com/Steffo99/sophon/blob/main/thesis/source/6_installazione/6_starting_sophon.rst

.. index::
   pair: Sophon; avvio

Avvio di Sophon
===============

Si utilizzi `Docker Compose`_ per eseguire le `immagini`_ di Sophon precedentemente scaricate:

.. code-block:: console

   root:/dock/sophon# docker compose up -d
   [+] Running 4/4
    ⠿ Container sophon-db-1        Started                                                        11.3s
    ⠿ Container sophon-frontend-1  Started                                                        11.7s
    ⠿ Container sophon-backend-1   Started                                                        10.1s
    ⠿ Container sophon-proxy-1     Started                                                        11.5s

Si verifichi che i container si siano avviati correttamente con:

.. code-block:: console

   root:/dock/sophon# docker compose logs

.. _Docker Compose: https://docs.docker.com/compose/
.. _immagini: https://docs.docker.com/engine/reference/commandline/images/
