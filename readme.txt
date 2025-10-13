===================INTEGRANTES=====================
1968956 --- Ingrid Vanessa Davila Moreno
2128709 --- Ariadna Mayela Moreno Rodríguez
2086278 --- Jordi Alexis Saldaña Ortíz
2127289 --- María Mercedes Thomas Rivadulla



===================PARA LEVANTAR LA PÁGINA=====================

Es necesario LEVANTAR ambas para que funcione correctamente 
la parte de registro y login. Se requiere una terminal
diferente para cada una.

    NOTA: Para crear la BD localmente desde tu pc, ve a 

        pwii_vbeta>server>index.js
        
    Y lee las líneas 20 al 24. Esta info la modificarás según la 
    conexión en Workbench que hayas creado. Luego crearás un nuevo
    query, pegarás el contenido de scriptBD.txt y ejecutarás el query. 
    Si el proceso fue exitoso, luego de levantar la página deberás 
    poder almacenar datos sin mayor problema.

...........FRONT...............
1. cd pwii_vbeta
2. cd front
3. npm start

..........BACK.................
1. cd pwii_vbeta
2. cd server
3. node index.js

***npm install
***npm aud
***del pwii_vbeta\front\package-lock.json
***rmdir /s /q pwii_vbeta\front\node_modules
***cd pwii_vbeta\front && npm install
***cd pwii_vbeta\front && npm install react-scripts@5.0.1
***faltan más comandos



========================SOBRE LA PÁGINA===========================
- pwii_vbeta/front: Contiene el código del frontend de la aplicación, desarrollado en React. 
Aquí se encuentran los componentes y páginas que conforman la interfaz de usuario. Principalmente src.
Dentro de src encontramos:
    -/Componentes: los componentes que se utilizan para generar la interfaz de usuario.
    -/Paginas: aquí están nuestras páginas en jsx.
    -App.js: aquí ponemos las rutas de las páginas.

- pwii_vbeta/server: Contiene el código del backend de la aplicación, desarrollado en Node.js con Express. 
Gestiona la lógica de negocio, las rutas de la API y la conexión con la base de datos.
    -index.js: aquí reside la información para la comunicación con la BD y los querys.