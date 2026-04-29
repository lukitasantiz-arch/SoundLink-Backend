# SoundLink – Red Social Musical 🎵

**Proyecto Intermodular DAM 2º | Luka Sánchez Tello | 2025-2026**

SoundLink es una aplicación web de red social centrada en la música.  
Permite a los usuarios compartir publicaciones, comunicarse mediante mensajes privados y organizarse para asistir a conciertos.

---

## Tecnologías utilizadas

| Parte | Tecnología |
|---|---|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | Node.js + Express |
| Base datos | MySQL |
| Sesiones | Cookies con cookie-parser |
| Versiones | Git + GitHub |

---

## Estructura del proyecto

```text
SoundLink-Backend/
├── index.js          ← Servidor principal (rutas API REST)
├── frontend.html     ← Interfaz de usuario completa
├── database.sql      ← Script SQL para crear la base de datos
├── package.json      ← Dependencias del proyecto
├── package-lock.json ← Registro de dependencias instaladas
└── README.md         ← Este fichero
```

---

## Instalación y puesta en marcha

### 1. Requisitos previos

- Node.js v18 o superior
- MySQL 8.0 o superior

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

Abre tu cliente MySQL, como MySQL Workbench, y ejecuta el archivo:

```bash
database.sql
```

También se puede importar desde terminal con:

```bash
mysql -u root -p < database.sql
```

Esto crea la base de datos `soundlink` con las tablas necesarias para el funcionamiento de la aplicación.

### 5. Configurar la conexión a MySQL

Abre `index.js` y revisa los datos de conexión a la base de datos.  
En mi caso, la conexión está configurada así:

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root1234',
  database: 'soundlink',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

Si tu MySQL tiene otra contraseña, cambia el campo `password`.

### 6. Arrancar el servidor

```bash
node index.js
```

Deberías ver algo parecido a esto:

```text
✅ Conexión a MySQL correcta
🚀 SoundLink Backend corriendo en http://localhost:3000
📄 Abre http://localhost:3000 en tu navegador
```

### 7. Abrir la aplicación

Abre en tu navegador:

```text
http://localhost:3000
```

---

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@gmail.com | 1234 | Administrador |
| luka@gmail.com | 1234 | Usuario |

---

## Rutas de la API REST

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/login` | Iniciar sesión | No |
| POST | `/logout` | Cerrar sesión | No |
| POST | `/registro` | Crear cuenta nueva | No |
| GET | `/me` | Ver usuario de la sesión actual | Sí |
| GET | `/publicaciones` | Ver todas las publicaciones | Sí |
| POST | `/publicaciones` | Crear publicación | Sí |
| DELETE | `/publicaciones/:id` | Eliminar publicación | Sí |
| POST | `/publicaciones/:id/like` | Dar o quitar like | Sí |
| GET | `/mensajes` | Ver mis mensajes | Sí |
| POST | `/mensajes` | Enviar mensaje | Sí |
| GET | `/conciertos` | Ver todos los conciertos | Sí |
| POST | `/conciertos/:id/asistir` | Apuntarse o desapuntarse de un concierto | Sí |
| GET | `/usuarios` | Listar usuarios (solo admin) | Sí |
| DELETE | `/usuarios/:id` | Eliminar usuario (solo admin) | Sí |

---

## Esquema de la base de datos

```text
usuarios        → id, nombre, email, password, rol, bio, fecha_reg
publicaciones   → id, usuario_id, contenido, tipo, likes, fecha
mensajes        → id, emisor_id, receptor_id, mensaje, fecha
conciertos      → id, nombre, fecha, hora, ubicacion, creado_por
asistencias     → usuario_id, concierto_id  (tabla intermedia)
likes           → usuario_id, publicacion_id  (tabla intermedia)
```

---

## Estado del proyecto

El proyecto se encuentra en una versión funcional.  
El frontend se conecta con el backend mediante peticiones HTTP y los datos se almacenan en MySQL.

Actualmente permite registrar usuarios, iniciar sesión, crear publicaciones, dar likes, enviar mensajes, consultar conciertos y apuntarse o desapuntarse de ellos.

Como mejoras futuras se plantean reforzar la seguridad mediante cifrado de contraseñas, mejorar las validaciones e incorporar nuevas funcionalidades relacionadas con recomendaciones musicales.

---

## Autor

Luka Sánchez Tello  
2º DAM
