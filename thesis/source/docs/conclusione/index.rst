:github_url: https://github.com/Steffo99/sophon/blob/main/thesis/source/8_conclusione/index.rst

.. index::
   pair: Sophon; futuro

*******************
Il futuro di Sophon
*******************

Lo sviluppo di Sophon lascia aperte innumerevoli strade per la sua espansione con funzionalità aggiuntive.

Si conclude la tesi analizzandone alcune.


Repository GitHub di Sophon
===========================

È stato creato un `repository per il progetto su GitHub <https://github.com/Steffo99/sophon>`_.

Oltre al codice sorgente, esso include `un issue tracker <https://github.com/Steffo99/sophon/issues>`_, all'interno del quale viene tenuto traccia di tutte le proposte di funzionalità aggiuntive.

Si elencano alcune delle funzionalità proposte.


.. index::
   pair: Sophon; documento

Nuova entità: il documento
--------------------------

Si propone di sviluppare una nuova entità, il *documento*, che permetterebbe agli utenti di Sophon di creare testi in Markdown senza uscire dall'interfaccia web, e di renderli disponibili basandosi sul sistema di permessi di Sophon.

.. figure:: diagram_documents.png

   Schema del database se venisse aggiunta l'entità "Documento".


.. index::
   pair: Sophon; tag

Sistema per organizzazione delle entità
---------------------------------------

Si propone di realizzare dei sistemi che permettano di catalogare e raggruppare le entità di ogni tipo attraverso parole chiave (*tag*) selezionabili dal creatore della relativa entità.

Un esempio di tag potrebbe essere ``[Tesi]``, utilizzabile per i progetti relativi alle tesi degli studenti di un corso.

.. figure:: diagram_tags.png
   :scale: 25%

   Un esempio di come potrebbero funzionare i tag applicati ai progetti.


.. index::
   single: activity log
   single: registro delle attività

Registro delle attività
-----------------------

Si propone di creare un registro, detto *delle attività* o in inglese *activity log*, all'interno del quale siano registrate tutte le azioni effettuate sulle entità del progetto.

Ciò favorirebbe la accountability tra gli utenti di Sophon, in quanto diverrebbe possibile identificare il responsabile di certe azioni distruttive, come l'eliminazione di un intero gruppo.

.. figure:: diagram_activity_log.png
   :scale: 35%

   Un esempio di come potrebbe funzionare il registro delle attività.


.. index::
   pair: Sophon; federazione tra istanze

Federazione tra istanze
-----------------------

L'ultima proposta, molto ambiziosa, sarebbe quella di permettere la *federazione* tra le varie istanze Sophon, consentendo la condivisione di risorse attraverso più istituzioni senza dover creare utenti "locali" per ciascun collaboratore.

.. figure:: diagram_federation.png
   :scale: 50%

   Un diagramma di esempio di possibile federazione di Sophon.
