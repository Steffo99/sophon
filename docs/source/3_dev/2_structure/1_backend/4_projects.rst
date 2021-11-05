L'app sophon.projects
-----------------------
.. default-domain:: py
.. default-role:: obj
.. module:: sophon.projects

L'app `sophon.projects` è un app secondaria che dipende da `sophon.core` che introduce in Sophon il concetto di :ref:`progetto di ricerca`.

.. caution::

   Anche se l'app `sophon.projects` è opzionale (il progetto può funzionare senza di essa), si sconsiglia di disattivarla, in quanto il :ref:`modulo frontend` si aspetta che l'app sia attiva e solleverà un errore nel caso il viewset fornito da questa app non sia disponibile.


Modello del progetto di ricerca
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.projects.models

Viene introdotto un modello concreto che rappresenta un :ref:`progetto di ricerca`.

.. class:: ResearchProject(SophonGroupModel)

   .. attribute:: slug: SlugField
   .. attribute:: group: ForeignKey → sophon.core.models.ResearchGroup
   .. attribute:: name: CharField
   .. attribute:: description: TextField
   .. attribute:: visibility: CharField ["PUBLIC", "INTERNAL", "PRIVATE"]


Viewset del gruppo di ricerca
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.projects.views

Da una base comune, vengono creati due viewset per interagire con i progetti di ricerca.

.. class:: ResearchProjectViewSet(SophonGroupViewSet, metaclass=abc.ABCMeta)

   Classe **astratta** che effettua l'override di `~sophon.core.views.SophonGroupView.get_group_from_serializer` per entrambi i viewset che seguono.

.. class:: ResearchProjectsBySlugViewSet(ResearchProjectViewSet)

   Viewset in lettura e scrittura che permette di interagire con tutti i progetti di ricerca a cui l'utente loggato ha accesso.

   Accessibile all'URL :samp:`/api/projects/by-slug/{PROJECT_SLUG}/`.

.. class:: ResearchProjectsByGroupViewSet(ResearchProjectViewSet)

   Viewset in lettura e scrittura che permette di interagire con i progetti di ricerca a cui l'utente loggato ha accesso, filtrati per il gruppo a cui appartengono.

   Il filtraggio viene effettuato limitando il queryset.

   Accessibile all'URL :samp:`/api/projects/by-group/{GROUP_SLUG}/{PROJECT_SLUG}/`.


Amministrazione del gruppo di ricerca
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. module:: sophon.projects.admin

Il modello `.models.ResearchProject` viene registrato nella pagina di amministrazione attraverso la seguente classe:

.. class:: ResearchProjectAdmin(sophon.core.admin.SophonAdmin)

   Classe per la pagina di amministrazione che specifica un ordinamento, permette il filtraggio per gruppo di appartenenza e visibilità, e specifica i campi da visualizzare nell'elenco dei progetti.
