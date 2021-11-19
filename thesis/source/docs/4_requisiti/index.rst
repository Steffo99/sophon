*********
Requisiti
*********

Sophon è stato realizzato per fornire un'alternativa al `progetto JupyterHub <Hosting on-premises>` con i seguenti requisiti:

*  più facile `estendibilità <Estendibilità>`
*  `security <Sicurezza>` by default
*  interfaccia grafica `facile ed intuibile <Intuibilità>`
*  maggiore `possibilità di collaborazione <Possibilità di collaborazione>`
*  codice `open source <Open source>`
*  `possibilità di personalizzazione <Personalizzabilità>`
*  completa `accessibilità <Accessibilità>`


Estendibilità
=============

Aggiungere nuove funzionalità al software deve essere facile, e non richiedere ristrutturazioni profonde del codice.

Inoltre, il software deve essere modulare, in modo da semplificare l'aggiornamento, la sostituzione e la eventuale rimozione di componenti.

Infine, il software deve esporre un'interfaccia alla quale altri software esterni possono connettersi per interagirvi come se fossero un utente.


Sicurezza
=========

I dati immagazzinati all'interno del software non devono essere accessibili agli utenti non autorizzati.

Inoltre, tentativi di ingannare gli utenti del software devono essere resi più difficili possibile, riducendo il fattore umano delle falle di sicurezza.

Non si reputa importante impedire agli utenti di comunicare con Internet all'interno delle loro ricerche, in quanto si ritiene che essi siano utenti fidati; qualora ne sorga la necessità, ciò deve essere possibile senza ristrutturazione del codice.


Intuibilità
===========

Il modo in cui utilizzare l'interfaccia utente del software deve essere intuibile all'utente medio, senza che abbia bisogno di leggere alcuna guida o manuale.

A tale scopo, l'interfaccia grafica deve utilizzare design patterns comuni e familiari all'utente medio.

In aggiunta, i dettagli implementativi devono essere nascosti all'utente, in modo che possa concentrarsi sull'utilizzare il notebook.


Personalizzabilità
==================

Il software deve permettere all'utente di personalizzare il suo workflow senza alcuna limitazione, che venga fatto tramite plugin, configurazioni speciali o modifica di file dell'ambiente di lavoro, assicurando che i workflow personalizzati di un utente non possano interferire con quelli degli altri.

Inoltre, il software deve inoltre permettere all'amministratore di personalizzare nome e aspetto mostrati agli utenti nell'interfaccia grafica, in modo che essa possa essere adattata al brand dell'istituzione che utilizza il progetto.


Possibilità di collaborazione
=============================

Il software deve permettere agli utenti di collaborare sui notebook in tempo reale, come all'interno dei `web-based editor <Web-based editor>`.


.. todo::

   Il software deve facilitare le interazioni all'interno del gruppo, e non complicarle. (Preludio al meccanismo di locking)


Open source
===========

Il software deve essere open source nella sua interezza.

In pieno spirito collaborativo, il codice sorgente deve essere liberamente consultabile, modificabile, utilizzabile e condivisibile da chiunque, sia per soddisfare la curiosità degli utenti, sia per permetterne lo studio e il miglioramento.

Tutte le modifiche al codice sorgente devono essere disponibili agli utenti del software modificato, in modo che possano verificare l'affidabilità del software che utilizzano.


Responsività
============

Il software deve essere utilizzabile almeno in parte da schermi di dimensione ridotta, come quelli di un cellulare.

Pertanto, gli elementi dell'interfaccia devono essere disposti in modo che non escano dallo schermo qualora non ci fosse spazio sufficiente per mostrarli.

.. todo:: eh?


Accessibilità
=============

Il software deve essere utilizzabile da qualsiasi tipologia di utente, inclusi utenti con disabilità visive e motorie.

Deve essere allora possibile utilizzare il software interamente da tastiera, senza dover ricorrere a un mouse.

Inoltre, i colori scelti per l'interfaccia grafica non devono essere confondibili da persone affette da daltonismo.

Infine, l'intero software deve essere navigabile tramite screen reader, permettendo a non-vedenti di usare il progetto.
