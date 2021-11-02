Perchè installare Sophon?
*************************

Differenze con altri progetti simili
====================================

Sophon a prima vista può sembrare simile ad altri progetti già esistenti, ma si differenzia in alcune particolarità del suo funzionamento.


Differenze con JupyterHub
-------------------------

`JupyterHub`_ è un progetto con scopi molto simili a quelli di Sophon, ovvero di permettere a tanti utenti di utilizzare `Jupyter`_ su un server remoto, ma ha funzionalità di autorizzazione molto semplici e non ha supporto per :ref:`collaborazione` in tempo reale, in quanto i server `Jupyter`_ che istanzia sono single-user.

È però più facile da scalare per grandi numeri di utenti, e ha più opzioni di deployment, a differenza di Sophon, che ne supporta una sola.

.. _JupyterHub: https://jupyter.org/hub
.. _Jupyter: https://jupyter.org/


Differenze con Google Colab
---------------------------

`Google Colab`_ è un progetto che permette di effettuare ricerca su server `Jupyter`_ utilizzando le risorse della `Google Cloud Platform`_.

A differenza di Sophon, è disponibile esclusivamente come `software-as-a-service`_, il che costringe agli utenti a trasmettere le loro informazioni ai server di Google, e non ha alcun tipo di supporto alla :ref:`collaborazione` in tempo reale.

.. _Google Colab: https://colab.research.google.com/#
.. _Google Cloud Platform: https://cloud.google.com/
.. _software-as-a-service: https://it.wikipedia.org/wiki/Software_as_a_service


Licenza FLOSS
=============

Sophon è rilasciato sotto la `GNU Affero General Public License 3`_ (o successiva).

Generalmente, significa che è possibile utilizzare il programma e modificarne il codice sorgente **liberamente**, a condizione che le modifiche effettuate vengano ritrasmesse a gli :ref:`utenti` della versione modificata nello stesso modo.

Il testo completo della licenza è disponibile all'interno del file `LICENSE.txt`_ allegato al codice sorgente del software.


.. _GNU Affero General Public License 3: https://www.gnu.org/licenses/agpl-3.0.html
.. _LICENSE.txt: https://github.com/Steffo99/sophon/blob/main/LICENSE.txt
