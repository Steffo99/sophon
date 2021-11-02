Gruppo di ricerca
=================

Un *gruppo di ricerca* rappresenta un insieme di utenti che collaborano su uno o più progetti.

.. image:: diagram.png
   :width: 400


Membri e modalità di accesso
----------------------------

Gli utenti dell':ref:`istanza` possono diventare *membri* dei gruppi di ricerca, con una delle seguenti modalità selezionate nelle impostazioni del gruppo:

- se il gruppo è *aperto*, allora qualsiasi utente può diventarne membro semplicemente **facendo richiesta** attraverso l'interfaccia web;

  .. image:: join_open.png

- se il gruppo è in *modalità manuale*, allora nessun utente potrà richiedere di unirsi, e i membri saranno **selezionati manualmente** dal creatore del gruppo.

  .. image:: join_manual.png

Nell'interfaccia web, i gruppi aperti sono marcati con l'icona di un **globo 🌐**, mentre i gruppi in modalità manuale sono marcati con l'icona di una **busta ✉️**.

.. image:: icons.png

In qualsiasi momento, i membri di un gruppo possono **lasciarlo** facendo richiesta attraverso l'interfaccia web.


Creazione di nuovi gruppi
-------------------------

Qualsiasi :ref:`utente` può **creare** gruppi di ricerca dall'interfaccia web.

.. image:: creation.png


Modifica di gruppi
------------------

Il creatore di un gruppo di ricerca è l'unico :ref:`utente` che può cambiarne **nome**, **descrizione**, **membri** e **modalità di accesso**.

Lo *slug*, l'identificatore univoco del gruppo, non è modificabile successivamente alla creazione, in quanto è utilizzato all'interno degli URL, che devono essere immutabili.


Eliminazione di gruppi
----------------------

Il creatore di un gruppo è l'unico utente in grado di **cancellare** il gruppo che ha creato.

.. warning::

   L'eliminazione di un gruppo è un'operazione distruttiva non reversibile!

.. hint::

   Se si è i creatori di un gruppo, e si vuole trasferire il gruppo ad un altro utente, sarà necessario fare richiesta ad un :ref:`superutente` di cambiare il proprietario del gruppo all'interno del pannello di amministrazione.

.. seealso::

   :ref:`Conferma di eliminazione`


Gruppi nell'interfaccia web
---------------------------

Dopo aver effettuato l'accesso come :ref:`utente` o :ref:`ospite`, l'interfaccia utente di Sophon visualizza l'elenco di gruppi di ricerca disponibili nell':ref:`instanza`, permettendo agli utenti di unirsi ad essi, lasciarli, oppure eliminarli.

.. image:: list.png
