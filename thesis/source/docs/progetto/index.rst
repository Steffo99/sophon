:github_url: https://github.com/Steffo99/sophon/blob/main/thesis/source/4_progetto/index.rst

.. index::
   pair: Sophon; progettazione

***********************
Progettazione di Sophon
***********************

Vista la situazione della `ricerca collaborativa <Ricerca collaborativa>`, si è ritenuto potesse essere utile sviluppare un'alternativa al `progetto JupyterHub <Hosting on-premises>`.


.. index::
   pair: Sophon; requisiti del progetto

Requisiti del progetto
======================

Si è stabilito che per essere un'alternativa valida, il progetto dovesse avere i seguenti requisiti:

*  `estendibilità <Estendibilità>`
*  `security by default <Sicurezza>`
*  `interfaccia grafica facile ed intuitiva <Intuitività>`
*  `maggiore possibilità di collaborazione <Possibilità di collaborazione>`
*  `codice open source <Open source>`
*  `possibilità di personalizzazione <Personalizzabilità>`
*  `accessibilità <Accessibilità>`

Seguono descrizioni dettagliate dei requisiti elencati.


.. index::
   pair: requisiti; estendibilità

Estendibilità
-------------

**Aggiungere nuove funzionalità** al software deve essere facile, e non richiedere ristrutturazioni profonde del codice.

Inoltre, il software deve essere **modulare**, in modo da semplificare l'aggiornamento, la sostituzione e la eventuale rimozione di componenti.

Infine, il software deve esporre un'**interfaccia alla quale altri software esterni possono connettersi** per interagirvi come se fossero un utente.


.. index::
   pair: requisiti; sicurezza

Sicurezza
---------

I dati immagazzinati all'interno del software devono essere **protetti da acccessi non autorizzati**.

**Tentativi di ingannare gli utenti del software devono essere impediti**, riducendo il fattore umano nelle falle di sicurezza.

Non si reputa importante impedire agli utenti di comunicare con Internet all'interno delle loro ricerche, in quanto si ritiene che essi siano utenti fidati; qualora ne sorga la necessità, ciò deve essere possibile senza ristrutturazione del codice.

Non si reputa nemmeno importante limitare le risorse utilizzate dai `notebook <notebook computazionali>` in uso; deve però essere possibile implementare la funzionalità in futuro, se divenisse necessario.


.. index::
   pair: requisiti; intuibilità

Intuitività
-----------

Il modo in cui utilizzare l'interfaccia utente del software deve essere **intuitiva** per l'utente medio, senza che egli abbia bisogno di leggere alcuna guida o manuale.

A tale scopo, l'interfaccia grafica deve utilizzare **design patterns comuni e familiari** all'utente medio.

In aggiunta, i **dettagli implementativi devono essere nascosti** all'utente, in modo che possa concentrarsi sull'utilizzo del software.


.. index::
   pair: requisiti; personalizzabilità

Personalizzabilità
------------------

Il software deve permettere all'utente di **personalizzare il suo workflow senza alcuna limitazione**, che ciò venga fatto tramite plugin, configurazioni speciali o modifica di file dell'ambiente di lavoro, assicurando che i workflow personalizzati di un utente **non possano interferire** con quelli degli altri.

Inoltre, il software deve inoltre permettere all'amministratore di **personalizzare nome e aspetto** mostrati agli utenti nell'interfaccia grafica, in modo che essa possa essere adattata al brand dell'istituzione che utilizza il progetto.


.. index::
   pair: requisiti; possibilità di collaborazione

Possibilità di collaborazione
-----------------------------

Il software deve permettere agli utenti di **collaborare sui notebook in tempo reale**, come all'interno dei `web-based editor <Web-based editor>`.

Devono essere **facilitate le interazioni tra utenti**, al fine di ridurre errori e incomprensioni tra essi.


.. index::
   pair: requisiti; open source

Open source
-----------

Il software deve essere interamente **open source**.

In pieno spirito collaborativo, il **codice sorgente deve essere liberamente consultabile, modificabile, utilizzabile e condivisibile**, sia per soddisfare la curiosità degli utenti, sia per permetterne lo studio e il miglioramento.

Tutte le **modifiche al codice sorgente devono essere rese disponibili agli utenti** del software modificato, in modo che possano verificare l'affidabilità del software che utilizzano.


