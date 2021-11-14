Dettagli dell'interfaccia web
*****************************

Sono elencate in questo capitolo alcuni dettagli interessanti relativi all'intera interfaccia web.


Markdown nelle descrizioni
==========================

Le descrizioni dell':ref:`istanza`, del :ref:`gruppo di ricerca` selezionato e del :ref:`progetto di ricerca` selezionato sono interpretate dall'interfaccia web come `Markdown`_, un semplice e comune linguaggio di marcatura del testo con varie funzionalità che possono essere utili per descrivere l'entità in questione o lasciare messaggi agli altri collaboratori.

Si fornisce un breve riassunto della sintassi di `Markdown`_.

.. code-block:: markdown

   <!-- Commento, non viene visualizzato -->

   <!-- Titoli -->
   # Parte
   ## Capitolo
   ### Sezione
   #### Sottosezione
   ##### Sottosottosezione
   ###### Paragrafo

   <!-- Formattazione -->
   **grassetto**
   *corsivo*
   __sottolineato__
   `codice`

   <!-- Collegamenti -->
   [testo](url)

   <!-- Immagini -->
   ![alt](url)

   <!-- Tabelle -->
   | Riga 1 | Riga 2 | Riga 3 |
   |--------|--------|--------|
   | Cella  | Cella  | Cella  |
   | Cella  | Cella  | Cella  |

   <!-- Codice -->
   ```linguaggio
   def funzione():
      pass
   ```

.. _Markdown: https://daringfireball.net/projects/markdown/syntax


Elenco dei membri
=================

Quando viene selezionato un :ref:`gruppo di ricerca`, viene visualizzato l'elenco dei suoi membri.

Il creatore del :ref:`gruppo di ricerca` è evidenziato in blu, mentre l':ref:`utente` attuale è sottolineato.

.. image:: members_list.png


Conferma di eliminazione
========================

Per impedire eliminazioni accidentali di risorse, è presente un meccanismo di conferma che richiede all'utente di ripremere il tasto di eliminazione trascorsi 3 secondi dalla prima richiesta.

.. image:: confirm.png

.. raw:: html

   <p><video width="460" height="232" controls src="../../_static/group_delete_confirm.mp4"></video></p>
