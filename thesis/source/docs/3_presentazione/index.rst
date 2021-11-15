.. index::
   single: presentazione

*************
Presentazione
*************

.. todo::

   Scrivere questa sezione.


.. index::
   single: notebook computazionali

Notebook computazionali
=======================

.. todo::

   Scrivere questa sezione.


.. index::
   single: Jupyter

Jupyter
=======

*Jupyter* è un'applicazione che permette la scrittura e la visualizzazione di `notebook computazionali <Notebook computazionali>`.

È composta da (almeno) 3 parti:

.. index::
   single: Jupyter; kernel

-  un **kernel** per ogni linguaggio di programmazione che si desidera utilizzare nel notebook;

   .. note::

      .. index::

         single: IPython

      Ad esempio, `IPython <https://ipython.org/>`_ è un kernel Jupyter per il linguaggio di programmazione `Python <https://www.python.org/>`_.

.. index::
   single: Jupyter; server

-  un **server** che gestisce le richieste dell'utente di modifica del notebook, salvandole sul file system, e di valutazione celle, inoltrando la richiesta al kernel corrispondente;

   .. note::

      Attualmente, l'unico server Jupyter esistente è `Jupyter Server <https://github.com/jupyter-server/jupyter_server>`_.

.. index::
   single: Jupyter; client

-  un **client** che mostra in un formato user-friendly il contenuto del notebook e gli permette di modificarlo con facilità, connettendosi al relativo server.

   .. note::

      .. index::

         single: Jupyter; Notebook
         single: Jupyter; Lab

      Esistono due client per Jupyter: il client di vecchia generazione `Jupyter Notebook <https://github.com/jupyter/notebook>`_ e il client di nuova generazione `JupyterLab <https://github.com/jupyterlab>`_.


.. index::
   single: Jupyter; hosting

Hosting di Jupyter
==================

È possibile effettuare l'hosting di `Jupyter` in vari modi, in base a come esso verrà utilizzato.

.. index::
   single: Jupyter; hosting locale

Hosting locale
--------------

È possibile installare il server Jupyter sul proprio computer per visualizzare e modificare notebook semplici.

Così facendo, le celle verranno eseguite con le risorse del proprio computer, e il notebook sarà accessibile solo dal computer che sta eseguendo il server.

È il modo più facile per usare Jupyter, ma rende impossibile la collaborazione e rende impossibile eseguire alcune operazioni, in quanto le risorse del proprio computer potrebbero non essere sufficienti.

.. todo::

   Rivedere vantaggi e svantaggi.


.. index::
   single: Jupyter; come software-as-a-service
   single: Google Colaboratory
   single: SageMaker Notebook

Come software-as-a-service
--------------------------

È possibile utilizzare un server Jupyter gestito da un cloud provider ed utilizzare le risorse da esso fornite per eseguire le celle.

Alcuni esempi di cloud provider che forniscono questo servizio sono Google, con `Google Colaboratory <https://colab.research.google.com/#>`_ e Amazon, con `SageMaker Notebook <https://docs.aws.amazon.com/sagemaker/latest/dg/nbi.html>`_.

Entrambe le opzioni sono un ottimo modo per utilizzare Jupyter, anche in collaborazione con più persone, ma hanno il difetto di essere costose o poco personalizzabili.

.. todo::

   Rivedere vantaggi e svantaggi.


.. index::
   single: Jupyter; hosting on-premises
   single: Jupyter; Hub

Hosting on-premises
-------------------

È possibile configurare un server della propria istituzione in modo tale che ospiti uno o più server Jupyter a cui si connetteranno i suoi utenti.

A tale scopo, è disponibile il progetto `JupyterHub <https://jupyter.org/hub>`_, in grado di gestire oltre centinaia di utenti e notebook.

È complesso da installare, ma performante ed efficace; è però molto essenziale, in quanto è un progetto parecchio recente, e carente in certe funzionalità, come collaborazione simultanea e autenticazione esterna.

.. todo::

   Rivedere vantaggi e svantaggi.