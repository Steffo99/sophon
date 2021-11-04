Modulo backend
==============
.. default-domain:: py
.. default-role:: obj
.. py:currentmodule:: sophon

Il *modulo backend* consiste in un server web che espone un'API e un sito web per l'amministrazione.

È collocato all'interno del repository in ``/backend``.

È formato dal package Python `sophon`, che contiene al suo interno un progetto Django, che a sua volta contiene le tre app Django `sophon.core`, `sophon.projects` e `sophon.notebooks`.

.. toctree::
   :maxdepth: 1

   1_techstack
   2_sophon
   3_core
   4_projects
   5_notebooks