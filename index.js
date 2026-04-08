const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./database');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// ===== Usuarios de prueba =====
let usuarios = [
    { id: 1, nombre: "Luka", rol: "usuario" },
    { id: 2, nombre: "Admin", rol: "admin" }
];

let mensajes = [];
let conciertos = [];

// ===== Middleware para verificar rol =====
function requireRole(rol) {
    return (req, res, next) => {
        const usuarioId = req.cookies.usuarioId;
        const usuario = usuarios.find(u => u.id == usuarioId);

        if (!usuario) return res.status(401).send("No logueado");
        if (usuario.rol !== rol) return res.status(403).send("No tienes permisos");

        next();
    };
}

// ===== LOGIN =====
app.post('/login', (req, res) => {
    const { id } = req.body;
    const usuario = usuarios.find(u => u.id == id);

    if (!usuario) return res.status(404).send("Usuario no encontrado");

    res.cookie('usuarioId', usuario.id, { maxAge: 3600000 });
    res.send(`Usuario ${usuario.nombre} logueado`);
});

app.post('/logout', (req, res) => {
    res.clearCookie('usuarioId');
    res.send("Sesión cerrada");
});

// ===== USUARIOS =====
app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al obtener usuarios: ' + err.message);
        }

        res.json(results);
    });
});

app.post('/usuarios', (req, res) => {
    const { nombre, email, password } = req.body;

    const sql = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';

    db.query(sql, [nombre, email, password, 'usuario'], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al crear usuario: ' + err.message);
        }

        res.send('Usuario creado');
    });
});

// ===== PUBLICACIONES =====
app.get('/publicaciones', (req, res) => {
    const sql = `
        SELECT publicaciones.id, publicaciones.contenido, publicaciones.fecha_publicacion, usuarios.nombre
        FROM publicaciones
        JOIN usuarios ON publicaciones.usuario_id = usuarios.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al obtener publicaciones: ' + err.message);
        }

        res.json(results);
    });
});

app.post('/publicaciones', (req, res) => {
    const { contenido, usuario_id } = req.body;

    const sql = `
        INSERT INTO publicaciones (contenido, usuario_id)
        VALUES (?, ?)
    `;

    db.query(sql, [contenido, usuario_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al crear publicación: ' + err.message);
        }

        res.send('Publicación creada');
    });
});

app.get('/usuarios/:id/publicaciones', (req, res) => {
    const usuarioId = req.params.id;

    const sql = `
        SELECT * FROM publicaciones
        WHERE usuario_id = ?
    `;

    db.query(sql, [usuarioId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al obtener publicaciones del usuario: ' + err.message);
        }

        res.json(results);
    });
});

// ===== MENSAJES =====
app.get('/mensajes', (req, res) => {
    res.json(mensajes);
});

app.post('/mensajes', (req, res) => {
    const { de, para, contenido } = req.body;
    const id = mensajes.length + 1;
    mensajes.push({ id, de, para, contenido });
    res.send("Mensaje enviado");
});

// ===== CONCIERTOS =====
app.get('/conciertos', (req, res) => {
    res.json(conciertos);
});

app.post('/conciertos', requireRole('admin'), (req, res) => {
    const { nombre, fecha } = req.body;
    const id = conciertos.length + 1;
    conciertos.push({ id, nombre, fecha });
    res.send("Concierto creado (solo admin)");
});

app.delete('/conciertos/:id', requireRole('admin'), (req, res) => {
    const index = conciertos.findIndex(c => c.id == req.params.id);

    if (index === -1) return res.send("Concierto no encontrado");

    conciertos.splice(index, 1);
    res.send("Concierto eliminado (solo admin)");
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
    console.log(`Servidor SoundLink corriendo en http://localhost:${PORT}`);
});