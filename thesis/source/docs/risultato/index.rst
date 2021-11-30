:github_url: https://github.com/Steffo99/sophon/blob/main/thesis/source/7_utilizzo/index.rst

.. index::
   pair: Sophon; utilizzare

******************
Risultati ottenuti
******************

Al termine del periodo di sviluppo, il software ha soddisfatto `tutti i requisiti prefissati <Requisiti del progetto>`.

In particolare:

*  tutte le funzionalità desiderate sono state sviluppate, raggiungendo la feature parity con JupyterHub;

   *  il software ha ampio spazio per eventuali `estensioni <Estendibilità>` grazie alle numerosi classi astratte sviluppate;

   *  l'isolamento tra notebook e l'autenticazione all'accesso è stata realizzata, garantendo la `sicurezza <Sicurezza>` dei dati;

   *  l'interfaccia web è sufficientemente `intuitiva <Intuitività>` per permetterne un utilizzo e apprendimento autonomo;

   *  è possibile `personalizzare <Personalizzabilità>` i dettagli del software con il brand della propria istituzione;

   *  più utenti possono `collaborare <Possibilità di collaborazione>` simultaneamente all'interno dello stesso notebook;

   *  il software è stato pubblicato su `GitHub` come progetto `open source <Open source>`;

   *  da dispositivi mobili, l'interfaccia grafica di Sophon risulta interamente utilizzabile, raggiungendo il requisito di `responsività <Responsività>`, anche se la modifica di notebook computazionali con JupyterLab potrebbe risultare difficile su schermi con risoluzione molto ridotta;

   *  l'interfaccia web soddisfa i requisiti di `accessibilità <Accessibilità>` fissati;

*  il software è sufficientemente stabile per l'utilizzo in produzione, permettendone il suo utilizzo all'interno dell'Università;

*  le `istruzioni per l'installazione <Installazione di Sophon>` sono state scritte, permettendo ad altri interessati di installare Sophon.


Stato finale del modulo backend
===============================

Il modulo backend terminato espone una web API all'indirizzo :samp:`api.{BASE_DOMAIN}` con i seguenti endpoints.


.. http:post:: /api/auth/token/
   :synopsis: Richiesta token autenticazione

   Effettua l'accesso in cambio di un token di autenticazione.

   :json string username: Username dell'utente.
   :json string password: Password dell'utente.
   :status 200: Login riuscito.


.. http:post:: /api/auth/session/
   :synopsis: Richiesta cookies autenticazione

   Effettua l'accesso, salvando i dati di autenticazione nei cookie.

   :json string username: Username dell'utente.
   :json string password: Password dell'utente.
   :status 200: Login riuscito.


.. http:any:: /api/core/groups/
   :synopsis: Gruppi di ricerca

   Accede ai `gruppi di ricerca <Gruppi di ricerca in Sophon>`, permettendone la visualizzazione (``GET``), la creazione (``POST``), la modifica (``PUT``) e l'eliminazione (``DELETE``), a condizione che si sia autorizzati ad effettuare l'operazione.

   :json string slug: Slug del gruppo di ricerca.
   :json string name: Nome del gruppo di ricerca.
   :json string description: Descrizione del gruppo di ricerca.
   :json string access: `Modalità di accesso <Membri e modalità di accesso>` al gruppo.
   :json integer owner: ID del creatore del gruppo.
   :json integer[] members: Elenco dei membri degli ID dei membri del gruppo.

   :status 200: Operazione effettuata.
   :status 201: Risorsa creata.
   :status 204: Risorsa eliminata.
   :status 401: Accesso non effettuato.
   :status 403: Operazione non permessa.
   :status 404: Risorsa non esistente.


.. http:get:: /api/core/users/by-id/
   :synopsis: Utenti in ordine di ID

   Accede agli `utenti <Utenti>` dell'istanza Sophon usando il loro ID come chiave, permettendone la visualizzazione.

   :json integer id: ID dell'utente.
   :json string username: Username dell'utente.
   :json string first_name: Nome dell'utente (non utilizzato se non specificato manualmente nell'interfaccia di amministrazione).
   :json string last_name: Cognome dell'utente (non utilizzato se non specificato manualmente nell'interfaccia di amministrazione).
   :json string email: Email dell'utente (non utilizzata se non specificata manualmente nell'interfaccia di amministrazione).

   :status 200: Operazione effettuata.


.. http:get:: /api/core/users/by-username/
   :synopsis: Utenti in ordine di username

   Accede agli `utenti <Utenti>` dell'istanza Sophon usando il loro username come chiave, permettendone la visualizzazione.

   :json string id: ID dell'utente.
   :json string username: Username dell'utente.
   :json string first_name: Nome dell'utente (non utilizzato se non specificato manualmente nell'interfaccia di amministrazione).
   :json string last_name: Cognome dell'utente (non utilizzato se non specificato manualmente nell'interfaccia di amministrazione).
   :json string email: Email dell'utente (non utilizzata se non specificata manualmente nell'interfaccia di amministrazione).

   :status 200: Operazione effettuata.


