Pannello di amministrazione
===========================

Sophon include un pannello di amministrazione, accessibile premendo *Go to the admin page* sulla schermata di login, oppure visitando l'URL ``api.DOMINIO/admin``.

.. image:: admin_where.png


Effettuare l'accesso
--------------------

Per utilizzare il pannello di amministrazione è necessario inserire le credenziali di un :ref:`superutente`.

.. image:: admin_login.png


La schermata principale
-----------------------

Nella schermata principale del pannello di amministrazione è visibile l'elenco di tutti i tipi di entità gestite da Django, assieme ad uno storico delle ultime operazioni effettuate dal pannello su di esse.

.. image:: admin_home.png

È possibile cliccare sul collegamento *Add* di fianco ad un tipo di entità per **crearne** una nuova di quel tipo, oppure il collegamento *Change* per **visualizzare**, **modificare** ed **eliminare** tutte le entità già esistenti di quel tipo.


La barra del titolo
-------------------

Tutte le pagine includono in cima la **barra del titolo**, che permette al :ref:`superutente` attualmente collegato di **cambiare la propria password** o effettuare la **disconnessione** dal pannello.

.. image:: topright.png
