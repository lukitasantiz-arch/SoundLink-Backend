// ============================================================
// SoundLink - Backend completo
// Luka Sánchez Tello | 2º DAM
// ============================================================

const express = require('express');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

console.log('✅ Backend SoundLink iniciado');

// ============================================================
// MIDDLEWARES
// ============================================================

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend.html'));
});

// ============================================================
// CONEXIÓN MYSQL
// ============================================================

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'soundlink',
    waitForConnections: true,
    connectionLimit: 10
});

async function comprobarConexion() {
    try {
        await pool.query('SELECT 1');
        console.log('✅ MySQL conectado');
    } catch (error) {
        console.error('❌ Error MySQL:', error.message);
    }
}

// ============================================================
// MIDDLEWARES LOGIN
// ============================================================

async function obtenerUsuario(req) {
    const id = req.cookies.usuarioId;
    if (!id) return null;

    const [res] = await pool.query(
        'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?',
        [id]
    );

    return res[0] || null;
}

async function requiereLogin(req, res, next) {
    const usuario = await obtenerUsuario(req);
    if (!usuario) {
        return res.status(401).json({ error: 'Debes iniciar sesión' });
    }
    req.usuario = usuario;
    next();
}

async function requiereAdmin(req, res, next) {
    const usuario = await obtenerUsuario(req);
    if (!usuario) return res.status(401).json({ error: 'No logueado' });

    if (usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'No eres admin' });
    }

    req.usuario = usuario;
    next();
}

// ============================================================
// AUTH
// ============================================================

app.post('/registro', async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    const [existe] = await pool.query(
        'SELECT id FROM usuarios WHERE email = ?',
        [email]
    );

    if (existe.length) {
        return res.status(409).json({ error: 'Email ya usado' });
    }

    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
        [nombre, email, password, 'user']
    );

    res.cookie('usuarioId', result.insertId);

    res.json({
        usuario: {
            id: result.insertId,
            nombre,
            email,
            rol: 'user'
        }
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const [users] = await pool.query(
        'SELECT id, nombre, email, rol FROM usuarios WHERE email = ? AND password = ?',
        [email, password]
    );

    if (!users.length) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    res.cookie('usuarioId', users[0].id);

    res.json({ usuario: users[0] });
});

app.post('/logout', (req, res) => {
    res.clearCookie('usuarioId');
    res.json({ ok: true });
});

app.get('/me', requiereLogin, (req, res) => {
    res.json({ usuario: req.usuario });
});

// ============================================================
// PUBLICACIONES
// ============================================================

app.get('/publicaciones', requiereLogin, async (req, res) => {
    const [data] = await pool.query(`
        SELECT p.*, u.nombre AS username
        FROM publicaciones p
        JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.fecha DESC
    `);

    res.json(data);
});

app.post('/publicaciones', requiereLogin, async (req, res) => {
    const { contenido, tipo } = req.body;

    const [r] = await pool.query(
        'INSERT INTO publicaciones (usuario_id, contenido, tipo) VALUES (?, ?, ?)',
        [req.usuario.id, contenido, tipo || 'general']
    );

    res.json({ id: r.insertId });
});

// LIKE

app.post('/publicaciones/:id/like', requiereLogin, async (req, res) => {
    const id = req.params.id;

    const [existe] = await pool.query(
        'SELECT * FROM likes WHERE usuario_id=? AND publicacion_id=?',
        [req.usuario.id, id]
    );

    if (existe.length) {
        await pool.query('DELETE FROM likes WHERE usuario_id=? AND publicacion_id=?', [req.usuario.id, id]);
        await pool.query('UPDATE publicaciones SET likes = likes - 1 WHERE id=?', [id]);
        return res.json({ liked: false });
    }

    await pool.query('INSERT INTO likes VALUES (?,?)', [req.usuario.id, id]);
    await pool.query('UPDATE publicaciones SET likes = likes + 1 WHERE id=?', [id]);

    res.json({ liked: true });
});

// ============================================================
// MENSAJES
// ============================================================

app.get('/mensajes', requiereLogin, async (req, res) => {
    const [data] = await pool.query(`
        SELECT * FROM mensajes
        WHERE emisor_id = ? OR receptor_id = ?
        ORDER BY fecha ASC
    `, [req.usuario.id, req.usuario.id]);

    res.json(data);
});

app.post('/mensajes', requiereLogin, async (req, res) => {
    const { receptor_id, mensaje } = req.body;

    await pool.query(
        'INSERT INTO mensajes (emisor_id, receptor_id, mensaje) VALUES (?, ?, ?)',
        [req.usuario.id, receptor_id, mensaje]
    );

    res.json({ ok: true });
});

// ============================================================
// CONCIERTOS
// ============================================================

app.get('/conciertos', requiereLogin, async (req, res) => {
    const [data] = await pool.query(`
        SELECT c.*, COUNT(a.usuario_id) as attendees
        FROM conciertos c
        LEFT JOIN asistencias a ON c.id = a.concierto_id
        GROUP BY c.id
    `);

    res.json(data);
});

app.post('/conciertos', requiereAdmin, async (req, res) => {
    const { nombre, fecha, ubicacion } = req.body;

    await pool.query(
        'INSERT INTO conciertos (nombre, fecha, ubicacion) VALUES (?, ?, ?)',
        [nombre, fecha, ubicacion]
    );

    res.json({ ok: true });
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================

app.listen(PORT, async () => {
    await comprobarConexion();

    console.log(`🚀 http://localhost:${PORT}`);
});