.. index::
   single: ricerca collaborativa

*********************
Ricerca collaborativa
*********************

Nelle scienze, sia teoriche, sia sperimentali, si verifica spesso la necessità di dover prendere appunti e condividere appunti sulla ricerca effettuata.

Mentre in passato a tale scopo venivano utilizzati quaderni di carta (detti anche *"blocchi note laboratoriali"* :cite:`enwiki:993314047`), con la nascita dell'informatica si iniziarono ad utilizzare strumenti digitali, più comodi ed efficienti: inizialmente, semplici word processor come *Microsoft Word*, arrivando poi negli ultimi anni ai più avanzati e interattivi `notebook computazionali <Notebook computazionali>`.


.. index::
   single: notebook computazionale
   single: celle

Notebook computazionali
=======================

I *notebook computazionali* sono documenti interattivi frequentemente utilizzati nel mondo della ricerca, in quanto permettono di documentare l'analisi di dati con feedback grafico immediato.

Tipicamente, sono composti da tante **celle** contenenti codice in un qualche linguaggio di programmazione, le quali sono eseguite e il cui output è  mostrato all'utente sotto forma di testo, equazioni, immagini, grafici, o anche widget interattivi come slider o aree di input testo.

Alcuni esempi di software per la scrittura di notebook computazionali sono `Jupyter`, `Wolfram Mathematica <https://www.wolfram.com/mathematica/>`_, `MATLAB Live Editor <https://it.mathworks.com/products/matlab/live-editor.html>`_...

.. figure:: hist_example.png

   Un esempio di notebook `Jupyter` con una cella di testo e una cella di Python che emette un grafico. :cite:`matplotlib:histograms`


.. index::
   single: Jupyter

Jupyter
=======

*Jupyter* è un'applicazione che permette la scrittura e la visualizzazione di `notebook computazionali <Notebook computazionali>`.

È composta da 3 (o più) parti:

.. index::
   single: Jupyter; kernel
   single: IPython

-  | Un **kernel** per il linguaggio di programmazione che si desidera utilizzare nel notebook (o, se si desidera più linguaggi, un kernel per ciascun linguaggio).
   | Il kernel si occupa di eseguire su richiesta le celle del notebook, e di rispondere alla richiesta con i risultati dell'esecuzione.
   | Il kernel predefinito di Jupyter è `IPython <https://ipython.org/>`_, che permette di utilizzare il linguaggio di programmazione `Python <https://www.python.org/>`_.

.. index::
   single: Jupyter; server

-  | Un **server** che gestisce le richieste dell'utente di interazione con il notebook, inoltrandole a un kernel se necessario.
   | Il server ufficiale di Jupyter è `Jupyter Server <https://github.com/jupyter-server/jupyter_server>`_.

.. index::
   single: Jupyter; client
   single: Jupyter; Notebook
   single: Jupyter; Lab

-  | un **client** che mostra in un formato user-friendly il contenuto del notebook e gli permette di modificarlo con facilità, connettendosi al relativo server.
   | Esistono due client ufficiali per Jupyter: il client di vecchia generazione `Jupyter Notebook <https://github.com/jupyter/notebook>`_ e il client di nuova generazione `JupyterLab <https://github.com/jupyterlab>`_.


.. index::
   single: Jupyter; hosting

Hosting di Jupyter
==================

È possibile utilizzare `Jupyter` in diversi modi, ciascuno con alcuni vantaggi e svantaggi.


.. index::
   single: Jupyter; hosting locale

Hosting locale
--------------

È possibile installare il server Jupyter sul proprio computer per visualizzare e modificare notebook semplici.

Così facendo, le celle verranno eseguite con le risorse del proprio computer, e il notebook sarà accessibile solo dal computer che sta eseguendo il server.

È un ottimo modo per lavorare su progetti personali, in quanto offre la massima personalizzazione dell'ambiente, e per lavorare offline, in quanto è in grado di funzionare senza alcuna connessione ad Internet.

In base al proprio sistema operativo, però, potrebbe risultare difficile da installare, e in base alla propria configurazione di rete, collaborare su un progetto potrebbe essere impossibile (senza appoggiarsi a strumenti esterni di scambio file, come email, o sistemi di controllo versione).


.. index::
   single: Jupyter; come software-as-a-service
   single: Google Colaboratory
   single: SageMaker Notebook

Come software-as-a-service
--------------------------

È possibile utilizzare un server Jupyter gestito da un cloud provider ed utilizzare le risorse da esso fornite per eseguire le celle.

Alcuni esempi di cloud provider che forniscono questo servizio sono Google, con `Google Colaboratory <https://colab.research.google.com/#>`_ e Amazon, con `SageMaker Notebook <https://docs.aws.amazon.com/sagemaker/latest/dg/nbi.html>`_.

Generalmente, il modello software-as-a-service è il modo più semplice per usare Jupyter, in quanto non richiede di effettuare alcuna installazione sul proprio computer, e in genere permette la collaborazione online con altri utenti.

Purtroppo, però, offre poche opzioni per personalizzare l'ambiente, e, se si necessitano più risorse di quelle offerte gratuitamente dai provider, il costo cresce molto rapidamente.


.. index::
   single: Jupyter; hosting on-premises
   single: Jupyter; Hub

Hosting on-premises
-------------------

È possibile configurare un server della propria istituzione in modo tale che esegua uno o più server Jupyter a cui si connetteranno gli utenti.

A tale scopo, è disponibile il progetto `JupyterHub <https://jupyter.org/hub>`_, in grado di gestire migliaia di utenti simultanei :cite:`jupyter:ifaq`, ciascuno con il proprio notebook.

È performante ed efficace, e lascia completa libertà agli utenti di personalizzare il loro ambiente di lavoro.

L'interfaccia di gestione utenti e notebook è però ancora molto essenziale, essendo un progetto piuttosto nuovo, e non supporta nativamente la collaborazione multiutente su un singolo notebook, preferendo il modello *"tanti server Jupyter da utente singolo"* :cite:`jupyter:hub`.