.. index::
   pair: requisiti; responsività

Responsività
------------

Il software deve essere **utilizzabile su schermi di dimensione ridotta**, come quelli di un cellulare.

Pertanto, gli elementi dell'interfaccia devono essere disposti in modo tale da permetterne la visualizzazione corretta su schermi di qualsiasi dimensione e risoluzione.


.. index::
   pair: requisiti; accessibilità

Accessibilità
-------------

Il software deve essere utilizzabile da **qualsiasi tipologia di utente**, inclusi utenti con disabilità visive e motorie.

Deve essere quindi possibile utilizzare il software **interamente da tastiera**, senza dover ricorrere a un mouse.

Inoltre, i colori dell'interfaccia grafica devono **essere scelti favorendo l'accessibilità degli utenti daltonici**.


.. index::
   pair: Sophon; separazione in moduli

Separazione in moduli
=====================

Per realizzare il requisito dell'`estendibilità <Estendibilità>`, si è scelto di separare le parti dell'applicazioni in 4 diversi moduli interagenti.

.. figure:: diagram_modules.png

   Schema che mostra come interagiscono tra loro i moduli di Sophon.


.. index::
   pair: modulo; backend

Modulo backend
--------------

Il modulo backend consiste in una web :abbr:`API (application programming interface)` che si interfaccia con il database e i moduli Jupyter, permettendo un accesso controllato alle risorse del software.

È scritto in `Python`, usando `Poetry` e le librerie `Django`, `Django REST Framework` e `Docker SDK for Python`, descritte nei prossimi paragrafi.

Esso è **eseguito dal server** sul quale è ospitato Sophon.


.. index::
   single: Python
   single: Python; packages

Python
^^^^^^

`Python <https://www.python.org/>`_ è un linguaggio di programmazione orientato agli oggetti interpretato con tipizzazione dinamica forte, particolarmente popolare negli ambiti dello sviluppo web e data science.

Ha numerosissime librerie (dette *packages*), sia incluse nella distribuzione base del linguaggio, sia disponibili per il download sul `Python Package Index <https://pypi.org/>`_.

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

La sua semplicità e l'enorme quantità di librerie a disposizione lo ha reso il secondo linguaggio di programmazione più popolare al mondo [so:survey2021]_, subito dopo `JavaScript`; proprio per questi motivi è stato scelto per lo sviluppo del modulo backend.


.. index::
   single: Poetry

Poetry
^^^^^^

Per gestire le dipendenze di Sophon si è scelto di usare `Poetry <https://python-poetry.org/>`_, un innovativo package manager per il linguaggio Python.

Poetry è in grado di risolvere automaticamente alberi complessi di dipendenze, generando un *lockfile* (``poetry.lock``) con la soluzione adottata, in modo che le dipendenze utilizzate siano congelate e uguali per tutti gli ambienti in cui deve essere sviluppato Sophon.


.. index::
   single: Django
   pair: Django; app
   pair: Django; view
   pair: Django; function-based view
   pair: Django; class-based view

Django
^^^^^^

`Django <https://www.djangoproject.com/>`_ è un framework Python per lo sviluppo di siti web dinamici.

Fornisce una suite di strumenti che assistono nella creazione di siti di medie dimensioni, come un :abbr:`ORM (object-relational model)` per i database, una pagina di amministrazione integrata per la gestione dei contenuti del sito e un sistema di moduli scollegabili detti "app".

Le pagine restituite vengono definite attraverso funzioni, dette *function-based views*, o attraverso classi, dette *class-based views*, che ricevono in input la richiesta effettuata dall'utente ed restituscono in output la risposta HTTP da inoltrargli.

È stato scelto per la realizzazione del modulo backend in quanto presentato al corso di Tecnologie web di Unimore, e in quanto contenente tutte le funzionalità necessarie per la realizzazione del progetto del sito.


.. index::
   single: Django REST Framework
   pair: Django REST Framework; function-based API view
   pair: Django REST Framework; class-based API view
   pair: Django REST Framework; viewset

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
   pair: modulo; frontend

Modulo frontend
---------------

Il *modulo frontend* consiste in una applicazione web che consente agli utenti di interagire con Sophon da un'interfaccia grafica.