.. http:any:: /api/projects/by-slug/
   :synopsis: Tutti i progetti

   Accede a tutti i `progetti di ricerca <Progetti di ricerca in Sophon>` dell'istanza Sophon, permettendone la visualizzazione (``GET``), la creazione (``POST``), la modifica (``PUT``) e l'eliminazione (``DELETE``), a condizione che si sia autorizzati ad effettuare l'operazione.

   :json string slug: Slug del progetto.
   :json string name: Nome del progetto.
   :json string description: Descrizione del progetto.
   :json string visibility: `Visibilità <Visibilità dei progetti>` del progetto.
   :json string group: Slug del gruppo a cui appartiene il progetto.

   :status 200: Operazione effettuata.
   :status 201: Risorsa creata.
   :status 204: Risorsa eliminata.
   :status 401: Accesso non effettuato.
   :status 403: Operazione non permessa.
   :status 404: Risorsa non esistente.


.. http:any:: /api/projects/by-group/(str:group_slug)/
   :synopsis: Progetti di un determinato gruppo

   Accede ai `progetti di ricerca <Progetti di ricerca in Sophon>` appartenenti a un certo gruppo, permettendone la visualizzazione (``GET``), la creazione (``POST``), la modifica (``PUT``) e l'eliminazione (``DELETE``), a condizione che si sia autorizzati ad effettuare l'operazione.

   :param group_slug: Slug del gruppo di cui si vogliono ottenere i progetti.

   :json string slug: Slug del progetto.
   :json string name: Nome del progetto.
   :json string description: Descrizione del progetto.
   :json string visibility: `Visibilità <Visibilità dei progetti>` del progetto.
   :json string group: Slug del gruppo a cui appartiene il progetto.

   :status 200: Operazione effettuata.
   :status 201: Risorsa creata.
   :status 204: Risorsa eliminata.
   :status 401: Accesso non effettuato.
   :status 403: Operazione non permessa.
   :status 404: Risorsa non esistente.


.. http:any:: /api/notebooks/by-slug/
   :synopsis: Tutti i notebook

   Accede a tutti i `notebook <Notebook in Sophon>` dell'istanza Sophon, permettendone la visualizzazione (``GET``), la creazione (``POST``), la modifica (``PUT``) e l'eliminazione (``DELETE``), a condizione che si sia autorizzati ad effettuare l'operazione.

   .. note::

      Questo endpoint non restituisce i dettagli di connessione al notebook; a tale scopo, è necessario utilizzare :http:any:`/api/notebooks/by-project/(str:project_slug)/`.

   :json string slug: Slug del notebook.
   :json string name: Nome del notebook.
   :json boolean is_running: Se il notebook è `avviato <Stato del notebook>` oppure no.
   :json integer locked_by: ID dell'utente che ha `bloccato <Blocco di un notebook>` il notebook.
   :json string container_image: Il nome dell'`immagine <Immagine del notebook>` del notebook.
   :json string project: Slug del progetto a cui appartiene il notebook.

   :status 200: Operazione effettuata.
   :status 201: Risorsa creata.
   :status 204: Risorsa eliminata.
   :status 401: Accesso non effettuato.
   :status 403: Operazione non permessa.
   :status 404: Risorsa non esistente.


.. http:any:: /api/notebooks/by-project/(str:project_slug)/
   :synopsis: Notebook di un determinato progetto

   Accede ai `notebook <Notebook in Sophon>` appartenenti a un certo progetto, permettendone la visualizzazione (``GET``), la creazione (``POST``), la modifica (``PUT``) e l'eliminazione (``DELETE``), a condizione che si sia autorizzati ad effettuare l'operazione.

   :json string slug: Slug del notebook.
   :json string name: Nome del notebook.
   :json boolean is_running: Se il notebook è `avviato <Stato del notebook>` oppure no.
   :json integer locked_by: ID dell'utente che ha `bloccato <Blocco di un notebook>` il notebook.
   :json string container_image: Il nome dell'`immagine <Immagine del notebook>` del notebook.
   :json string project: Slug del progetto a cui appartiene il notebook.
   :json string jupyter_token: Token per l'autenticazione sul `modulo Jupyter <Modulo Jupyter>`.
   :json string legacy_notebook_url: URL per la connessione all'interfaccia legacy "*Jupyter Notebook*" del notebook.
   :json string lab_url: URL per la connessione all'interfaccia `JupyterLab` del notebook.

   :status 200: Operazione effettuata.
   :status 201: Risorsa creata.
   :status 204: Risorsa eliminata.
   :status 401: Accesso non effettuato.
   :status 403: Operazione non permessa.
   :status 404: Risorsa non esistente.


In aggiunta, espone la pagina di amministrazione al seguente indirizzo.


.. http:get:: /admin/
   :synopsis: Pagina di amministrazione

   La pagina di amministrazione Django, personalizzata per Sophon.

   :status 200: Accesso riuscito.


Stato finale del modulo frontend
================================

Stato finale del modulo proxy
=============================

Stato finale del modulo Jupyter
===============================
