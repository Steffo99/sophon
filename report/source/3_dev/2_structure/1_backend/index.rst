Modulo backend
==============
.. default-domain:: py
.. default-role:: obj
.. py:currentmodule:: sophon

Il *modulo backend* consiste in un server web che espone un'API e un sito web per l'amministrazione.

È collocato all'interno del repository in ``/backend``.

È formato dal package Python `sophon`, che contiene al suo interno un progetto Django, che a sua volta contiene le tre app Django `sophon.core`, `sophon.projects` e `sophon.notebooks`.

.. note::

   A causa della dipendenza di Django da variabili globali, è stato impossibile utilizzare lo strumento di documentazione automatica `sphinx.ext.autodoc`.

   Pertanto, si è deciso di documentare soltanto le classi e metodi più rilevanti ai fini di questa documentazione.

.. toctree::
   :maxdepth: 1

   1_techstack
   2_sophon
   3_core
   4_projects
   5_notebooks
   6_ci
   7_cd
