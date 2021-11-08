Contesti innestati
------------------
.. default-domain:: js

Per minimizzare i rerender, l'applicazione è organizzata a "contesti innestati".


I contesti
^^^^^^^^^^

Viene definito un contesto per ogni tipo di risorsa selezionabile nell'interfaccia.

Essi sono, in ordine dal più esterno al più interno:

#. :data:`InstanceContext` (:ref:`Istanza`)
#. :data:`AuthorizationContext` (:ref:`Utente`)
#. :data:`GroupContext` (:ref:`Gruppo di ricerca`)
#. :data:`ProjectContext` (:ref:`Progetto di ricerca`)
#. :data:`NotebookContext` (:ref:`Notebook`)


Contenuto dei contesti
""""""""""""""""""""""

Questi contesti possono avere tre tipi di valori: :data:`undefined` se ci si trova al di fuori del contesto, :data:`null` se non è stato selezionato alcun oggetto oppure **l'oggetto selezionato** se esso esiste.


URL contestuale
^^^^^^^^^^^^^^^

Si è definita la seguente struttura per gli URL del frontend di Sophon, in modo che essi identificassero universalmente una risorsa e che essi fossero human-readable.

.. code-block:: text

   /i/{ISTANZA}
      /l/logged-in
         /g/{GROUP_SLUG}
            /p/{PROJECT_SLUG}
               /n/{NOTEBOOK_SLUG}/

Ad esempio, l'URL per il notebook ``my-first-notebook`` dell'istanza demo di Sophon sarebbe:

.. code-block:: text

   /i/https:api.prod.sophon.steffo.eu:
      /l/logged-in
         /g/my-first-group
            /p/my-first-project
               /n/my-first-notebook/


Parsing degli URL contestuali
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Viene definita una funzione in grado di comprendere gli URL contestuali:

.. function:: parsePath(path)

   :param path: Il "path" da leggere.
   :returns:
      Un oggetto con le seguenti chiavi, dette "segmenti di percorso", le quali possono essere :data:`undefined` per indicare che non è stato selezionato un oggetto di quel tipo:

      - ``instance``: l'URL dell'istanza da utilizzare, con caratteri speciali sostituiti da ``:``
      - ``loggedIn``: :class:`Boolean`, se :data:`True` l'utente ha effettuato il login (come :ref:`Ospite` o :ref:`Utente`)
      - ``researchGroup``: lo slug del :ref:`gruppo di ricerca` selezionato
      - ``researchProject``: lo slug del :ref:`progetto di ricerca` selezionato
      - ``notebook``: lo slug del :ref:`notebook` selezionato

      Ad esempio, l'URL precedente restituirebbe il seguente oggetto se processato:

      .. code-block:: js

         {
            "instance": "https:api.prod.sophon.steffo.eu:",
            "loggedIn": True,
            "researchGroup": "my-first-group",
            "researchProject": "my-first-project",
            "notebook": "my-first-notebook"
         }


Routing basato sui contesti
^^^^^^^^^^^^^^^^^^^^^^^^^^^

I valori dei contesti vengono utilizzati per selezionare i componenti da mostrare all'utente nell'interfaccia grafica attraverso i seguenti componenti:

.. function:: ResourceRouter({selection, unselectedRoute, selectedRoute})

   Componente che sceglie se renderizzare ``unselectedRoute`` o ``selectedRoute`` in base alla *nullità* o *non-nullità* di ``selection``.

.. function:: ViewSetRouter({viewSet, unselectedRoute, selectedRoute, pathSegment, pkKey})

   Componente basato su :func:`ResourceRouter` che seleziona automaticamente l'elemento del viewset avente il valore del segmento di percorso ``pathSegment`` alla chiave ``pkKey``.


Esempio di utilizzo di ViewSetRouter
""""""""""""""""""""""""""""""""""""

.. function:: GroupRouter({...props})

   Implementato come:

   .. code-block:: tsx

        <ViewSetRouter
            {...props}
            viewSet={useManagedViewSet<SophonResearchGroup>("/api/core/groups/", "slug")}
            pathSegment={"researchGroup"}
            pkKey={"slug"}
        />


Albero completo dei contesti
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

L'insieme di tutti i contesti è definito come componente :func:`App` nel modulo "principale" ``App.tsx``.

Se ne riassume la struttura in pseudocodice:

.. code-block:: html

   <InstanceContext>
      <InstanceRouter>
         unselected:
            <InstanceSelect>
         selected:
            <AuthorizationContext>
               <AuthorizationRouter>
                  unselected:
                     <UserLogin>
                  selected:
                     <GroupContext>
                        <GroupRouter>
                           unselected:
                              <GroupSelect>
                           selected:
                              <ProjectContext>
                                 <ProjectRouter>
                                    unselected:
                                       <ProjectSelect>
                                    selected:
                                       <NotebookContext>
                                          <NotebookRouter>
                                             unselected:
                                                <NotebookSelect>
                                             selected:
                                                <NotebookDetails>


Altri contesti
^^^^^^^^^^^^^^

Tema
""""

Il tema dell'istanza è implementato come uno speciale contesto globale :data:`ThemeContext` che riceve i dettagli dell'istanza a cui si è collegati dall':data:`InstanceContext`.


Cache
"""""

Viene salvato l'elenco di tutti i membri dell':ref:`istanza` in uno speciale contesto :data:`CacheContext` in modo da poter risolvere gli id degli utenti al loro username senza dover effettuare ulteriori richieste.
