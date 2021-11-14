Continuous Deployment
---------------------

L'immagine del modulo viene automaticamente ricompilata da GitHub Actions e pubblicata su GitHub Containers ogni volta che un file all'interno della cartella del modulo viene modificato.

Questo workflow è definito all'interno del file ``.github/workflows/build-docker-backend.yml``.

.. image:: cd_example.png

.. seealso::

   `La pagina del container <https://github.com/Steffo99/sophon/pkgs/container/sophon-backend>`_ su GitHub Containers.
