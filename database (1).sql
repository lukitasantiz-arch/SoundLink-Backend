-- ============================================================
--  SoundLink - Base de datos MySQL
--  Autor: Luka Sánchez Tello  |  DAM 2º
--  Descripción: Esquema completo. Solo 2 usuarios iniciales;
--               el resto se registran desde la app.
-- ============================================================

CREATE DATABASE IF NOT EXISTS soundlink
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE soundlink;

-- ────────────────────────────────────────────────────────────
--  TABLA: usuarios
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id        INT          AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  email     VARCHAR(150) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  rol       ENUM('user','admin') NOT NULL DEFAULT 'user',
  bio       TEXT,
  fecha_reg DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
--  TABLA: publicaciones
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS publicaciones (
  id         INT  AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT  NOT NULL,
  contenido  TEXT NOT NULL,
  tipo       ENUM('song','playlist','event','general') NOT NULL DEFAULT 'general',
  likes      INT  NOT NULL DEFAULT 0,
  fecha      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  TABLA: mensajes
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mensajes (
  id          INT  AUTO_INCREMENT PRIMARY KEY,
  emisor_id   INT  NOT NULL,
  receptor_id INT  NOT NULL,
  mensaje     TEXT NOT NULL,
  fecha       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (emisor_id)   REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (receptor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  TABLA: conciertos
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conciertos (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(200) NOT NULL,
  fecha      DATE         NOT NULL,
  ubicacion  VARCHAR(200) NOT NULL,
  creado_por INT          NOT NULL,
  fecha_reg  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  TABLA: asistencias
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asistencias (
  usuario_id   INT NOT NULL,
  concierto_id INT NOT NULL,
  PRIMARY KEY (usuario_id, concierto_id),
  FOREIGN KEY (usuario_id)   REFERENCES usuarios(id)   ON DELETE CASCADE,
  FOREIGN KEY (concierto_id) REFERENCES conciertos(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  TABLA: likes
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS likes (
  usuario_id     INT NOT NULL,
  publicacion_id INT NOT NULL,
  PRIMARY KEY (usuario_id, publicacion_id),
  FOREIGN KEY (usuario_id)     REFERENCES usuarios(id)      ON DELETE CASCADE,
  FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  TABLA: seguidores
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seguidores (
  seguidor_id INT NOT NULL,
  seguido_id  INT NOT NULL,
  PRIMARY KEY (seguidor_id, seguido_id),
  FOREIGN KEY (seguidor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (seguido_id)  REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ════════════════════════════════════════════════════════════
--  DATOS INICIALES
--  Solo 2 cuentas fijas. El resto de usuarios se registran
--  directamente desde la aplicación con el formulario de registro.
--  IMPORTANTE: el rol válido es 'user' o 'admin' (no 'usuario').
-- ════════════════════════════════════════════════════════════

INSERT IGNORE INTO usuarios (id, nombre, email, password, rol) VALUES
  (1, 'Luka',  'luka@gmail.com',  '1234', 'user'),
  (2, 'Admin', 'admin@gmail.com', '1234', 'admin');

-- Publicaciones de ejemplo vinculadas a Luka (id=1)
INSERT INTO publicaciones (contenido, usuario_id, tipo) VALUES
  ('Mi primera publicación en SoundLink', 1, 'general'),
  ('Probando que todo funciona correctamente', 1, 'general'),
  ('Este proyecto va a quedar de 10', 1, 'general');

-- Conciertos de ejemplo creados por el admin (id=2)
INSERT INTO conciertos (nombre, fecha, ubicacion, creado_por) VALUES
  ('Rosalía – Motomami World Tour',        '2025-06-14', 'Palau Sant Jordi, Barcelona',   2),
  ('Bad Bunny – El Último Tour del Mundo', '2025-07-03', 'WiZink Center, Madrid',         2),
  ('C. Tangana – Madrilleño',              '2025-07-20', 'Estadio Metropolitano, Madrid', 2),
  ('Vetusta Morla – Mad Cool Festival',    '2025-08-10', 'IFEMA, Madrid',                 2);

-- ════════════════════════════════════════════════════════════
--  COMPROBACIÓN
-- ════════════════════════════════════════════════════════════
SELECT * FROM usuarios;
SELECT * FROM publicaciones;
