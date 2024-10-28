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
        conexion.query('SELECT * FROM users WHERE id = $1', [decoded.id], (error, results) => {
            if (error) {
                console.error('Error en la consulta:', error);
                return res.status(500).send('Error en el servidor'); // Manejar el error apropiadamente
            }            
            if (results.rows.length > 0) {
                req.user = results.rows[0]; // Establecer el usuario en la petición
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
    res.render('login', { alert:false, user: req.user || null });
});

router.get('/acceder', (req, res) => {
    res.render('acceder', { alert: false, user: req.user || null });
});

router.get('/lista_lecciones', (req, res) => {
    const userId = req.user ? req.user.id : null; // Obtener el ID del usuario

    // Si hay un usuario autenticado, obtener las lecciones completadas
    if (userId) {
        const sql = 'SELECT leccion_id FROM niveles_completados WHERE user_id = $1';
        conexion.query(sql, [userId], (error, results) => {
            if (error) {
                console.error("Error en la consulta:", error); // Para depurar
                return res.status(500).send('Error al obtener las lecciones completadas');
            }

            const leccionesCompletadas = results.rows.map(row => row.leccion_id); // Cambiado a results.rows
            const completada = req.query.completada === 'true'; // Manejar el parámetro

            console.log('Usuario:', req.user); 
            res.render('lista_lecciones', { user: req.user, leccionesCompletadas, completada }); // Pasar completada a la vista
        });
    } else {
        res.render('lista_lecciones', { user: null, leccionesCompletadas: [], completada: false });
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
    const { leccionId } = req.body;
    const userId = req.user ? req.user.id : null;

    console.log(`Usuario ID: ${userId}, Lección ID: ${leccionId}`); // Log para depuración

    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar si la lección ya ha sido completada
    conexion.query('SELECT 1 FROM niveles_completados WHERE user_id = $1 AND leccion_id = $2', [userId, leccionId], (error, results) => {
        if (error) {
            console.error('Error al verificar la lección completada:', error);
            return res.status(500).json({ error: 'Error al verificar la lección completada' });
        }

        // Si la lección ya ha sido completada, enviar un mensaje de error
        if (results.rowCount > 0) {
            return res.status(400).json({ error: 'Lección ya completada' });
        }

        // Guardar la lección completada
        conexion.query('INSERT INTO niveles_completados (user_id, leccion_id) VALUES ($1, $2)', [userId, leccionId], (error) => {
            if (error) {
                console.error('Error al completar la lección:', error);
                return res.status(500).json({ error: 'Error al completar la lección' });
            }
            res.status(200).json({ message: 'Lección completada' });
        });
    });
});


// Rutas para los métodos del controlador
router.post('/login', authController.login);
router.post('/acceder', authController.acceder);
router.get('/logout', authController.logout);

module.exports = router;