Le interazioni vengono inviate al `modulo proxy <Modulo proxy>`, che le ispeziona e le inoltra al `modulo backend <Modulo backend>`.

È scritto in `TypeScript`, usando `React` e le librerie `FontAwesome` e `Bluelib`, in aggiunta alle loro dipendenze ed altre piccole librerie di supporto.

Viene **eseguito dal browser web** dell'utente che desidera interagire con Sophon, transcompilato da TypeScript a `JavaScript`.


.. index::
   single: JavaScript

JavaScript
^^^^^^^^^^

`JavaScript <https://it.wikipedia.org/wiki/JavaScript>`_ è un linguaggio di programmazione interpretato con tipizzazione dinamica debole.

È l'unico linguaggio utilizzabile per rendere interattive le pagine web; pertanto, è indirettamente utilizzato dal modulo frontend di Sophon.

Il suo modello di oggetti si basa su dizionari che mappano i nomi degli attributi ai loro corrispondenti valori.

Fa inoltre abbondante uso della capacità dei linguaggi dinamici di definire funzioni a runtime (dette anche callback), sfruttandole per favorire la programmazione funzionale.

.. code-block:: javascript

   const cane = {
      verso: () => console.log("Woof!"),
   };

   const gatto = {
      verso: () => console.log("Miao!"),
   };

   const zoo = [cane, gatto];

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
   pair: React; componente
   pair: React; hook

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

È stata scelta per l'utilizzo in Sophon in quanto permette la realizzazione di interfacce grafiche molto complesse attraverso codice di facile comprensione, rendendo possibile la creazione di un'interfaccia interattiva ed `intuitiva <Intuitività>`.


.. index::
   single: FontAwesome

FontAwesome
^^^^^^^^^^^

`FontAwesome <https://fontawesome.com/>`_ è una libreria che fornisce più di mille icone utilizzabili gratuitamente all'interno di pagine web.

È stata usata per favorire l'`intuibilità <Intuitività>` dell'interfaccia grafica attraverso simboli familiari all'utente.


.. index::
   single: Bluelib
   pair: Bluelib; tema

Bluelib
^^^^^^^

`Bluelib <https://gh.steffo.eu/bluelib/>`_ è un foglio di stile per pagine web orientato alla modularità, alla responsività e all'`accessibilità <Accessibilità>`.

È stato sviluppato nell'Estate 2021 come progetto personale dell'autore di questa tesi, ed è stato esteso con temi aggiuntivi in Autunno 2021, tra cui uno sviluppato appositamente per Sophon.

Si basa sul concetto di **pannelli**, sezioni di pagina separate dal resto tramite un colore di sfondo o un bordo diverso.

Fa ampio uso delle `CSS Custom Properties <https://developer.mozilla.org/en-US/docs/Web/CSS/--*>`_, permettendo lo sviluppo di vari *temi* con aspetto differente.

.. figure:: bluelib_royalblue.png

   Il tema "Royal Blue" (``royalblue``) di Bluelib, da cui ha origine il nome.

.. figure:: bluelib_paper.png

   Il tema "Sheet of Paper" (``paper``) di Bluelib, pensato per la stampa su carta.

.. figure:: bluelib_sophon.png

   Il tema "The Sophonity" (``sophon``) di Bluelib, creato appositamente per questo progetto.

.. figure:: bluelib_hacker.png

   Il tema "Hacker Terminal" (``hacker``) di Bluelib, creato per testare la visualizzazione di caratteri monospace.

.. figure:: bluelib_amber.png

   Il tema "Gestione Amber" (``amber``) di Bluelib, realizzato da Lorenzo Balugani.


.. index::
   pair: Bluelib; React

Bluelib React
"""""""""""""

`Bluelib React <http://gh.steffo.eu/bluelib-react/>`_ è un adattamento a `React` del foglio di stile `Bluelib`.

È stato sviluppato a inizio Autunno 2021 come parte del tirocinio interno dell'autore di questa tesi.

Definice componenti per ogni elemento grafico introdotto in Bluelib, e rende velocemente configurabili alcuni parametri, come il colore o la disabilitazione di un pannello.


.. index::
   pair: modulo; proxy

Modulo proxy
------------

