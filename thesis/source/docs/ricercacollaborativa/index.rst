:github_url: https://github.com/Steffo99/sophon/blob/main/thesis/source/3_presentazione/index.rst

.. index::
   single: ricerca collaborativa

*********************
Ricerca collaborativa
*********************

Nelle scienze, sia teoriche, sia sperimentali, si verifica spesso la necessità di dover prendere appunti e condividere appunti sulla ricerca effettuata.

Mentre in passato a tale scopo venivano utilizzati quaderni di carta (detti anche *"blocchi note laboratoriali"* [enwiki:993314047]_), con la nascita dell'informatica si iniziarono ad utilizzare strumenti digitali, più comodi ed efficienti: inizialmente, semplici sistemi di composizione tipografica come *TeX*, poi editor :abbr:`WYSIWYG (What You See Is What You Get)` come *Microsoft Word*, arrivando infine negli ultimi anni ai più avanzati e interattivi `notebook computazionali <Notebook computazionali>`.


.. index::
   pair: sistemi; composizione tipografica

Sistemi di composizione tipografica
===================================

I primi sistemi utilizzati in ambito accademico per la creazione di documenti erano molto semplici: si limitavano a descrivere come dovevano apparire i contenuti sul foglio stampato attraverso istruzioni molto simili a quelle di un linguaggio di programmazione.

Sono esempi di sistemi di composizione tipografica `TeX <https://www.tug.org/begin.html>`_, usato ancora oggi in combinazione con il sistema `LaTeX <https://www.latex-project.org//>`_ per comporre documenti accademici come paper e tesi (inclusa questa), e `roff <https://en.wikipedia.org/wiki/Roff_(software)>`_, su cui si basa oggi lo strumento `groff <https://it.wikipedia.org/wiki/Groff_(software)>`_ per comporre le pagine di manuale dei sistemi operativi Unix-like.

Un esempio di documento LaTeX [overleaf:learn30mins]_ è il seguente:

.. code-block:: latex

   \documentclass{article}

   \begin{document}
      First document.
      This is a simple example, with no extra parameters or packages included.
   \end{document}


.. index::
   pair: editor; WYSIWYG

Editor WYSIWYG
==============

.. todo:: Non mi piace questa frase.

Con l'evolversi dei sistemi operativi, in particolare con la diffusione dei sistemi operativi a finestre, sono stati sviluppati software detti "editor di testo :abbr:`WYSIWYG (What You See Is What You Get)`", che permettono di scrivere documenti avendo un'anteprima istantanea del testo inserito.

Essendo molto più intuitivi da usare dei loro predecessori, ne hanno preso rapidamente il posto in tutto il mondo, di fatto limitando l'uso dei `sistemi di composizione tipografica <Sistemi di composizione tipografica>` ad ambiti in cui era necessaria una formattazione avanzata dei documenti.

Alcuni esempi moderni di editor :abbr:`WYSIWYG (What You See Is What You Get)` sono `Microsoft Word <https://www.microsoft.com/it-it/microsoft-365/word>`_ e `LibreOffice Writer <https://it.libreoffice.org/scopri/writer/>`_.

.. figure:: libreoffice.png

   Modifica di un documento su LibreOffice 7.2.2.2.


.. index::
   pair: editor; web-based

Web-based editor
================

Il paradigma web "2.0" ha portato miglioramenti significativi agli editor :abbr:`WYSIWYG (What You See Is What You Get)`, rendendoli utilizzabili online come software-as-a-service direttamente da un browser.

Ciò ha semplificato il processo di collaborazione sui documenti: non è più necessario inviare ai collaboratori tutte le revisioni dei documenti, ma è possibile semplicemente condividergli un link, al quale sarà possibile accedere al documento.

Da questa funzionalità ne è poi derivata un'altra, che ha rivoluzionato la scrittura di testi: la possibilità di collaborare online con gli altri autori, vedendo le loro modifiche in tempo reale sulla propria pagina.

Il più importante di questi editor è `Google Docs <https://docs.google.com/>`_, rilasciato nel 2009; la sua popolarità ha portato allo sviluppo di alternative come `Office 365 <https://www.office.com/>`_, una versione web di `Microsoft Word <Editor WYSIWYG>`.

.. figure:: google_docs.png

   Un esempio di collaborazione su un documento Google Docs.


.. index::
   single: notebook; computazionali
   pair: notebook; celle

Notebook computazionali
=======================

In parallelo ai `web-based editor <Web-based editor>`, ha preso piede nel mondo della ricerca scientifica una nuova tipologia di documento: il notebook computazionali.

I *notebook computazionali* sono un tipo di documento interattivo che permette contemporaneamente di analizzare dati, elaborarli e documentare elaborazioni effettuate e risultati ottenuti.

Essi sono composti da tante **celle**, ciascuna contenente codice in un determinato linguaggio di programmazione o di marcatura, il quale è eseguito, mostrandone poi i risultati all'utente, sotto forma di testo, equazioni, immagini, grafici, o anche widget interattivi come slider o aree di input testo.

Alcuni esempi di software per la scrittura di notebook computazionali sono `Jupyter <https://jupyter.org/>`_, `Wolfram Mathematica <https://www.wolfram.com/mathematica/>`_, `MATLAB Live Editor <https://it.mathworks.com/products/matlab/live-editor.html>`_...

.. figure:: wolfram_cloud.png

   Un esempio di notebook Mathematica, scritto su Wolfram Cloud.


.. index::
   single: Jupyter

Jupyter
=======

