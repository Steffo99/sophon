Progetto di ricerca
===================

Un *progetto di ricerca* rappresenta una **collezione di oggetti** relativa a un singolo argomento mantenuta da un :ref:`gruppo di ricerca`.

.. image:: diagram.png
   :width: 400


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

I progetti privati sono marcati con l'icona di un **lucchetto chiuso 🔒**, i progetti interni con l'icona di un **università 🏦** e i progetti pubblici con l'icona di un **globo 🌐**.

.. image:: icons.png


Creazione di nuovi progetti
---------------------------

Qualsiasi *membro* di un :ref:`gruppo di ricerca` può creare nuovi progetti.

.. image:: creation.png


Modifica di progetti
--------------------

Qualsiasi *membro* di un :ref:`gruppo di ricerca` può modificare **nome**, **descrizione** dei progetti al suo interno.

Solo il *creatore del gruppo* può modificarne la **visibilità**, o **trasferire il progetto ad un altro gruppo**.

Lo *slug*, l'identificatore univoco del progetto, non è modificabile successivamente alla creazione, in quanto è utilizzato all'interno degli URL, che devono essere immutabili.


Eliminazione di progetti
------------------------

Qualsiasi *membro* di un :ref:`gruppo di ricerca` può eliminare i progetti al suo interno.

.. warning::

   L'eliminazione di un progetto è un'operazione distruttiva non reversibile!

.. seealso::

   :ref:`Conferma di eliminazione`


Progetti nell'interfaccia web
-----------------------------

Dopo aver selezionato un :ref:`gruppo di ricerca`, l'interfaccia web mostra i progetti visibili all':term:`utente` attuale, e gli permette di selezionarne uno oppure di eliminarli.

.. image:: list.png