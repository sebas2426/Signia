const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs'); // Importa el módulo fs
const path = require('path'); // Importa path para manejar rutas de archivos
const conexion = require('../database/db');

const authController = require('../controlers/authController');

// Middleware para verificar la sesión
router.use((req, res, next) => {
    next();
});

// Middleware para establecer el usuario en cada solicitud
router.use((req, res, next) => {
    if (req.cookies.jwt) {
        const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRETO);
        conexion.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, results) => {
            if (results.length > 0) {
                req.user = results[0]; // Establecer el usuario en la petición
            }
            next();
        });
    } else {
        next(); // Continuar sin establecer req.user
    }
});

// Rutas para las vistas
router.get('/', (req, res) => {
    res.render('index', { user: req.user || null });
});

router.get('/login', (req, res) => {
    res.render('login', { user: req.user || null });
});

router.get('/acceder', (req, res) => {
    res.render('acceder', { alert: false, user: req.user || null });
});

router.get('/lista_lecciones', (req, res) => {
    const userId = req.user ? req.user.id : null; // Obtener el ID del usuario

    // Si hay un usuario autenticado, obtener las lecciones completadas
    if (userId) {
        const sql = 'SELECT leccion_id FROM niveles_completados WHERE user_id = ?';
        conexion.query(sql, [userId], (error, results) => {
            if (error) {
                return res.status(500).send('Error al obtener las lecciones completadas');
            }

            const leccionesCompletadas = results.map(row => row.leccion_id);
            // Renderizar la vista con lecciones completadas
            res.render('lista_lecciones', { user: req.user, leccionesCompletadas });
        });
    } else {
        // Si no hay usuario autenticado, renderizar la vista sin lecciones completadas
        res.render('lista_lecciones', { user: null, leccionesCompletadas: [] });
    }
});



// Ruta para lecciones


router.get('/leccion/:id', (req, res) => {
    const leccionId = parseInt(req.params.id);
    const siguienteLeccionId = leccionId + 1;

    // Renderiza la lección actual y pasa la siguiente lección
    res.render(`lecciones/leccion${leccionId}`, { siguienteLeccion: siguienteLeccionId, user:req.user || null });
});


router.post('/completar-leccion', (req, res) => {
    const { leccionId } = req.body; // Obtener el ID de la lección del cuerpo de la solicitud
    const userId = req.user ? req.user.id : null; // Asegúrate de que el usuario esté autenticado

    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Realiza la consulta a la base de datos para guardar la lección completada
    conexion.query('INSERT INTO niveles_completados (user_id, leccion_id) VALUES (?, ?)', [userId, leccionId], (error, results) => {
        if (error) {
            console.error('Error al completar la lección:', error); // Muestra el error en la consola
            return res.status(500).json({ error: 'Error al completar la lección' });
        }
        res.status(200).json({ message: 'Lección completada' });
    });
});

// Rutas para los métodos del controlador
router.post('/login', authController.login);
router.post('/acceder', authController.acceder);
router.get('/logout', authController.logout);

module.exports = router;
