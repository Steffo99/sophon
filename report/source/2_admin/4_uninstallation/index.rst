Disinstallazione
****************

Per rimuovere completamente Sophon, è necessario innanzitutto arrestare i container del software principale:

.. code-block:: console

   root:/dock/sophon# docker compose down

In seguito, è necessario arrestare tutti i container dei notebook ancora avviati:

.. code-block:: console

   root:/dock/sophon# docker container ls
   c160ea085fe1   steffo45/jupyterlab-docker-sophon         "tini -g -- start-no…"   23 hours ago   Up 23 hours              sophon-container-my-first-notebook
   0892874ea0d5   ghcr.io/steffo99/sophon-jupyter           "tini -g -- start-no…"   3 minutes ago   Up 3 minutes (healthy)  sophon-container-normal-slug
   root:/dock/sophon# docker container rm --force c160ea085fe1 0892874ea0d5

Infine sarà possibile liberare lo spazio occupato dalle risorse Docker di Sophon:

.. code-block:: console

   root:/dock/sophon# docker compose down -v
   root:/dock/sophon# docker volume prune
   root:/dock/sophon# docker container prune
   root:/dock/sophon# docker network prune
   root:/dock/sophon# docker image prune
