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

Il modulo backend consiste in una web :abbr:`API (application programming interface)` che si interfaccia con il database e i moduli Jupyter, permettendo un accesso controllato alle risorse del software.

È scritto in `Python`, usando `Poetry` e le librerie `Django`, `Django REST Framework` e `Docker SDK for Python`, descritte nei prossimi paragrafi.

Esso è **eseguito dal server** sul quale si desidera ospitare Sophon.


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

È stato scelto per la realizzazione del modulo backend in quanto presentato al corso di Tecnologie web di Unimore, e in quanto contenente tutte le funzionalità necessarie per la realizzazione del progetto del sito.


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

Come per Django, è stato scelto per lo sviluppo di Sophon in quanto è stato presentato al corso di Tecnologie web di Unimore, e perchè si è ritenuto che fosse l'opzione più semplice per realizzare una web :abbr:`API (application programming interface)` all'interno di Django.


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

È scritto in `TypeScript`, usando `React` e le librerie `FontAwesome` e `Bluelib`, in aggiunta alle loro dipendenze ed altre piccole librerie di supporto.

Viene **eseguito dal browser web** dell'utente che desidera interagire con Sophon, transpilato da TypeScript a `JavaScript`.

.. todo::

   Transpilato esiste come parola italiana? Come si può tradurre "transpiled" altrimenti?


.. index::
   single: JavaScript

JavaScript
^^^^^^^^^^

`JavaScript <https://it.wikipedia.org/wiki/JavaScript>`_ è un linguaggio di programmazione interpretato con tipizzazione debole.

È l'unico linguaggio utilizzabile per fornire interattività alle pagine web; pertanto, è indirettamente utilizzato dal modulo frontend di Sophon.

Il suo modello di oggetti si basa su dizionari che mappano i nomi degli attributi ai loro corrispondenti valori.

Fa inoltre abbondante uso della capacità dei linguaggi dinamici di definire funzioni a runtime (dette anche callback), sfruttandole per favorire la programmazione funzionale.

.. code-block:: javascript

   var cane = {
      verso: () => console.log("Woof!"),
   };

   var gatto = {
      verso: () => console.log("Miao!"),
   };

   var zoo = [cane, gatto];

   zoo.forEach(
      (animale) => animale.verso()
   );

.. index::
   single: Node.js
   single: npm

Node.js
^^^^^^^

`Node.js <https://nodejs.org/>`_ è un runtime `JavaScript` che permette la scrittura e l'esecuzione di programmi all'esterno del contesto di un browser web, utilizzando invece come contesto il sistema operativo su cui viene eseguito.

Include :abbr:`npm (Node package manager)`, un gestore di pacchetti per il download di librerie Node, che interagisce con l'`npm Registry <https://www.npmjs.com/>`_.

È utilizzato da Sophon come toolchain per lo sviluppo e il deployment del modulo frontend, in quanto necessario per l'esecuzione di `Create React App`.


.. index::
   single: Create React App
   single: React; Create React App

Create React App
^^^^^^^^^^^^^^^^

`Create React App <https://create-react-app.dev/>`_ è un insieme di strumenti `Node.js` per lo sviluppo di una applicazione web utilizzando la libreria per la creazione di interfacce grafiche `React`.

È utilizzato da Sophon per la costruzione della pagina del modulo frontend che sarà servita all'utente.

Si è scelto di usare Create React App in quanto astrae al programmatore tutta la logica di creazione della pagina, semplificando enormemente la manutenzione ed `estensione <Estendibilità>` futura del software.


.. index::
   single: TypeScript

TypeScript
^^^^^^^^^^

`TypeScript <https://www.typescriptlang.org/>`_ è un'estensione al linguaggio di programmazione `JavaScript` che vi introduce un sistema di tipizzazione forte.

Non essendo immediatamente utilizzabile all'interno delle pagine web, deve essere prima convertito in JavaScript: ciò viene effettuato da `Create React App` in fase di costruzione dell'applicazione.

.. code-block:: typescript

   interface Animale {
      verso: () => string,
   }

   var cane: Animale = {
      verso: () => console.log("Woof!"),
   };

   var gatto: Animale = {
      verso: () => console.log("Miao!"),
   };

   var zoo: Animale[] = [cane, gatto];

   zoo.forEach(
      (animale) => animale.verso()
   );

È stata utilizzata in quasi ogni singola parte del modulo frontend, in quanto avere una tipizzazione forte riduce significativamente i bug prodotti e facilita manutenzione ed `estensione <estendibilità>` del software.


.. index::
   single: React
   single: React; componente
   single: React; hook

React
^^^^^

`React <https://reactjs.org/>`_ è una libreria `JavaScript` per lo sviluppo di interfacce grafiche interattive all'interno di pagine web o applicazioni mobile.

L'interfaccia viene definita in modo dichiarativo e funzionale attraverso una variante dei linguaggi `JavaScript` (o `TypeScript`) detta JSX (o TSX), che permette l'inserimento di nodi HTML all'interno del codice.

Si basa sul concetto di *componenti*, piccole parti incapsulate di interfaccia grafica riutilizzabili attraverso tutta l'applicazione definite attraverso funzioni pure, e di *hooks*, particolari funzioni il cui nome inizia con ``use`` in grado di tenere traccia dello stato di un componente o di causare effetti collaterali all'interno di esso.

.. code-block:: jsx

   const ComponenteTitoloMaiuscolo = ({text}) => {
      const capitalizedText = text.toUpperCase();

      return (
         <h1>
            {capitalizedText}
         </h1>
      );
   }

È stata scelta per l'utilizzo in Sophon in quanto permette la realizzazione di interfacce grafiche molto complesse attraverso codice di facile comprensione, rendendo possibile la creazione di un'interfaccia altamente `intuibile <Intuibilità>`.


.. index::
   single: FontAwesome

FontAwesome
^^^^^^^^^^^

`FontAwesome <https://fontawesome.com/>`_ è una libreria che fornisce più di mille icone utilizzabili gratuitamente all'interno di pagine web.

È stata usata per favorire l'`intuibilità <Intuibilità>` dell'interfaccia grafica attraverso simboli familiari all'utente.


.. index::
   single: Bluelib

Bluelib
^^^^^^^

.. todo::

   Come potrei dire impersonalmente che l'ho fatta io?

.. todo::

   Bluelib


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

