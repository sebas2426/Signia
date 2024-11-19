const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const conexion = require('../database/db');
const authController = require('../controlers/authController');

// Middleware para verificar la sesión
router.use((req, res, next) => {
    next();
});

// Middleware para establecer el usuario en cada solicitud
router.use((req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM users WHERE id = $1', [decoded.id], (error, results) => {
                if (error) {
                    console.error('Error en la consulta:', error);
                    return res.status(500).send('Error en el servidor');
                }
                if (results.rows.length > 0) {
                    req.user = results.rows[0]; // Establecer el usuario en req.user
                }
                next();
            });
        } catch (error) {
            console.error('Error al verificar el token:', error);
            next();
        }
    } else {
        next(); // Continuar sin establecer req.user
    }
});

// Middleware global para obtener las lecciones completadas
router.use((req, res, next) => {
    if (req.user) {
        const userId = req.user.id;
        const sql = 'SELECT leccion_id FROM niveles_completados WHERE user_id = $1';

        conexion.query(sql, [userId], (error, results) => {
            if (error) {
                console.error("Error al obtener las lecciones completadas:", error);
                return res.status(500).send("Error al obtener los datos del usuario.");
            }
            res.locals.leccionesCompletadas = results.rows.map(row => row.leccion_id);
            next();
        });
    } else {
        res.locals.leccionesCompletadas = []; // Usuario no autenticado
        next();
    }
});

// Rutas para las vistas
router.get('/', (req, res) => {
    res.render('index', { user: req.user || null });
});

router.get('/login', (req, res) => {
    res.render('login', { alert: false, user: req.user || null });
});

router.get('/acceder', (req, res) => {
    res.render('acceder', { alert: false, user: req.user || null });
});

router.get('/curso_completado', (req, res) => {
    res.render('curso_completado', { alert: false, user: req.user || null });
});

router.get('/lista_lecciones', (req, res) => {
    const completada = req.query.completada === 'true'; // Manejar el parámetro
    res.render('lista_lecciones', { user: req.user, completada });
});

// Ruta para lecciones

router.get('/leccion/:id', (req, res) => {
    const leccionId = parseInt(req.params.id);
    const siguienteLeccionId = leccionId + 1;

    // Ruta del archivo JSON para la lección actual
    const dataPath = path.join(__dirname, `../data/lecciones/leccion${leccionId}.json`);

    // Lee el archivo JSON
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error al cargar los datos de la lección ${leccionId}:`, err);
            return res.status(500).send("Error al cargar la lección.");
        }

        // Convierte los datos de JSON a un objeto
        const leccionData = JSON.parse(data);

        // Asegúrate de que la sesión esté inicializada correctamente
        if (!req.session.tiempoInicio) {
            req.session.tiempoInicio = {}; // Inicializa el objeto si no existe
        }

        // Si no hay un tiempo de inicio registrado para esta lección, lo guarda
        if (!req.session.tiempoInicio[leccionId]) {
            req.session.tiempoInicio[leccionId] = Date.now(); // Guarda el tiempo de inicio
        }

        console.log(`Tiempo de inicio registrado para la lección ${leccionId}: ${req.session.tiempoInicio[leccionId]}`);

        // Renderiza la vista de la lección actual, pasando los datos y la siguiente lección
        res.render(`lecciones/leccion${leccionId}`, { 
            leccionData, 
            siguienteLeccion: siguienteLeccionId, 
            user: req.user || null 
        });
    });
});


// Ruta para marcar lecciones como completadas
router.post('/completar-leccion', (req, res) => {
    const { leccionId } = req.body;
    const userId = req.user ? req.user.id : null;

    console.log(`Usuario ID: ${userId}, Lección ID: ${leccionId}`); // Log para depuración

    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar si el tiempo de inicio está registrado para esta lección
    if (!req.session.tiempoInicio || !req.session.tiempoInicio[leccionId]) {
        return res.status(400).json({ error: 'No se encontró un tiempo de inicio para esta lección' });
    }

    // Calcular el tiempo total en segundos
    const tiempoTotalSegundos = (Date.now() - req.session.tiempoInicio[leccionId]) / 1000;

    // Verificar si la lección ya ha sido completada
    conexion.query(
        'SELECT 1 FROM niveles_completados WHERE user_id = $1 AND leccion_id = $2',
        [userId, leccionId],
        (error, results) => {
            if (error) {
                console.error('Error al verificar la lección completada:', error);
                return res.status(500).json({ error: 'Error al verificar la lección completada' });
            }

            // Si la lección ya ha sido completada, enviar un mensaje de error
            if (results.rowCount > 0) {
                return res.status(400).json({ error: 'Lección ya completada' });
            }

            // Guardar la lección completada con el tiempo total
            conexion.query(
                'INSERT INTO niveles_completados (user_id, leccion_id, tiempo_total_segundos) VALUES ($1, $2, $3)',
                [userId, leccionId, tiempoTotalSegundos],
                (error) => {
                    if (error) {
                        console.error('Error al completar la lección:', error);
                        return res.status(500).json({ error: 'Error al completar la lección' });
                    }

                    // Limpiar el tiempo de inicio para esta lección en la sesión
                    delete req.session.tiempoInicio[leccionId];

                    res.status(200).json({ message: 'Lección completada', tiempoTotalSegundos });
                }
            );
        }
    );
});

// Rutas para los métodos del controlador
router.post('/login', authController.login);
router.post('/acceder', authController.acceder);
router.get('/logout', authController.logout);

module.exports = router;
