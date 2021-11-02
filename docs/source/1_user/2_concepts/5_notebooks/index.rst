Notebook
========

Un *notebook* è un **tipo di materiale** che può essere allegato ad un :ref:`progetto di ricerca` (attualmente, l'unico implementato).

Rappresenta una **postazione di lavoro** sul server dell':ref:`istanza` Sophon, utilizzabile da un :term:`utente` o più.

.. image:: diagram.png
   :width: 400


Isolamento dei notebook
-----------------------

I notebook risiedono tutti sullo **stesso elaboratore fisico** che esegue l':ref:`istanza` Sophon, pertanto ne condividono le risorse, come processore, scheda video e memoria.

Sono però **logicamente isolati**: i file contenuti in un notebook non sono accessibili agli altri, e i notebook non hanno modo di comunicare direttamente tra loro.

.. image:: diagram_network.png
   :width: 400


Creazione di nuovi notebook
---------------------------

Qualsiasi **membro** di un :ref:`gruppo di ricerca` può creare nuovi notebook all'interno di uno dei progetti del gruppo a cui appartiene.

.. image:: creation.png


Stato del notebook
------------------

Un notebook può essere *avviato* o *fermo* in base al suo stato di esecuzione sull':ref:`istanza` Sophon:

- è *avviato* se sta venendo eseguito ed è accessibile;

  .. image:: status_stopped.png
     :height: 40

- è *fermo* se non sta venendo eseguito o sta venendo preparato.

  .. image:: status_running.png
     :height: 40

Alla creazione, un notebook è *fermo*.


Avviare un notebook
^^^^^^^^^^^^^^^^^^^

Un **membro** del :ref:`gruppo di ricerca` a cui appartiene il notebook può richiedere al server l'avvio di quest'ultimo, in modo da poterlo utilizzare successivamente.

.. image:: action_start.png


Fermare un notebook
^^^^^^^^^^^^^^^^^^^

Un **membro** del :ref:`gruppo di ricerca` a cui appartiene il notebook può richiedere al server l'arresto di quest'ultimo, salvando i dati e interrompendo la sessione di lavoro attualmente in corso.

.. image:: action_stop.png

.. warning::

   Se un notebook viene fermato durante un upload o download di file, essi risulteranno corrotti e saranno da ritrasferire.


Immagine del notebook
---------------------

In **fase di creazione** di un notebook, oppure mentre esso è **fermo**, è possibile selezionare un'*immagine*, ovvero il programma che sarà eseguito dal notebook all'avvio.

Attualmente, l'unica immagine configurata è **Jupyter (Sophon)**, che esegue un server `Jupyter`_ con un'interfaccia `JupyterLab`_.


.. _Jupyter: https://jupyter.org/
.. _JupyterLab: https://jupyterlab.readthedocs.io/en/stable/


Collegarsi a un notebook
------------------------

I **membri** del :ref:`gruppo di ricerca` a cui appartiene il notebook possono connettersi ad un notebook **avviato** attraverso un URL segreto comunicatogli  dall':ref:`istanza`.

.. image:: connection.png


Collaborazione
^^^^^^^^^^^^^^

È possibile il collegamento **simultaneo** di più membri al notebook: l'immagine selezionata permetterà loro di collaborare in tempo reale sugli stessi file.

.. image:: collaboration.png


Blocco di un notebook
---------------------

Qualsiasi **membro** del :ref:`gruppo di ricerca` a cui appartiene il notebook può *bloccarlo* per segnalare agli altri utenti che vi hanno accesso di non utilizzare quello specifico notebook.

.. image:: action_lock.png

Bloccare un notebook **rimuove dall'interfaccia web** i bottoni per l'avvio, l'arresto, l'eliminazione al notebook bloccato, e, per tutti tranne l':ref:`utente` che ha effettuato la richiesta, anche il bottone per la connessione.

.. image:: locked.png

.. warning::
   Il blocco di un notebook è solo estetico, e non impedisce agli utenti di effettuare queste operazioni tramite strumenti esterni, come la Console per sviluppatori del browser web.

Un notebook bloccato potrà essere sbloccato da qualsiasi **membro** del :ref:`gruppo di ricerca`; il membro che ha richiesto il blocco potrà sbloccarlo **immediatamente**, mentre agli altri membri sarà richiesto di confermare l'azione come se stesse venendo effettuata un'eliminazione.

.. seealso::
   :ref:`Conferma di eliminazione`


Modifica di un notebook
-----------------------

Qualsiasi *membro* di un :ref:`gruppo di ricerca` può modificare **nome** e **immagine** dei notebook *fermi* al suo interno.

I notebook *avviati* non possono essere modificati.

Lo *slug*, l'identificatore univoco del notebook, non è modificabile successivamente alla creazione, in quanto è utilizzato all'interno degli URL, che devono essere immutabili.


Eliminazione di un notebook
---------------------------

Qualsiasi *membro* di un :ref:`gruppo di ricerca` può eliminare i notebook all'interno dei progetti del gruppo.


Notebook nell'interfaccia web
-----------------------------

Dopo aver selezionato un :ref:`progetto di ricerca`, l'interfaccia web mostra l'elenco dei notebook che gli appartengono, assieme alle azioni che è possibile effettuare su di essi.

.. image:: list.png

È possibile selezionare un notebook per visualizzarne i dettagli o connettercisi.

.. image:: detail.png
