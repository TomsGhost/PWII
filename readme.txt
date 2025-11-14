+---------------------------------------------+
|                INTEGRANTES                  |
+---------------------------------------------+
| 1968956 --- Ingrid Vanessa Davila Moreno    |
| 2128709 --- Ariadna Mayela Moreno Rodríguez |
| 2086278 --- Jordi Alexis Saldaña Ortíz      |
| 2127289 --- María Mercedes Thomas Rivadulla |
+---------------------------------------------+



╔════════════════════════════════════════════════════════════╗
║                 PARA LEVANTAR LA PÁGINA                    ║
╚════════════════════════════════════════════════════════════╝

Es necesario LEVANTAR ambas partes (frontend y backend) para que la aplicación
funcione correctamente, especialmente el registro y el login.
Se requiere una terminal diferente para cada una.

    /------------------------------------------------------\
    |  NOTA: Configuración de la Base de Datos Local       |
    |                                                      |
    |  Para crear la BD localmente desde tu PC, ve a:      |
    |      -> pwii_vbeta/server/index.js                   |
    |                                                      |
    |  Lee las líneas 20 a 24. Modificarás esta información|
    |  según la conexión que hayas creado en MySQL         |
    |  Workbench.                                          |
    |                                                      |
    |  Luego, crea un nuevo query, pega el contenido de    |
    |  `scriptBD.txt` y ejecútalo. Si todo fue exitoso,    |
    |  podrás almacenar datos sin problemas.               |
    \------------------------------------------------------/


· · · · · · · · · · · · · FRONTEND · · · · · · · · · · · · ·

1. cd pwii_vbeta
2. cd front
(SI ES LA PRIMERA VEZ)
   2.1. Elimina la carpeta "node_modules"
   2.2. Elimina el archivo "package-lock.json"
   2.3. Ejecuta: npm install
3. Ejecuta: npm start


· · · · · · · · · · · · · BACKEND · · · · · · · · · · · · ·

1. cd pwii_vbeta
2. cd server
(SI ES LA PRIMERA VEZ)
   2.1. Elimina la carpeta "node_modules"
   2.2. Elimina el archivo "package-lock.json"
   2.3. Ejecuta: npm install
3. Ejecuta: node index.js


· · · · · · · · · · · · BASE DE DATOS · · · · · · · · · · ·

El archivo "scriptBD.txt" contiene todos los Stored Procedures (SP),
tablas y todo lo necesario para las operaciones con la base de datos.

1. Copia el contenido de `scriptBD.txt`.
2. Crea una conexión en MySQL Workbench.
3. Pega el contenido en un nuevo query.
4. Guarda el query en tu PC.
5. Ejecuta el query.

    +------------------------------------------------------+
    | ¡¡¡ IMPORTANTE !!!                                   |
    |                                                      |
    | CADA QUE SE AÑADA UN SP, TRIGGER, ETC. EN WORKBENCH, |
    | FAVOR DE ACTUALIZAR EL ARCHIVO scriptBD.txt.         |
    +------------------------------------------------------+


· · · · · · · · · · · COMANDOS EXTRA · · · · · · · · · · ·

Algunos comandos útiles para la gestión de dependencias:

*** npm install
*** npm audit
*** del pwii_vbeta\front\package-lock.json
*** rmdir /s /q pwii_vbeta\front\node_modules
*** cd pwii_vbeta\front && npm install
*** cd pwii_vbeta\front && npm install react-scripts@5.0.1



╔════════════════════════════════════════════════════════════╗
║                    SOBRE LA PÁGINA                         ║
╚════════════════════════════════════════════════════════════╝

- pwii_vbeta/front:
  Contiene el código del frontend de la aplicación, desarrollado en React.
  Aquí se encuentran los componentes y páginas que conforman la interfaz de usuario.
  La carpeta principal es `src`.
    -> /Componentes: Componentes reutilizables para la interfaz.
    -> /Paginas: Las diferentes páginas de la aplicación (vistas).
    -> App.js: Define las rutas (URLs) para cada página.

- pwii_vbeta/server:
  Contiene el código del backend, desarrollado en Node.js con Express.
  Gestiona la lógica de negocio, las rutas de la API y la conexión con la BD.
    -> index.js: Contiene la configuración de la base de datos y los endpoints de la API.



╔════════════════════════════════════════════════════════════╗
║                          PÁGINAS                           ║
╚════════════════════════════════════════════════════════════╝
/
/register
/inicio
/HomePage
/SearchPage
/ranking
        
/perfil  
/profileEdit
/deleteProfile
/edit-embed
/create-embed
/favorite-embed