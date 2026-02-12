# Sistema de Gestión de Ordenes

Este proyecto es una solución Full Stack para la gestión de órdenes de compra y productos. Fue desarrollado como parte del reto técnico para la posición de **React + Angular Trainee**.

La aplicación permite crear, listar y gestionar pedidos, así como administrar un catálogo de productos, todo bajo una arquitectura contenerizada lista para desplegar.

## Tecnologías Utilizadas

El proyecto utiliza un stack moderno:

### **Frontend (`/ui`)**

* **React 18 + TypeScript:** Tipado estático para mayor robustez.
* **Vite:** Entorno de desarrollo ultrarrápido y optimizado.
* **Tailwind CSS:** Estilizado moderno y responsivo.
* **Shadcn/UI:** Componentes de interfaz accesibles y profesionales.
* **Nginx:** Servidor web de alto rendimiento para servir la aplicación en producción.

### **Backend (`/api`)**

* **Node.js + Express:** Servidor RESTful escalable.
* **MySQL 8:** Base de datos relacional.
* **Arquitectura MVC:** Separación clara de responsabilidades (Modelos, Controladores, Rutas).

### **DevOps & Herramientas**

* **Docker & Docker Compose:** Orquestación de contenedores para garantizar la portabilidad.
* **Multi-stage Builds:** Imágenes de Docker optimizadas y ligeras.

---

## Estructura del Proyecto

El repositorio está organizado de la siguiente manera:

| Carpeta | Descripción |
| --- | --- |
| **`api/`** | Contiene el código fuente del Backend (Node.js). Incluye modelos, controladores y configuración de base de datos. |
| **`ui/`** | Contiene el código fuente del Frontend (React). Incluye componentes, páginas y configuración de estilos. |
| **`database/`** | Scripts SQL (`init.sql`) para la inicialización automática de tablas y datos semilla. |
| **`docker-compose.yml`** | Archivo maestro para levantar toda la infraestructura (BD, Back, Front) con un solo comando. |

---

## Funcionalidades Principales

1. **Gestión de Órdenes:**
* Creación de nuevas órdenes con cálculo automático de totales.
* Listado de órdenes con fecha, cliente y estado.
* Visualización de detalles de productos por orden.


2. **Gestión de Productos (CRUD Completo):**
* Agregar nuevos productos al catálogo.
* Editar precios y nombres de productos existentes.
* Eliminar productos (con validación de integridad referencial).


3. **Interfaz de Usuario:**
* Diseño **Responsive** (adaptable a móviles y escritorio).
* Feedback visual al usuario (Toast notifications para éxito/error).
* Manejo de estados de carga y error.



---

## Buenas Prácticas Implementadas

* **Dockerización Completa:** El entorno de desarrollo y producción es idéntico, eliminando el problema de "en mi máquina funciona".
* **Seguridad:** Uso de variables de entorno para credenciales sensibles y usuario no-root en contenedores.

* **Performance:**
* Compresión **Gzip** habilitada en Nginx.
* Caché de archivos estáticos configurada.


* **Clean Code:**
* Arquitectura modular en el Backend.
* Manejo centralizado de errores.



---

## Instalación y Despliegue (Docker)

La aplicación está diseñada para ser agnóstica al sistema operativo. Solo necesitas tener instalado **Docker Desktop**.

### Pasos para ejecutar:

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Joshua-RG/CRUD_Technical_Test.git
cd CRUD_Technical_Test

```


2. **Configurar Variables de Entorno:**
El proyecto incluye un archivo `.env.docker` preconfigurado para pruebas locales. 
3. **Levantar la aplicación:**
Ejecutar el siguiente comando en la raíz del proyecto:
```bash
docker-compose --env-file .env.docker up --build

```


*Este comando compilará el Frontend, instalará dependencias del Backend, configurará la Base de Datos e iniciará los servicios.*
4. **Acceder a la Aplicación:**
Una vez que la terminal muestre los logs de éxito de las 3 fases de la aplicacion (DB, API y UI), abrir el navegador:
* 👉 **Aplicación Web (Frontend):** [http://localhost:3001](https://www.google.com/search?q=http://localhost:3001)
* ⚙️ **API (Backend):** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
* 🗄️ **Base de Datos:** Puerto `3306` (Usuario: `root`, Password: `adminadmin` - *Solo para entorno local*).



---

## Demo

Puedes ver un video demostrativo de la funcionalidad aquí: [[VIDEO DEMO](https://drive.google.com/file/d/1ezmi1U9nmeNhWBHYpTYbkBJ6ByJQ-JEs/view?usp=sharing)]

---

**Desarrollado por:** Andres Joshua Rodriguez Guerrero