Il *modulo proxy* consiste in un web server che permette di accedere al `modulo backend <Modulo backend>`, ai `moduli Jupyter <Modulo Jupyter>` e a una versione preconfigurata del `modulo frontend <Modulo frontend>`.

È stato realizzato configurando `Apache HTTP Server` in modo che effettuasse dinamicamente `reverse proxying <Reverse proxy>` verso gli altri moduli basandosi su una rubrica aggiornata dal backend.

Viene **eseguito dal server** sul quale è ospitato Sophon.


.. index::
   pair: reverse; proxy

Reverse proxy
^^^^^^^^^^^^^

Il *reverse proxying* è un'operazione effettuabile dai web server per permettere l'accesso controllato ad altri web server collocati su una rete interna attraverso l'inoltro di pacchetti.

Frequentemente, il reverse proxying viene utilizzato per "aggiungere" l'HTTPS a un web server disponibile solo in HTTP, o per disambiguare tra più web server che devono essere accessibili allo stesso indirizzo IP ma con nomi di dominio diversi.

In un'installazione predefinita di Sophon, il reverse proxying effettuato è duplice:

*  il server web della macchina host riceve richieste HTTPS e le inoltra in HTTP al server web del `modulo proxy <Modulo proxy>`;
*  il server web del modulo proxy riceve richieste HTTP che inoltra ai vari moduli in base al valore dell'header ``Host`` della richiesta ricevuta.

.. figure:: diagram_proxy.png

   Schema del reverse proxying di Sophon.


.. index::
   single: Apache; HTTP server
   single: httpd
   single: Apache; apache2

Apache HTTP server
^^^^^^^^^^^^^^^^^^

`Apache HTTP Server <https://httpd.apache.org/>`_, comunemente chiamato anche *httpd* o *apache2*, è uno dei tre webserver "general purpose" più comunemente usati al mondo.

Ha una struttura a moduli, che forniscono funzionalità aggiuntive, ed è configurabile tramite uno o più file ``.conf`` aventi sintassi come la seguente:

.. code-block:: apacheconf

   # Questa è un'istruzione globale.
   Bind 80

   # Questo è un blocco di istruzioni ristretto a un contesto specifico.
   <VirtualHost *:80>
      ServerName "ilmiosophon.it"
      ServerAlias "*.ilmiosophon.it"

      RewriteEngine On
      RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
   </VirtualHost>


.. index::
   single: modulo; Jupyter
   single: Jupyter; modulo di Sophon

Modulo Jupyter
--------------

Il *modulo Jupyter* consiste in una versione preconfigurata di `Jupyter` pronta per essere istanziata dal `modulo backend <Modulo backend>`.

Tanti moduli Jupyter possono esistere contemporaneamente su Sophon: ne viene creato uno per ogni `notebook computazionale <Notebook computazionali>` gestito dal modulo backend.

Viene **eseguito dal server** sul quale è ospitato Sophon.


.. index::
   single: containerizzazione

Containerizzazione
==================

Al fine di facilitare l'installazione e di migliorare la `sicurezza <Sicurezza>` dell'applicazione, si è stabilito di costruire `container Docker <Container Docker>` per tutti i moduli di Sophon.


.. index::
   single: Docker

Docker
------

`Docker <https://www.docker.com/>`_ è un software che permette di eseguire applicazioni all'interno di `container <Container Docker>` isolati dal resto del sistema, in maniera simile all'esecuzione di macchine virtuali, ma **condividendo il kernel** con la macchina host.

È composto da due parti, `Docker Engine` e `Docker Compose`, e prevede varie astrazioni, quali le `immagini <Immagini Docker>`, i `container <Container Docker>`, i `network <Network Docker>` e i `volumi <Volumi Docker>`.


.. index::
   pair: Docker; image
   pair: Docker; immagine

Immagini Docker
^^^^^^^^^^^^^^^

Le *immagini* Docker sono sequenze di regole e insiemi di file per la creazione di un `container <Container Docker>`, tipicamente partendo da un altro container come base. [docker:overview]_

Utilizzano un filesystem copy-on-write a strati: vengono registrate all'interno dell'immagine solamente le modifiche che ogni regola ha apportato al filesystem interno, rendendo le immagini molto più leggere di quanto lo sarebbero se dovesse essere salvato tutto il disco virtuale.

