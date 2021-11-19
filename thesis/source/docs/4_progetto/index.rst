.. index::
   single: progettazione

*************
Progettazione
*************

Vista la situazione della `ricerca collaborativa <Ricerca collaborativa>`, si è ritenuto potesse essere utile sviluppare un'alternativa al `progetto JupyterHub <Hosting on-premises>`.


.. index::
   single: requisiti

Requisiti
=========

Si è stabilito che per essere un'alternativa valida, il progetto dovesse avere i seguenti requisiti:

*  `estendibilità <Estendibilità>`
*  `security by default <Sicurezza>`
*  `interfaccia grafica facile ed intuibile <Intuibilità>`
*  `maggiore possibilità di collaborazione <Possibilità di collaborazione>`
*  `codice open source <Open source>`
*  `possibilità di personalizzazione <Personalizzabilità>`
*  `accessibilità <Accessibilità>`

Seguono descrizioni dettagliate dei requisiti elencati.


.. index::
   single: requisiti; estendibilità
   single: estendibilità

Estendibilità
-------------

**Aggiungere nuove funzionalità** al software deve essere facile, e non richiedere ristrutturazioni profonde del codice.

Inoltre, il software deve essere **modulare**, in modo da semplificare l'aggiornamento, la sostituzione e la eventuale rimozione di componenti.

Infine, il software deve esporre un'**interfaccia alla quale altri software esterni possono connettersi** per interagirvi come se fossero un utente.


.. index::
   single: requisiti; sicurezza
   single: sicurezza

Sicurezza
---------

I dati immagazzinati all'interno del software devono essere **protetti da acccessi non autorizzati**.

**Tentativi di ingannare gli utenti del software devono essere impediti**, riducendo il fattore umano nelle falle di sicurezza.

Non si reputa importante impedire agli utenti di comunicare con Internet all'interno delle loro ricerche, in quanto si ritiene che essi siano utenti fidati; qualora ne sorga la necessità, ciò deve essere possibile senza ristrutturazione del codice.

Non si reputa nemmeno importante limitare le risorse utilizzate dai `notebook <notebook computazionali>` in uso; deve però essere possibile implementare la funzionalità in futuro, se divenisse necessario.


.. index::
   single: requisiti; intuibilità
   single: intuibilità

Intuibilità
-----------

Il modo in cui utilizzare l'interfaccia utente del software deve essere **facilmente intuibile** dall'utente medio, senza che abbia bisogno di leggere alcuna guida o manuale.

A tale scopo, l'interfaccia grafica deve utilizzare **design patterns comuni e familiari** all'utente medio.

In aggiunta, i **dettagli implementativi devono essere nascosti** all'utente, in modo che possa concentrarsi sull'utilizzo del software.


.. index::
   single: requisiti; personalizzabilità
   single: personalizzabilità

Personalizzabilità
------------------

Il software deve permettere all'utente di **personalizzare il suo workflow senza alcuna limitazione**, che ciò venga fatto tramite plugin, configurazioni speciali o modifica di file dell'ambiente di lavoro, assicurando che i workflow personalizzati di un utente **non possano interferire** con quelli degli altri.

Inoltre, il software deve inoltre permettere all'amministratore di **personalizzare nome e aspetto** mostrati agli utenti nell'interfaccia grafica, in modo che essa possa essere adattata al brand dell'istituzione che utilizza il progetto.


.. index::
   single: requisiti; possibilità di collaborazione
   single: possibilità di collaborazione

Possibilità di collaborazione
-----------------------------

Il software deve permettere agli utenti di **collaborare sui notebook in tempo reale**, come all'interno dei `web-based editor <Web-based editor>`.

Devono essere **facilitate le interazioni tra utenti**, al fine di ridurre errori e incomprensioni tra essi.


.. index::
   single: requisiti; open source
   single: open source

Open source
-----------

Il software deve essere interamente **open source**.

