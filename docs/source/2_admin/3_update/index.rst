Aggiornamento
*************

Per aggiornare Sophon, è sufficiente usare `Docker Compose`_ per scaricare le immagini aggiornate e riavviare i container del software.

.. code-block:: console

   root:/dock/sophon# docker compose down
   root:/dock/sophon# docker compose pull
   root:/dock/sophon# docker compose up -d

.. warning::

   In seguito ad un aggiornamento o un riavvio, alcuni Notebook potrebbero essere **irraggiungibili dal proxy**.

   In tal caso, sarà sufficiente **fermarli** e **riavviarli** dall'interfaccia web.

   Non si verificherà alcuna perdita di dati!


.. _Docker Compose: https://docs.docker.com/compose/