Possono essere comparate a immagini di macchine virtuali con tanti "punti di ripristino".


.. index::
   pair: Docker; container

Container Docker
^^^^^^^^^^^^^^^^

I *container* Docker sono istanze di `immagini <Immagini Docker>` che possono essere eseguite dal `Docker Engine` [docker:overview]_.

Sono l'equivalente di un'intera macchina virtuale, che può essere avviata o arrestata.


.. index::
   pair: Docker; network

Network Docker
^^^^^^^^^^^^^^

I *network* Docker sono astrazioni per vari tipi di reti di calcolatori: in particolare, essi permettono di collegare vari `container <Container Docker>` ad una rete locale virtuale, permettendone l'interazione [docker:networking]_.

All'interno di un network è disponibile una funzionalità di risoluzione automatica degli indirizzi IP virtuali dei container: per accedere al container ``pear`` in HTTP, ad esempio, sarà sufficiente utilizzare ``apple`` come se fosse un nome di dominio: ``http://pear/``.

Sono una versione più elaborata ed efficiente dei moduli di rete per macchine virtuali.


.. index::
   pair: Docker; volume

Volumi Docker
^^^^^^^^^^^^^

I *volumi* Docker sono astrazioni per filesystem che permettono la permanenza e la condivisione tra container di file [docker:volumes]_.

Essi vengono montati all'interno di un container in una cartella configurabile detta *mount point*; tutti i container con accesso al volume vedranno gli stessi file all'interno di essa.

Sono il parallelo delle immagini disco delle macchine virtuali.


.. index::
   pair: Docker; Engine

Docker Engine
-------------

`Docker Engine <https://docs.docker.com/engine/>`_ è il daemon che si occupa della gestione di `immagini <Immagini Docker>`, `container <Container Docker>`, `network <Network Docker>` e `volumi <Volumi Docker>`.

Astrae la piattaforma su cui viene eseguito, in modo che tutte le immagini possano essere eseguite su Linux come su Windows o Mac OS X.


.. index::
   pair: Docker; Compose

Docker Compose
--------------

`Docker Compose <https://docs.docker.com/compose/>`_ è uno strumento da linea di comando che permette l'esecuzione di applicazioni Docker composte da più container.

Le applicazioni Compose sono definite all'interno di un file `YAML <https://it.wikipedia.org/wiki/YAML>`_ come il seguente:

.. code-block:: yaml

   version: "3.9"

   # Elenco dei volumi dell'applicazione
   volumes:
     db-data:

   # Elenco dei network dell'applicazione
   networks:
     main:

   # Elenco dei container dell'applicazione
   services:
     db:
       # Immagine del container
       image: postgres
       # Mount point dei volumi del container
       volumes:
         - db-data:/var/lib/postgresql/data
       # Network del container
       networks:
         - main

     app:
       image: my-app-image
       networks:
         - main
       # Container richiesti da questo container
       depends_on:
         - db



.. index::
   single: controllo versione
   single: version control system
   single: vcs

Controllo versione
==================

Per assistere nello sviluppo del software si è deciso di utilizzare il sistema di controllo versione `Git` in ogni fase dello sviluppo del progetto.

Inoltre, per favorire lo sviluppo di una community `open source <Open source>` attorno a Sophon, si è deciso di pubblicare il progetto su `GitHub`, sotto la `Affero General Public License 3.0+`.


.. index::
   single: Git
   pair: Git; repository
   pair: Git; commit

Git
---

`Git <https://git-scm.com/>`_ è un software di controllo versione, ovvero un software in grado di tenere traccia di modifiche effettuate su file, in modo da mantenerne uno storico, e permettere a più autori di lavorare in parallelo su documenti.

Inizialmente realizzato da Linus Torvalds per lo sviluppo del kernel Linux, ha preso velocemente piede in tutto il settore dello sviluppo software, diventando di fatto lo standard per lo sviluppo collaborativo di software.

Le cartelle di file tracciate da Git sono dette *repository*, mentre un blocco atomico di modifiche è detto *commit*.


.. index::
   pair: Git; GitHub

GitHub
------

`GitHub <https://github.com/>`_ è un servizio web di Microsoft per l'hosting e la pubblicazione di repository Git.

