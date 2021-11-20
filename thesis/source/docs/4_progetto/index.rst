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

Per realizzare il requisito dell'`estendibilità <Estendibilità>`, si è scelto di separare le parti dell'applicazioni in 4 diversi moduli interagenti.

.. figure:: moduli.png

   Schema che mostra come interagiscono tra loro i moduli di Sophon.


.. index::
   single: modulo; backend

Modulo backend
--------------

Il modulo backend consisterà in una web :abbr:`API (application programming interface)` che si interfaccia con il database e i moduli Jupyter, permettendo un accesso controllato alle risorse del software.

Sarà scritto in `Python`, usando `Poetry` e le librerie `Django`, `Django REST Framework` e `Docker SDK for Python`, descritte nei prossimi paragrafi.

Esso sarà **eseguito dal server** sul quale si desidera ospitare Sophon.


.. index::
   single: Python
   single: Python; packages

Python
^^^^^^

`Python <https://www.python.org/>`_ è un linguaggio di programmazione interpretato con tipizzazione forte, particolarmente popolare negli ambiti dello sviluppo web e data science.

Ha numerosissime librerie (dette *packages*) sia incluse nell'eseguibile stesso del linguaggio, sia disponibili per il download sul `Python Package Index <https://pypi.org/>`_.

La sua sintassi è semplice ed human-friendly, come è possibile vedere dal seguente frammento di codice:

.. code-block:: python

   class Animale:
      def verso():
         raise NotImplementedError()

   class Cane(Animale):
      def verso():
         print("Woof!")

   class Gatto(Animale):
      def verso():
         print("Miao!")

   zoo = [
      Cane(),
      Gatto(),
      Cane(),
   ]

   for animale in zoo:
      animale.verso()

La sua semplicità e l'enorme quantità di librerie a disposizione lo ha reso il secondo linguaggio di programmazione più popolare al mondo :cite:`so:survey2021`, subito dopo `JavaScript`; proprio per questi motivi è stato scelto per lo sviluppo del modulo backend.


.. index::
   single: Poetry

Poetry
^^^^^^

Per gestire le dipendenze di Sophon si è scelto di usare `Poetry <https://python-poetry.org/>`_, un innovativo package manager per il linguaggio Python.

Poetry è in grado di risolvere automaticamente alberi complessi di dipendenze, generando un *lockfile* (``poetry.lock``) con la soluzione adottata, in modo che le dipendenze utilizzate siano congelate e uguali per tutti gli ambienti in cui deve essere sviluppato Sophon.


.. index::
   single: Django
   single: Django; applicazione
   single: Django; view
   single: Django; function-based view
   single: Django; class-based view

Django
^^^^^^

`Django <https://www.djangoproject.com/>`_ è un framework Python per lo sviluppo di siti web dinamici.

Fornisce una suite di strumenti che assistono nella creazione di siti di medie dimensioni, come un :abbr:`ORM (object-relational model)` per i database, una pagina di amministrazione integrata per la gestione dei contenuti del sito e un sistema di moduli scollegabili detti "applicazioni".

Le pagine restituite vengono definite attraverso funzioni, dette *function-based views*, o attraverso classi, dette *class-based views*, che ricevono in input la richiesta effettuata dall'utente ed restituscono in output la risposta HTTP da inoltrargli.

È stato usato per la realizzazione del modulo backend in quanto presentato al corso di Tecnologie web di Unimore, e con tutte le funzionalità necessarie per la realizzazione del progetto del sito.


.. index::
   single: Django REST Framework
   single: Django REST Framework; function-based API view
   single: Django REST Framework; class-based API view
   single: Django REST Framework; viewset

Django REST Framework
^^^^^^^^^^^^^^^^^^^^^

`Django REST Framework <https://www.django-rest-framework.org/>`_ è un'estensione per `Django` che aggiunge la possibilità di inserire :abbr:`REST (representational state transfer)` :abbr:`API (application programming interface)` all'interno delle applicazioni Django.

Permette di definire metodi dell'API in modo molto simile alle views di Django: si vengono a creare le *function-based API views* se i metodi sono definiti attraverso funzioni, o le *class-based API views* se i metodi sono definiti attraverso classi.

Inoltre, permette la generazione automatica di metodi per l'interazione con certe entità del database, attraverso particolari classi dette *viewset*.


.. index::
   single: Docker; SDK for Python

Docker SDK for Python
^^^^^^^^^^^^^^^^^^^^^

Per interfacciarsi con i `moduli Jupyter <Modulo Jupyter>`, si è deciso di utilizzare `Docker SDK for Python <https://docker-py.readthedocs.io/en/stable/>`_, un client Python per l'interazione con il daemon `Docker`.

.. seealso::

   `Containerizzazione`, più avanti nel capitolo.

.. index::
   single: modulo; frontend

Modulo frontend
---------------

Il *modulo frontend* consiste in una applicazione web che consente agli utenti di interagire con Sophon da un'interfaccia grafica.

Le interazioni vengono inviate al `modulo proxy <Modulo proxy>`, che le ispeziona e le inoltra al `modulo server <Modulo server>`.

Sarà scritto in `TypeScript`, usando `Yarn` e le librerie `React`, `FontAwesome` e `Bluelib` in aggiunta a innumerevoli altre microdipendenze.


.. index::
   single: JavaScript

JavaScript
^^^^^^^^^^

.. todo:: JavaScript


.. index::
   single: TypeScript

TypeScript
^^^^^^^^^^

.. todo:: TypeScript


.. index::
   single: Node.JS

Node.JS
^^^^^^^

.. todo:: Node.JS


.. index::
   single: Yarn

Yarn
^^^^

.. todo:: Yarn


.. index::
   single: React

React
^^^^^

.. todo:: React


.. index::
   single: Bluelib


.. index::
   single: FontAwesome

FontAwesome
^^^^^^^^^^^

.. todo:: FontAwesome


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
   single: Docker; Compose

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

