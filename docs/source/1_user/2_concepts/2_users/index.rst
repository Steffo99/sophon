Utente
======

Un *utente* è una entità che interagisce con una specifica istanza Sophon: ad esempio, un utente potrebbe essere una persona fisica, oppure potrebbe essere un software di automazione che si interfaccia con Sophon.

.. image:: diagram.png
   :width: 400


Livelli di accesso
------------------

Un utente può avere uno dei seguenti *livelli di accesso*:


Superutente
^^^^^^^^^^^

Utente con accesso completo a ogni singola risorsa sull'istanza Sophon, tipicamente riservato per l'amministratore di sistema.


Utente
^^^^^^

Utente con permessi limitati alle risorse che ha creato o a cui è stato fornito accesso.


Ospite
^^^^^^

Utente che può visualizzare alcuni contenuti dell'istanza Sophon ma non può interagirci.


Credenziali di accesso
----------------------

Gli utenti di tipo :ref:`Utente` e :ref:`Superutente` devono identificarsi sull'istanza con le loro credenziali.

Di default, le credenziali sono un **nome utente** e una **password**, ma è possibile che l'amministratore di sistema implementi un sistema diverso, ad esempio un sistema `Single Sign-On`_.


.. _Single Sign-On: https://it.wikipedia.org/wiki/Single_sign-on


Creazione di nuovi utenti
-------------------------

In un':ref:`istanza` Sophon, la registrazione autonoma **non è permessa**: nuovi utenti possono essere creati esclusivamente da un :ref:`superutente` all'interno del pannello di amministrazione.

.. image:: creation.png


Utenti nell'interfaccia web
---------------------------

Dopo aver selezionato un':ref:`istanza`, l'interfaccia web di Sophon permette di **effettuare l'accesso** come la tipologia di utente con la quale si intende utilizzare il servizio.

.. image:: login.png
