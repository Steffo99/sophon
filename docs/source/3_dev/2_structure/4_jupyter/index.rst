Modulo Jupyter
==============

Il *modulo Jupyter* consiste in un ambiente `Jupyter <https://jupyter.org/>`_ e `JupyterLab <https://jupyterlab.readthedocs.io/en/stable/>`_ modificato per una migliore integrazione con Sophon, in particolare con il :ref:`modulo frontend` e il :ref:`modulo backend`.

È collocato all'interno del repository in ``/jupyter``.

Progetti utilizzati
-------------------

- Le immagini Docker ufficiali di Jupyter `jupyter/docker-stacks <https://github.com/jupyter/docker-stacks>`_
- Il tema `JupyterLab Sophon <https://github.com/Steffo99/jupyterlab-theme-sophon>`_ (realizzato durante il tirocinio)
- Il tool per il trasferimento dati `curl <https://curl.se/>`_


Funzionamento del modulo
------------------------

Il modulo è composto da un singolo ``Dockerfile`` che crea un immagine Docker in quattro fasi:

#. **Base**: Parte dall'immagine base ``jupyter/scipy-notebook`` ed altera i label dell'immagine;

   .. code-block:: docker

      FROM jupyter/scipy-notebook AS base
      # Set the maintainer label
      LABEL maintainer="Stefano Pigozzi <me@steffo.eu>"

#. **Env**: Configura le variabili di ambiente dell'immagine, dando il nome "sophon" all'utente non-privilegiato, attivando JupyterLab, configurando il riavvio automatico di Jupyter e permettendo all'utente non-privilegiato di acquisire i privilegi di root attraverso il comando ``sudo``;

   .. code-block:: docker

      FROM base AS env
      # Override the default "jovyan" user
      ARG NB_USER="sophon"
      # Set useful envvars for Sophon notebooks
      ENV JUPYTER_ENABLE_LAB=yes
      ENV RESTARTABLE=yes
      ENV GRANT_SUDO=yes

#. **Extensions**: Installa, abilita e configura le estensioni necessarie all'integrazione con Sophon (attualmente, soltanto il tema JupyterLab Sophon);

   .. code-block:: docker

      FROM env AS extensions
      # As the default user...
      USER ${NB_UID}
      WORKDIR "${HOME}"
      # Install the JupyterLab Sophon theme
      RUN jupyter labextension install "jupyterlab_theme_sophon"
      # Enable the JupyterLab Sophon theme
      RUN jupyter labextension enable "jupyterlab_theme_sophon"
      # Set the JupyterLab Sophon theme as default
      RUN mkdir -p '.jupyter/lab/user-settings/@jupyterlab/apputils-extension/'
      RUN echo '{"theme": "JupyterLab Sophon"}' > ".jupyter/lab/user-settings/@jupyterlab/apputils-extension/themes.jupyterlab-settings"

#. **Healthcheck**: Installa ``curl``, e aggiunge all'immagine un controllo per verificarne lo stato di avvio, permettendo al :ref:`modulo backend` di comunicare una richiesta di avvio riuscita solo quando l'intera immagine è avviata

   .. code-block:: docker

      FROM extensions AS healthcheck
      # As root...
      USER root
      # Install curl
      RUN apt-get update
      RUN apt-get install -y curl
      # Use curl to check the health status
      HEALTHCHECK --start-period=5s --timeout=5s --interval=10s CMD ["curl", "--output", "/dev/null", "http://localhost:8888"]

      # We probably should go back to the default user
      USER ${NB_UID}

.. note::

   I blocchi di codice all'interno di questa sezione sono stati inseriti manualmente e potrebbero non essere interamente aggiornati alla versione più recente del file.

   Si consiglia di consultare il ``Dockerfile`` in caso si necessiti di informazioni aggiornate.


Continuous Deployment
---------------------

L'immagine del modulo viene automaticamente ricompilata da GitHub Actions e pubblicata su GitHub Containers ogni volta che un file all'interno della cartella del modulo viene modificato.

Questo workflow è definito all'interno del file ``.github/workflows/build-docker-jupyter.yml``.

.. seealso::

   `La pagina del container <https://github.com/Steffo99/sophon/pkgs/container/sophon-jupyter>`_ su GitHub Containers.