*Jupyter* è un software open-source che permette la scrittura e la visualizzazione di `notebook computazionali <Notebook computazionali>`.

Come tutti i notebook computazionali è strutturato in celle, le quali possono contenere testo, dati oppure codice di programmazione con relativo output.

Prende ispirazione dai `web-based editor <Web-based editor>`, permettendo agli utenti di modificare i notebook direttamente da un browser web, e include rudimentali funzionalità di collaborazione in tempo reale [jupyter:collaboration]_.

.. figure:: hist_example.png

   Un esempio di notebook Jupyter con una cella di testo e una cella di Python che emette un grafico.


.. index::
   pair: Jupyter; componenti

Componenti di Jupyter
---------------------

Jupyter è composto da 3 componenti: un `kernel <Kernel Jupyter>`, un `server <server Jupyter>` e un `client <client Jupyter>`.


.. index::
   pair: Jupyter; kernel
   single: IPython

Kernel Jupyter
^^^^^^^^^^^^^^

Il kernel è la parte di Jupyter che si occupa di eseguire le celle del notebook, restituendone i risultati al `server <server Jupyter>`.

Per ogni linguaggio di programmazione che si desidera utilizzare nel notebook è necessario il relativo **kernel**: il kernel predefinito di Jupyter è `IPython <https://ipython.org/>`_, che permette di utilizzare il linguaggio di programmazione `Python <https://www.python.org/>`_; sono però disponibili tanti altri kernel, tra cui uno per `Julia <https://julialang.org/>`_ e uno per `R <https://www.r-project.org/>`_ [jupyter:kernels]_.


.. index::
   pair: Jupyter; server

Server Jupyter
^^^^^^^^^^^^^^

Il **server** è la parte di Jupyter che gestisce le interazioni del `client <client Jupyter>` con il notebook, inoltrandole al `kernel <kernel Jupyter>` appropriato se necessario.

Il server ufficiale di Jupyter è `Jupyter Server <https://github.com/jupyter-server/jupyter_server>`_.


.. index::
   pair: Jupyter; client
   single: Jupyter; Jupyter Notebook
   single: Jupyter; JupyterLab

Client Jupyter
^^^^^^^^^^^^^^

Il **client** è la parte di Jupyter che mostra in un formato user-friendly il contenuto del notebook e gli permette di interagirvi, comunicando le interazioni al `server <server Jupyter>`.

Esistono due client ufficiali per Jupyter: il client di vecchia generazione `Jupyter Notebook <https://github.com/jupyter/notebook>`_ e il client di nuova generazione `JupyterLab <https://github.com/jupyterlab>`_, entrambi web-based.


.. index::
   pair: Jupyter; hosting

Hosting di Jupyter
------------------

Essendo `server <server Jupyter>` e `client <client Jupyter>` separati, è possibile eseguire il server su una macchina e il client su un'altra.

È possibile selezionare la macchina su cui eseguire il server in tre modi diversi, elencati nelle prossime sezioni, ciascuno con alcuni vantaggi e svantaggi.


Hosting locale
^^^^^^^^^^^^^^

È possibile installare il server Jupyter **sul proprio computer**.

Così facendo, le celle saranno eseguite con le risorse del proprio computer, e il notebook sarà accessibile solo dal computer che sta eseguendo il server.

È un ottimo modo per lavorare su progetti personali, in quanto offre la massima personalizzazione attraverso un sistema di plugin installabili, e per lavorare offline, in quanto è l'unico modo di usare il server senza connessione ad Internet.

In base al proprio sistema operativo, però, potrebbe risultare difficile da installare, e in base alla propria configurazione di rete, la collaborazione realtime su un progetto potrebbe essere impossibile.


.. index::
   single: Google Colaboratory
   single: SageMaker Notebook

Come software-as-a-service
^^^^^^^^^^^^^^^^^^^^^^^^^^

È possibile utilizzare un server Jupyter **gestito da un cloud provider** ed utilizzare le risorse da esso fornite per eseguire le celle.

Un esempio di cloud provider che fornisce questo servizio è Google, con `Google Colaboratory <https://colab.research.google.com/#>`_.

Usare il modello :abbr:`SaaS (Software as a Service)` è il modo più semplice per usare Jupyter, in quanto non richiede di effettuare alcuna installazione sul proprio computer, e in genere permette di collaborare online con altri utenti.

In genere, però, Jupyter sulle piattaforme :abbr:`SaaS (Software as a Service)` non permette l'installazione di plugin, limitando la personalizzazione, e, se si necessitano più risorse di quelle offerte gratuitamente dai provider, si rischia di trovarsi a pagare mensilmente cifre elevate.


.. index::
   single: Jupyter; JupyterHub

Hosting on-premises
^^^^^^^^^^^^^^^^^^^

È possibile configurare un **server della propria istituzione** in modo tale che esegua uno o più `server Jupyter <Server Jupyter>` a cui si connetteranno i `client <client Jupyter>`.

A tale scopo, è disponibile il progetto `JupyterHub <https://jupyter.org/hub>`_, in grado di gestire migliaia di utenti simultanei [jupyter:ifaq]_, ciascuno con il proprio notebook.

È performante ed efficace, e in base alla configurazione scelta dall'amministratore, può permettere agli utenti di personalizzare il loro ambiente di lavoro con plugin.

L'interfaccia di gestione utenti e notebook è però molto essenziale, essendo un progetto piuttosto nuovo, e in aggiunta non supporta nativamente la collaborazione real-time su un singolo notebook, preferendo il modello *"tanti server Jupyter da utente singolo"* [jupyter:hub]_.