In pieno spirito collaborativo, il **codice sorgente deve essere liberamente consultabile, modificabile, utilizzabile e condivisibile**, sia per soddisfare la curiosità degli utenti, sia per permetterne lo studio e il miglioramento.

Tutte le **modifiche al codice sorgente devono essere rese disponibili agli utenti** del software modificato, in modo che possano verificare l'affidabilità del software che utilizzano.


.. index::
   single: requisiti; responsività
   single: responsività

Responsività
------------

Il software deve essere **utilizzabile su schermi di dimensione ridotta**, come quelli di un cellulare.

Pertanto, gli elementi dell'interfaccia devono essere disposti in modo che non escano dallo schermo qualora non ci fosse spazio sufficiente per mostrarli.


.. index::
   single: requisiti; accessibilità
   single: accessibilità

Accessibilità
-------------

Il software deve essere utilizzabile da **qualsiasi tipologia di utente**, inclusi utenti con disabilità visive e motorie.

Deve essere quindi possibile utilizzare il software **interamente da tastiera**, senza dover ricorrere a un mouse.

Inoltre, i colori scelti per l'interfaccia grafica **devono essere chiari anche a persone affette da daltonismo**.


.. index::
   single: separazione in moduli
   single: modulo

Separazione in moduli
=====================

.. todo:: Separazione in moduli


.. index::
   single: modulo; backend

Modulo backend
--------------

.. todo:: Modulo backend


.. index::
   single: Django

Django
^^^^^^

.. todo:: Django


.. index::
   single: Django; REST Framework

Django REST Framework
^^^^^^^^^^^^^^^^^^^^^

.. todo:: Django REST Framework


.. index::
   single: modulo; frontend

Modulo frontend
---------------

.. todo:: Modulo frontend


.. index::
   single: React

React
^^^^^

.. todo:: React


.. index::
   single: Bluelib

Bluelib
^^^^^^^

.. todo:: Bluelib


.. index::
   single: modulo; proxy

Modulo proxy
------------

.. todo:: Modulo proxy


.. index::
   single: Apache HTTP server
   single: httpd
   single: apache2

Apache HTTP server
^^^^^^^^^^^^^^^^^^

.. todo:: Apache HTTP server


.. index::
   single: modulo; Jupyter
   single: Jupyter; modulo di Sophon

Modulo Jupyter
--------------

.. todo:: Modulo backend


.. index::
   single: containerizzazione

Containerizzazione
==================

.. todo:: Containerizzazione


.. index::
   single: Docker

Docker
------

.. todo:: Containerizzazione


.. index::
   single: container
   single: Docker; container

Container
^^^^^^^^^

.. todo:: Container


.. index::
   single: network
   single: Docker; network

Network
^^^^^^^

.. todo:: Network


.. index::
   single: volume
   single: Docker; volume

Volumi
^^^^^^

.. todo:: Volumi


.. index::
   single: Docker; compose

Docker Compose
--------------

.. todo:: Containerizzazione


.. index::
   single: database

Database
========

.. todo:: Database


.. index::
   single: PostgreSQL

PostgreSQL
----------

.. todo:: PostgreSQL


.. index::
   single: entità

Entità
------

.. todo:: Entità


.. index::
   single: entità; istanza
   single: istanza

Istanze
^^^^^^^

.. todo:: Istanze


.. index::
   single: entità; gruppi di ricerca
   single: gruppi di ricerca

Gruppi di ricerca
^^^^^^^^^^^^^^^^^

.. todo:: Gruppi di ricerca


.. index::
   single: entità; progetti di ricerca
   single: progetti di ricerca

Progetti di ricerca
^^^^^^^^^^^^^^^^^^^

.. todo:: Progetti di ricerca


.. index::
   single: entità; notebook
   single: notebook; entità di Sophon

Notebook
^^^^^^^^

.. todo:: Notebook


.. index::
   single: entità; utente
   single: utente

Utenti
^^^^^^

.. todo:: Utenti

