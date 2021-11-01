I concetti
**********

Istanza
=======

Un'*istanza* rappresenta un'**installazione di Sophon** effettuata su un server di un'istituzione di ricerca, come ad esempio un'Università.

Ogni istanza è **fisicamente e logicamente separata** dalle altre; istanze diverse **non condividono alcun dato** tra loro.

.. image:: instances_diagram.png
   :width: 400


URL dell'istanza
----------------

Ciascuna istanza è accessibile tramite **uno specifico URL**, deciso dall'amministratore di sistema al momento dell'installazione.

.. image:: instances_urls.png
   :width: 400


Istanze nell'interfaccia web
----------------------------

L'interfaccia web di Sophon permette di **selezionare l'istanza** che si desidera usare inserendo il corrispondente URL.

.. image:: instance_select.png


Personalizzazione dell'istanza
------------------------------

Nel pannello di amministrazione di un'istanza Sophon è possibile personalizzare alcuni dettagli dell'istanza, quali:

- il **nome** dell'istanza, che verrà visualizzato come titolo dell'interfaccia web;

  .. image:: instance_title.png

- la **descrizione** dell'istanza in `Markdown`_, visualizzata all'interno del riquadro "A proposito dell'istanza";

  .. image:: instance_description.png

- il **tema colori** dell'istanza, applicato all'interfaccia web una volta che l'istanza è stata selezionata.

  .. image:: instance_theme_sophon.png
     :width: 240
  .. image:: instance_theme_royalblue.png
     :width: 240
  .. image:: instance_theme_amber.png
     :width: 240
  .. image:: instance_theme_paper.png
     :width: 240
  .. image:: instance_theme_hacker.png
     :width: 240


.. _Markdown: https://it.wikipedia.org/wiki/Markdown


Utente
======

Un *utente* è una entità che interagisce con una specifica istanza Sophon: ad esempio, un utente potrebbe essere una persona fisica, oppure potrebbe essere un software di automazione che si interfaccia con Sophon.


Livelli di accesso
------------------

Un utente può avere uno dei seguenti livelli di accesso:

.. glossary::

   Superutente
      Utente con accesso completo a ogni singola risorsa sull'istanza Sophon, tipicamente riservato per l'amministratore di sistema; deve effettuare l'accesso all'istanza con le proprie credenziali.

   Utente
      Utente con permessi limitati alle risorse che ha creato o a cui è stato fornito accesso; deve effettuare l'accesso all'istanza con le proprie credenziali.

   Ospite
      Utente che può visualizzare alcuni contenuti dell'istanza Sophon ma non può interagirci.


Creazione di nuovi utenti
-------------------------

In una istanza Sophon, la registrazione autonoma non è possibile: ciò permetterebbe agli utenti creati di accedere a dati riservati al personale di ricerca.

Nuovi utenti possono essere creati esclusivamente da un :term:`superutente` nel pannello di amministrazione dell'istanza.

.. image:: user_creation.png


Utenti nell'interfaccia web
---------------------------

L'interfaccia web di Sophon permette di **selezionare la tipologia di utente** con la quale si intende utilizzare il servizio.

.. image:: user_select.png


Gruppo di ricerca
=================

Un *gruppo di ricerca* rappresenta un insieme di :term:`utenti` che collaborano su uno o più progetti.

.. image:: groups_diagram.png
   :width: 400


Membri dei gruppi
-----------------

Gli :term:`utenti` dell'istanza possono diventare *membri* dei gruppi di ricerca, con una delle seguenti modalità selezionate nelle impostazioni del gruppo:

- se il gruppo è *aperto*, allora qualsiasi utente può diventarne membro semplicemente **facendo richiesta** attraverso l'interfaccia web;

  .. image:: join_request.png

- se il gruppo è in *modalità manuale*, allora nessun utente potrà richiedere di unirsi, e i membri saranno **selezionati manualmente** dal creatore del gruppo.

  .. image:: join_manual.png

Nell'interfaccia web, i gruppi aperti sono marcati con l'icona di un **globo 🌐**, mentre i gruppi in modalità manuale sono marcati con l'icona di una **busta ✉️**.

.. image:: group_icons.png

In qualsiasi momento, i membri di un gruppo possono **lasciarlo** facendo richiesta attraverso l'interfaccia web.


Creazione di nuovi gruppi
-------------------------

Qualsiasi :term:`utente` può **creare** gruppi di ricerca dall'interfaccia web.

.. image:: group_creation.png


Modifica di gruppi
------------------

Il creatore di un gruppo di ricerca è l'unico :term:`utente` che può cambiarne **nome**, **descrizione**, **membri** e **modalità di accesso**.

Lo *slug*, l'identificatore univoco del gruppo, non è modificabile successivamente alla creazione, dato che è utilizzato all'interno degli URL.


Eliminazione di gruppi
----------------------

Il creatore di un gruppo è l'unico utente in grado di **cancellare** il gruppo che ha creato.

.. warning::

   L'eliminazione di un gruppo è un'operazione distruttiva non reversibile!

.. note::

   Se si è i creatori di un gruppo, e si vuole trasferire il gruppo ad un altro utente, sarà necessario fare richiesta ad un :term:`superutente` di cambiare il proprietario del gruppo all'interno del pannello di amministrazione.

.. seealso::

   :ref:`Conferma di eliminazione`


Progetto di ricerca
===================

Un *progetto di ricerca* rappresenta una **collezione di materiali** relativa a un singolo argomento mantenuta da un :ref:`gruppo di ricerca`.

.. image:: projects_diagram.png
   :width: 400


Creazione di nuovi progetti
---------------------------

Qualsiasi *membro* di un :ref:`gruppo di ricerca` può creare nuovi progetti.


Modifica di progetti
--------------------

Qualsiasi *membro* di un :ref:`gruppo di ricerca` può modificare **nome**, **descrizione** dei progetti al suo interno.

Solo il *creatore del gruppo* può modificarne la **visibilità**, o **trasferire il progetto ad un altro gruppo**.

Lo *slug*, l'identificatore univoco del progetto, non è modificabile successivamente alla creazione, dato che è utilizzato all'interno degli URL.


Eliminazione di progetti
------------------------

Il **creatore del gruppo** al quale appartiene il progetto è l'unico utente in grado di eliminarlo.

.. warning::

   L'eliminazione di un progetto è un'operazione distruttiva non reversibile!

.. seealso::

   :ref:`Conferma di eliminazione`


Visibilità dei progetti
-----------------------

I progetti hanno tre diverse impostazioni di visibilità che regolano chi può visualizzarne i contenuti:

.. glossary::

   Progetto privato
      Il progetto è visibile solo ai membri del gruppo a cui appartiene il progetto.

   Progetto interno
      Il progetto è visibile solo agli :term:`utenti` dell'istanza, e non agli :term:`ospiti`.

   Progetto pubblico
      Il progetto è visibile a tutti.

I progetti privati sono marcati con l'icona di un **luchetto chiuso 🔒**, i progetti interni con l'icona di un **università 🏦** e i progetti pubblici con l'icona di un **globo 🌐**.


Notebook
========

.. TODO: Do this.
