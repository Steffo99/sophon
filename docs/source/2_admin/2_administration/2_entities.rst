Tipi di risorse
===============

Tokens
------

Contiene l'elenco di tutti i token di sessione usati per l'autenticazione tra l'API e l'interfaccia web di Sophon.

È possibile modificarli per **cambiare l'utente connesso** ad una certa sessione, oppure eliminarli per **forzare la disconnessione** di determinate sessioni.

.. note::

   In seguito ad una disconnessione forzata, l'utente riscontrerà errori "non autorizzato" sull'interfaccia web fino ad un aggiornamento della pagina o logout manuale.

.. image:: token_list.png
   :scale: 50%

.. image:: token_detail.png
   :scale: 50%


Users
-----

Contiene l'elenco di tutti gli utenti registrati su Sophon.

In questa pagina è possibile la :ref:`creazione di nuovi utenti`, così come il **cambio di password**, l'**assegnazione di privilegi** di :ref:`superutente` e la **disattivazione degli utenti**.

.. note::

   I superutenti devono avere sia *staff status* sia *superuser status* attivi per poter utilizzare il pannello di amministrazione.

.. image:: user_list.png
   :scale: 50%

.. image:: user_detail.png
   :scale: 50%


Research groups
---------------

Contiene l'elenco di tutti i gruppi di ricerca creati su Sophon.

Dal pannello di amministrazione è possibile effettuare modifiche ed eliminazioni **ignorando i permessi normalmente richiesti** per farlo e **trasferire la proprietà** di un gruppo da un utente all'altro.

.. image:: researchgroup_list.png
   :scale: 50%

.. image:: researchgroup_detail.png
   :scale: 50%


Sophon instance details
-----------------------

Contiene un'entità speciale che controlla l'**aspetto** dell':ref:`istanza`.

Modificandola, è possibile personalizzare:

- il **nome** dell':ref:`istanza`, che verrà visualizzato come titolo dell'interfaccia web;

  .. image:: custom_title.png

- la **descrizione** dell':ref:`istanza`, visualizzata all'interno del riquadro "A proposito dell'istanza";

  .. image:: custom_description.png

- il **tema colori** dell':ref:`istanza`, applicato all'interfaccia web una volta che un':ref:`istanza` è stata selezionata.

  .. image:: theme_sophon.png
     :width: 240
  .. image:: theme_royalblue.png
     :width: 240
  .. image:: theme_amber.png
     :width: 240
  .. image:: theme_paper.png
     :width: 240
  .. image:: theme_hacker.png
     :width: 240


Notebooks
---------

Contiene l'elenco di tutti i :ref:`notebook` creati su Sophon.

Oltre ad alterare le entità **ignorando i permessi**, è possibile vedere alcuni parametri tecnici, come l'ID del container Docker a cui è associato il notebook, oppure la porta o l'URL a cui è accessibile il notebook dal proxy.

.. warning::

   Modificare *slug*, *container ID*, *local port number* o *internal URL* mentre il :ref:`notebook` è avviato renderà potenzialmente la connessione e l'arresto del notebook!

.. image:: notebook_list.png
   :scale: 50%

.. image:: notebook_detail.png
   :scale: 50%


Research projects
-----------------

Contiene l'elenco di tutti i progetti di ricerca creati su Sophon.

Oltre ad alterare le entità **ignorando i permessi**, è possibile **trasferire un progetto** da un gruppo a un altro.

.. image:: researchproject_list.png
   :scale: 50%

.. image:: researchproject_detail.png
   :scale: 50%
