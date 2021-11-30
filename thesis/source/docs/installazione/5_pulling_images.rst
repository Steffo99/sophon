:github_url: https://github.com/Steffo99/sophon/blob/main/thesis/source/6_installazione/5_pulling_images.rst

Download delle immagini Docker
==============================

Si utilizzi `Docker Compose`_ per scaricare le `immagini`_ Docker necessarie all'avvio di Sophon:

.. code-block:: console

   root:/dock/sophon# docker compose pull
   [+] Running 4/4
    ⠿ proxy Pulled                                                                                 1.5s
    ⠿ frontend Pulled                                                                              1.4s
    ⠿ db Pulled                                                                                    1.9s
    ⠿ backend Pulled                                                                               1.6s

Inoltre, si scarichi manualmente l':ref:`immagine del Notebook` che può essere avviata da Sophon:

.. code-block:: console

   root:/dock/sophon# docker image pull "ghcr.io/steffo99/sophon-jupyter:latest"
   latest: Pulling from steffo99/sophon-jupyter
   7b1a6ab2e44d: Already exists
   578d7ac380c6: Pull complete
   37f1e0b584f6: Pull complete
   3c7282703390: Pull complete
   b38aa558f711: Pull complete
   1412103d568f: Pull complete
   67419a9a821e: Pull complete
   37e6cc015184: Pull complete
   7d9316e2b57c: Pull complete
   a7f024508c72: Pull complete
   f3eae3c301a1: Pull complete
   d3e2107efade: Pull complete
   d94bc6f8f069: Pull complete
   1e1dc3e818ad: Pull complete
   c975ee664182: Pull complete
   101cfcc0e15b: Pull complete
   bf991a0d7538: Pull complete
   4c044af18c7e: Pull complete
   605d8c6e8eba: Pull complete
   ed06f2ae4a88: Pull complete
   ed8b1c841d10: Pull complete
   468fe9a390ae: Pull complete
   Digest: sha256:5d42e5e40e406130c688914d6a58aa94769eab03620b53e0fd409a7fb2682a01
   Status: Downloaded newer image for ghcr.io/steffo99/sophon-jupyter:latest
   ghcr.io/steffo99/sophon-jupyter:latest

.. _Docker Compose: https://docs.docker.com/compose/
.. _immagini: https://docs.docker.com/engine/reference/commandline/images/
