Modulo frontend
===============
.. default-domain:: js

Il *modulo frontend* consiste in una interfaccia web che consente agli utenti di interagire con il :ref:`modulo backend` e di accedere al :ref:`modulo Jupyter`.

Si è cercato di renderla più user-friendly possibile, cercando di comunicare più informazioni possibili all'utente attraverso colori e icone, rendendo possibile apprendere ad utilizzare l'interfaccia intuitivamente.


Librerie e tecnologie utilizzate
--------------------------------

.. note::

   Sono elencate solo le principali librerie utilizzate; dipendenze e librerie minori non sono specificate, ma sono visibili all'interno del file ``yarn.lock``.

- I linguaggi di programmazione `JavaScript <https://developer.mozilla.org/en-US/docs/Web/JavaScript/About_JavaScript>`_ e `TypeScript <https://www.typescriptlang.org/>`_
   - Il gestore di dipendenze `Yarn <https://yarnpkg.com/>`_
   - La libreria grafica `Bluelib <https://github.com/Steffo99/bluelib>`_ (sviluppata come progetto personale nell'estate 2021)
   - Il framework per interfacce grafiche `React <https://reactjs.org>`_
      - Il router `Reach Router <https://reach.tech/router/>`_
      - L'integrazione con React di Bluelib `bluelib-react <https://github.com/Steffo99/bluelib-react>`_ (sviluppata durante il tirocinio)
      - Il componente React `react-markdown <https://github.com/remarkjs/react-markdown>`_
   - Il framework per testing `Jest <https://jestjs.io/>`_
   - Un fork personalizzato del client XHR `axios <https://github.com/axios/axios>`_
- Il webserver statico `serve <https://www.npmjs.com/package/serve>`_


Struttura del modulo
--------------------

Il modulo consiste nel package JavaScript :mod:`@steffo45/sophon-frontend`, che contiene tutti i componenti che assemblati insieme formano l'intera interfaccia web.