Per ciascun repository sono messe a disposizione gratuitamente numerose funzionalità, quali un issue tracker, strumenti di code review e sistemi di automazione per lo sviluppo [github:features]_.


Affero General Public License 3.0+
----------------------------------

Sophon è rilasciato sotto la `GNU Affero General Public License v3`_ (o successiva).

Il testo completo della licenza è disponibile all'interno del file `LICENSE.txt`_ allegato al codice sorgente del software.

In breve, la licenza, detta virale, permette a chiunque di utilizzare, distribuire e modificare il software, a condizione che qualsiasi modifica venga ri-distribuita agli utenti del software modificato utilizzando la stessa licenza.

Si specifica che la licenza copre tutti i file all'interno del repository ``Steffo99/sophon``, anche se essi non contengono un header che indica che sono protetti da copyright.

.. _GNU Affero General Public License v3: https://www.gnu.org/licenses/agpl-3.0.html
.. _LICENSE.txt: https://github.com/Steffo99/sophon/blob/main/LICENSE.txt


.. index::
   pair: Sophon; entità

Entità di Sophon
================

Al fine di definire più in dettaglio le operazioni che devono poter essere effettuate all'interno di Sophon, sono state definite delle *entità*, i tipi base con cui l'utente può interagire.


.. index::
   pair: Sophon; istanza

Istanza in Sophon
-----------------

Un'*istanza* rappresenta un'**installazione di Sophon** effettuata su un server di un'istituzione di ricerca, come ad esempio un'Università.

Ogni istanza è **fisicamente e logicamente separata** dalle altre; istanze diverse **non condividono alcun dato** tra loro.

URL dell'istanza
^^^^^^^^^^^^^^^^

Ciascuna istanza è accessibile tramite **uno specifico URL**, scelto dall'amministratore di sistema al momento dell'installazione.

.. figure:: diagram_instance_urls.png

   Schema rappresentante un esempio di URL di istanza rispettivamente per Unimore, Unibo e il CERN. Si noti come Sophon possa essere ospitato a domini di qualsiasi livello o radici diverse da ``/``, quella predefinita.


.. index::
   pair: Sophon; utente

Utenti in Sophon
----------------

Un *utente* è una entità che interagisce con una specifica istanza Sophon: ad esempio, un utente potrebbe essere una persona fisica, oppure potrebbe essere un software di automazione che si interfaccia con Sophon.

La tabella viene creata automaticamente da Django all'interno di ogni applicazione che include


.. index::
   pair: Sophon; superutente
   pair: Sophon; ospite
   pair: Sophon; livello di accesso

Livelli di accesso
^^^^^^^^^^^^^^^^^^

Un utente può avere uno dei seguenti *livelli di accesso*:

Superutente
   Utente con accesso completo a ogni singola risorsa sull'istanza Sophon, tipicamente riservato per l'amministratore di sistema.

Utente
   Utente con permessi limitati alle risorse che ha creato o a cui è stato fornito accesso.

Ospite
   Utente che può visualizzare alcuni contenuti dell'istanza Sophon ma non può interagirci.


.. index::
   pair: Sophon; credenziali di accesso
   pair: Sophon; username
   pair: Sophon; password
   pair: Sophon; Single Sign-On

Credenziali di accesso
^^^^^^^^^^^^^^^^^^^^^^

Gli utenti di tipo *Utente* e *Superutente* devono identificarsi sull'istanza con le loro credenziali.

Di default, le credenziali sono un **nome utente** e una **password**, ma è possibile implementare un sistema diverso, ad esempio un sistema :abbr:`SSO (Single Sign-On)`.


.. index::
   pair: Sophon; gruppo

Gruppi di ricerca in Sophon
---------------------------

Un *gruppo di ricerca* rappresenta un insieme di utenti che collaborano su uno o più progetti.


.. index::
   pair: Sophon; membro
   pair: gruppo; modalità di accesso

Membri e modalità di accesso
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Gli utenti dell'`istanza <Istanza in Sophon>` possono diventare *membri* dei gruppi di ricerca, con una delle seguenti modalità selezionate nelle impostazioni del gruppo:

