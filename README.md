# Aplicaciones
Usted debe tener instalado las siguientes aplicaciones 
para el correcto funcionamineto del sistema
1. VisualStudio Code
2. XAMPP
3. Composer
Cada una de estas aplicaciones las puede descargar de sus repectivas paginas web

# Versiones 
1. Version node 21.6.1
2. Version Laravel 8.83.27
3. Version React 8.2.0
4. Version php 8.2.12
5. Version composer  2.6.6

# Copia y pega
1. Debe descoprimir el archivo comprimido
2. Dentro de un folder de VS Code debe copiar las carpetas de 
    'apiReserva' y 'fronted'

# Variables de entorno
1. Ir a la carpeta de 'apiReserva'
2. Abrir los archivos:
    * .env
    * .env.example
3. Borrar todo el contenido del archivo .env
4. Copiar todo el contenido del archivo .env.example
5. Pegarlo dentro del archivo .env
6. Repetir el mismo proceso de copiado y pegado en la carpeta 'fronted' 

# Creacion de la BD
1. Crear manualmente la base de datos en  http://localhost/phpmyadmin/index.php
2. El nombre de la base de datos debe ser: 'reserva'

# Migraciones
1. Ir a la carpeta 'apiReserva' mediante la terminal
2. Ejecutar el comando: php artisan migrate
                        php artisan db:seed
3. Esto generara las tablas y sus respectivos datos prueba


# Dependencias
1. Ir a la carpeta 'apiReserva' mediante la terminal
2. Ejecutar el comando: composer install


# Vistas
1. Ir a la carpeta 'frontend' mediante la terminal
2. Ejecutar comando: npm install
3. Ejecutar comando: npm start  
4. Para poder revisar las dos versiones de las vistas admin/docente
   debe entrar a su localhost junto al puerto de su configuracion
    localhost:#### :

    Vista Administrador: "http://localhost:3000/admin"
    Vista Docente:        "http://localhost:3000/docente/{Id_de_identificacion_del_usuario}"

# Levantamiendo de servidor 
1. Ir a la carpeta 'apiReserva' mediante la terminal
2. Ejecutar el comando: php artisan serve