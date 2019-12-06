# Mizo ERP - API
MizoERP es un ERP CLOUD de código abierto desarrollado por Miguel Rodríguez Crespo para el proyecto de CS DAW a distancia.

Este proyecto es la parte de servidor desarrollada en NodeJS.

Este proyecto es la parte de cliente desarrollada en React JS.

## Requisitos
- Tener instalado [yarn](https://yarnpkg.com/lang/en/)
- Tener instalado [NodeJS](https://nodejs.org/es/)
- Base de datos PostgreSQL ya con la estructura generada.

## Preparar ejecución
- Instalamos las librerías del proyecto ejecutando `yarn install` en la raíz del proyecto.
- Creamos un archivo .env en la raíz del proyecto con las variables necesarias:    
    - PORT=<puerto_del_servidor>
    - DB_HOST=<ip_servidor_base_datos>
    - DB_PORT=<puerto_base_datos>
    - DB_NAME=<nombre_de_la_bd>
    - DB_USERNAME=<usuario_bd>
    - DB_PASSWD=<contraseña_bd>
    - JWT_SECRET=<cadena_texto_para_usar_como_secret>
    - NODEMAILER_ADDRESS=<cuenta_email_para_envios_de_mails>
    - NODEMAILER_PASSWORD=<contraseña_cuenta_emails>
    - MIZO_ERP_CLOUD_URL=<url_del_cliente>
- Por último ejecutamos el proyecto con `yarn start` en la raíz del proyecto.