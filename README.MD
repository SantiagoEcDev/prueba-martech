# Prueba Martech

Este proyecto consiste en el desarrollo de una aplicación web completa utilizando tecnologías frontend y backend. El objetivo es implementar una interfaz de usuario intuitiva y una API backend robusta que permita la gestión de usuarios y un módulo adicional con funcionalidades CRUD y carga masiva de datos.

## Contenidos

1. [Requisitos del Proyecto](#requisitos-del-proyecto)
2. [Frontend](#frontend)
3. [Backend](#backend)
4. [Instalación](#instalación)
5. [Uso](#uso)
6. [Contribuciones](#contribuciones)
7. [Licencia](#licencia)

## Requisitos del Proyecto

### Frontend

- **Página de Registro**: Permite a los usuarios registrarse proporcionando un nombre de usuario, correo electrónico y contraseña.
- **Página de Inicio de Sesión**: Permite a los usuarios iniciar sesión utilizando su correo electrónico y contraseña.
- **Página de Perfil**: Permite a los usuarios ver y actualizar su información (nombre de usuario y contraseña).
- **Módulo adicional**: Implementa un CRUD completo para una entidad de elección (por ejemplo, Productos, Servicios).
  - **Carga Masiva de Datos**: Permite cargar datos de manera masiva utilizando un archivo Excel.
    - **Interfaz de carga**: Un formulario en la interfaz del módulo adicional donde los usuarios puedan seleccionar y cargar un archivo Excel.
    - **Validación y procesamiento**: Validar los datos contenidos en el archivo Excel antes de ser insertados en la base de datos. Los datos deben ser verificados para evitar duplicados, errores de formato, y campos faltantes.
    - **Manejo de errores**: El sistema debe manejar cualquier error durante la carga, como archivos corruptos o datos no válidos, y proporcionar retroalimentación clara al usuario.
    - **Inserción en la base de datos**: Los datos validados deben ser insertados en la base de datos del módulo adicional (productos, servicios, etc.).
  - **Gráfica de Datos**: Visualiza datos relevantes del módulo adicional, como estadísticas de ventas, categorías más populares, o análisis de inventario.

### Backend

- **Registro de usuarios**: Guarda usuarios en la base de datos.
- **Autenticación**: Maneja el inicio de sesión y mantiene sesiones activas.
- **Actualización de perfil**: Permite la actualización de datos del usuario.
- **Módulo adicional**: Implementa el CRUD para la entidad elegida, incluida la funcionalidad de carga masiva de datos mediante un archivo Excel. La API debe poder procesar el archivo Excel, realizar la validación de los datos, y realizar la inserción en la base de datos.

## Instalación

1. Clona este repositorio en tu máquina local.
2. Navega a la carpeta frontend en tu terminal usando el comando "cd frontend". 
3. Dentro de la carpeta frontend ejecuta el comando "yarn" para la instalación de dependencias.
4. Navega a la carpeta server desde tu ruta raíz utilizando el comando "cd server".
5. Dentro de la carpeta server ejecuta `npm install` para instalar las dependencias.

## Uso

1. Ejecuta `npm start` para iniciar el servidor de desarrollo tanto para el frontend como para el backend.
2. Abre tu navegador y navega a `http://localhost:5173` para acceder a la aplicación.

## Sustentación

En este proyecto se tomaron varias decisiones técnicas y de diseño para asegurar un desarrollo eficiente y una experiencia de usuario fluida:

- **Tecnologías de Frontend**: Se eligió React para el desarrollo del frontend debido a su capacidad para crear interfaces de usuario reactivas y su vasta comunidad de soporte. React permite una gestión eficiente del estado de la aplicación y facilita la creación de componentes reutilizables.
- **Autenticación y Manejo de Sesiones**: Se decidió implementar la autenticación basada en JSON Web Tokens (JWT) para mantener las sesiones activas. Esto permite una comunicación segura entre el frontend y el backend y proporciona una manera sencilla de verificar la autenticidad de las solicitudes.
- **Carga Masiva de Datos**: Para la funcionalidad de carga masiva de datos, se eligió el uso de archivos Excel debido a su popularidad y facilidad de uso para los usuarios finales. Se utilizó la librería `XLSX` en el backend para procesar estos archivos y realizar la validación de datos antes de la inserción en la base de datos.
- **Manejo de Errores**: Se implementaron estrategias de manejo de errores tanto en el frontend como en el backend para asegurar que los usuarios reciban retroalimentación clara y concisa en caso de cualquier problema, mejorando así la experiencia de usuario y la robustez de la aplicación.
- **Interfaz de Usuario**: Se puso un énfasis especial en el diseño de una interfaz intuitiva y fácil de navegar, utilizando componentes de UI modernos y accesibles para asegurar una experiencia positiva para todos los usuarios.
