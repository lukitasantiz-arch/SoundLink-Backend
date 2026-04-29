# SoundLink – Red Social Musical 🎵

**Proyecto Intermodular DAM 2º | Luka Sánchez Tello | 2025-2026**

SoundLink es una aplicación web de red social centrada en la música.  
Permite a los usuarios compartir canciones y playlists, seguirse, chatear y organizarse para ir a conciertos.

---

## Tecnologías utilizadas

| Parte       | Tecnología                              |
|-------------|-----------------------------------------|
| Frontend    | HTML, CSS, JavaScript (Vanilla)         |
| Backend     | Node.js + Express                       |
| Base datos  | MySQL                                   |
| Sesiones    | Cookies con `cookie-parser`             |
| Versiones   | Git + GitHub                            |

---

## Estructura del proyecto

```
SoundLink-Backend/
├── index.js          ← Servidor principal (rutas API REST)
├── frontend.html     ← Interfaz de usuario completa
├── database.sql      ← Script SQL para crear la base de datos
├── package.json      ← Dependencias del proyecto
└── README.md         ← Este fichero
```

---

## Instalación y puesta en marcha

### 1. Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://www.mysql.com/) 8.0 o superior

### 2. Clonar el repositorio

```bash
git clone https://github.com/lukitasantiz-arch/SoundLink-Backend.git
cd SoundLink-Backend
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Crear la base de datos

Abre tu cliente MySQL (MySQL Workbench, phpMyAdmin o la terminal) y ejecuta:

```bash
mysql -u root -p < database.sql
```

Esto crea la base de datos `soundlink` con todas las tablas y datos de ejemplo.

### 5. Configurar la conexión a MySQL

Abre `index.js` y busca el objeto `dbConfig` (línea ~30).  
Cambia `password` si tu MySQL tiene contraseña:

```javascript
const dbConfig = {
  host:     'localhost',
  user:     'root',
  password: 'TU_CONTRASEÑA',   // ← escribe aquí tu contraseña
  database: 'soundlink',
  port:     3306,
};
```

### 6. Arrancar el servidor

```bash
npm start
```

Deberías ver:
```
✅ Conexión a MySQL correcta
🚀 SoundLink Backend corriendo en http://localhost:3000
📄 Abre http://localhost:3000/frontend.html en tu navegador
```

### 7. Abrir la aplicación

Abre en tu navegador: **http://localhost:3000/frontend.html**

---

## Usuarios de prueba

| Email                    | Contraseña | Rol           |
|--------------------------|------------|---------------|
| admin@soundlink.app      | admin      | Administrador |
| luka@soundlink.app       | pass       | Usuario       |
| maria@soundlink.app      | 1234       | Usuario       |
| carlos@soundlink.app     | 1234       | Usuario       |

---

## Rutas de la API REST

| Método   | Ruta                          | Descripción                        | Auth |
|----------|-------------------------------|------------------------------------|------|
| POST     | `/login`                      | Iniciar sesión                     | No   |
| POST     | `/logout`                     | Cerrar sesión                      | No   |
| POST     | `/registro`                   | Crear cuenta nueva                 | No   |
| GET      | `/me`                         | Ver usuario de la sesión actual    | Sí   |
| GET      | `/publicaciones`              | Ver todas las publicaciones        | No   |
| POST     | `/publicaciones`              | Crear publicación                  | Sí   |
| DELETE   | `/publicaciones/:id`          | Eliminar publicación               | Sí   |
| POST     | `/publicaciones/:id/like`     | Dar / quitar like                  | Sí   |
| GET      | `/mensajes`                   | Ver mis mensajes                   | Sí   |
| POST     | `/mensajes`                   | Enviar mensaje                     | Sí   |
| GET      | `/conciertos`                 | Ver todos los conciertos           | No   |
| POST     | `/conciertos`                 | Crear concierto (solo admin)       | Sí   |
| DELETE   | `/conciertos/:id`             | Eliminar concierto (solo admin)    | Sí   |
| POST     | `/conciertos/:id/asistir`     | Apuntarse / desapuntarse           | Sí   |
| GET      | `/usuarios`                   | Listar usuarios (solo admin)       | Sí   |
| DELETE   | `/usuarios/:id`               | Eliminar usuario (solo admin)      | Sí   |

---

## Esquema de la base de datos

```
usuarios        → id, nombre, email, password, rol, bio, fecha_reg
publicaciones   → id, usuario_id, contenido, tipo, likes, fecha
mensajes        → id, emisor_id, receptor_id, mensaje, fecha
conciertos      → id, nombre, fecha, ubicacion, creado_por, fecha_reg
asistencias     → usuario_id, concierto_id  (tabla intermedia)
likes           → usuario_id, publicacion_id  (tabla intermedia)
seguidores      → seguidor_id, seguido_id  (tabla intermedia)
```