- se il gruppo è *aperto*, allora qualsiasi utente potrà diventarne membro semplicemente **facendo richiesta** attraverso l'interfaccia web;
- se il gruppo è in *modalità manuale*, allora nessun utente potrà richiedere di unirsi, e i membri saranno **selezionati manualmente** dal creatore del gruppo.

In qualsiasi momento, i membri di un gruppo possono **lasciarlo** facendo apposita richiesta attraverso il frontend.


Creazione di nuovi gruppi
^^^^^^^^^^^^^^^^^^^^^^^^^

Qualsiasi `utente <Utenti in Sophon>` può **creare** gruppi di ricerca dall'interfaccia web.


Modifica di gruppi
^^^^^^^^^^^^^^^^^^

Il creatore di un gruppo di ricerca è l'unico `utente <Utenti in Sophon>` che può cambiarne **nome**, **descrizione**, **membri** e **modalità di accesso**.

Lo *slug*, l'identificatore univoco del gruppo, non è modificabile successivamente alla creazione, in quanto verrà utilizzato all'interno degli URL, che devono essere immutabili.


Eliminazione di gruppi
^^^^^^^^^^^^^^^^^^^^^^

Il creatore di un gruppo è l'unico utente in grado di **cancellare** il gruppo che ha creato.

.. danger::

   L'eliminazione di un gruppo è un'operazione distruttiva non reversibile!


.. index::
   pair: Sophon; progetto

Progetti di ricerca in Sophon
-----------------------------

Un *progetto di ricerca* rappresenta una **collezione di oggetti** relativa a un singolo argomento mantenuta da un `gruppo di ricerca <Gruppi di ricerca in Sophon>`.


.. index::
   single: Sophon; visibilità del progetto

Visibilità dei progetti
^^^^^^^^^^^^^^^^^^^^^^^

I progetti hanno tre diverse impostazioni di visibilità che regolano chi può visualizzarne i contenuti:

Progetto privato
   Il progetto è visibile **solo ai membri del gruppo** a cui appartiene il progetto.

Progetto interno
   Il progetto è visibile **solo agli utenti** dell'istanza, e non agli ospiti.

Progetto pubblico
   Il progetto è visibile **a tutti**.


Creazione di nuovi progetti
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Qualsiasi *membro* di un `gruppo di ricerca <Gruppi di ricerca in Sophon>` può creare nuovi progetti.


Modifica di progetti
^^^^^^^^^^^^^^^^^^^^

Qualsiasi *membro* di un `gruppo di ricerca <Gruppi di ricerca in Sophon>` può modificare **nome**, **descrizione** dei progetti al suo interno.

Solo il *creatore del gruppo* può modificarne la **visibilità**, o **trasferire il progetto ad un altro gruppo**.

Lo *slug*, l'identificatore univoco del progetto, non è modificabile successivamente alla creazione, in quanto è utilizzato all'interno degli URL, che devono essere immutabili.


Eliminazione di progetti
^^^^^^^^^^^^^^^^^^^^^^^^

Qualsiasi *membro* di un `gruppo di ricerca <Gruppi di ricerca in Sophon>` può eliminare i progetti al suo interno.

.. danger::

   L'eliminazione di un progetto è un'operazione distruttiva non reversibile!


.. index::
   pair: Sophon; notebook

Notebook in Sophon
------------------

Un *notebook* rappresenta una **postazione di lavoro** che può essere allegata ad un `progetto di ricerca <Progetti di ricerca in Sophon>`.


Creazione di nuovi notebook
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Qualsiasi **membro** di un `gruppo di ricerca <Gruppi di ricerca in Sophon>` può creare nuovi notebook all'interno di uno dei progetti del gruppo a cui appartiene.


Slug riservati
^^^^^^^^^^^^^^

Un notebook non può avere come *slug* uno dei seguenti valori, in quanto riservati per altri usi:

*  ``backend``
*  ``frontend``
*  ``proxy``
*  ``api``
*  ``static``
*  ``src``

In più, uno slug di un notebook non può iniziare o terminare con un trattino ``-``, in quanto risulterebbe in un sottodominio non valido.


.. index::
   pair: Sophon; stato del notebook

Stato del notebook
^^^^^^^^^^^^^^^^^^

Un notebook può essere *avviato* o *fermo* in base al suo stato di esecuzione sull'`istanza <Istanza in Sophon>` Sophon:

*  è *avviato* se è in esecuzione e accessibile;
*  è *fermo* se non è in esecuzione o se è in fase di preparazione.

Alla creazione, un notebook è *fermo*.


Avviare un notebook
"""""""""""""""""""

Un **membro** del `gruppo di ricerca <Gruppi di ricerca in Sophon>` a cui appartiene il notebook può richiedere al server l'avvio di quest'ultimo, in modo da poterlo utilizzare successivamente.


Fermare un notebook
"""""""""""""""""""

Un **membro** del `gruppo di ricerca <Gruppi di ricerca in Sophon>` a cui appartiene il notebook può richiedere al server l'arresto di quest'ultimo, salvando i dati e interrompendo la sessione di lavoro attualmente in corso.


.. index::
   pair: Sophon; immagine

Immagine del notebook
^^^^^^^^^^^^^^^^^^^^^

In **fase di creazione** di un notebook, oppure mentre esso è **fermo**, è possibile selezionare l'`immagine Docker <Immagini Docker>` che esso deve eseguire all'avvio.

Di default, l'immagine deve essere quella del `modulo Jupyter <Modulo Jupyter>`.

Le immagini ammesse devono esporre un server HTTP sulla porta 8080, su cui verrà fatto `reverse proxying <reverse proxy>` dal `modulo proxy <Modulo proxy>`.


Collegamento a un notebook
^^^^^^^^^^^^^^^^^^^^^^^^^^

I **membri** del `gruppo di ricerca <Gruppi di ricerca in Sophon>` a cui appartiene il notebook possono connettersi ad un notebook **avviato** attraverso un URL segreto comunicatogli dal `modulo backend <Modulo backend>`.

L'URL segreto è ottenuto inserendo come query parameter dell'URL del notebook il token di autenticazione di `Jupyter`.


.. index::
   pair: Sophon; notebook bloccato

Blocco di un notebook
^^^^^^^^^^^^^^^^^^^^^

Qualsiasi **membro** del `gruppo di ricerca <Gruppi di ricerca in Sophon>` a cui appartiene il notebook può *bloccarlo* per segnalare agli altri utenti che vi hanno accesso di non utilizzare quello specifico notebook.

Bloccare un notebook **rimuove dall'interfaccia web** i bottoni di interazione con esso per tutti gli utenti, tranne l'utente richiedente il blocco.

.. note::

   Il blocco di un notebook **è solo estetico**, e non ha lo scopo di impedire agli utenti di interagire con il notebook, ma serve per indicare ai propri collaboratori che si stanno effettuando modifiche che non permettono collaborazione sul notebook.

Un notebook bloccato può essere sbloccato da qualsiasi **membro** del `gruppo di ricerca <Gruppi di ricerca in Sophon>`; il membro che ha richiesto il blocco potrà sbloccarlo **immediatamente**, mentre agli altri membri è richiesto di confermare l'azione.


Modifica di un notebook
^^^^^^^^^^^^^^^^^^^^^^^

Qualsiasi *membro* di un `gruppo di ricerca <Gruppi di ricerca in Sophon>` può modificare **nome** e **immagine** dei notebook *fermi* al suo interno.

I notebook *avviati* non possono essere modificati.

Lo *slug*, l'identificatore univoco del notebook, non è modificabile successivamente alla creazione, in quanto è utilizzato all'interno degli URL, che devono essere immutabili.


Eliminazione di un notebook
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Qualsiasi *membro* di un `gruppo di ricerca <Gruppi di ricerca in Sophon>` può eliminare i notebook all'interno dei progetti del gruppo, a condizione che questi siano *fermi* e *non bloccati*.


.. index::
   pair: Sophon; database
   single: PostgreSQL

Database
========

Il `modulo backend <Modulo backend>` di Sophon necessita di archiviare dati persistenti altamente relazionali; pertanto, è stato necessario adottare una soluzione in grado di gestirli.

A tale scopo, è stato selezionato il database relazionale `PostgreSQL <https://www.postgresql.org/>`_, in quanto :abbr:`FLOSS (Free and Libre Open Source Software)`, adatto a dati relazionali, compatibile con Django, e ampiamente utilizzato in tutto il mondo.

.. figure:: diagram_database.png

   Schema semplificato del database di Sophon.
