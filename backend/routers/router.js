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
    res.render('curso_completado', { alert: false, user: req.user || null});
});

router.get('/reporte', (req, res) => {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }


     // Mapeo de los números de lección a títulos
     const lecciones = {
        1: 'Abecedario',
        2: 'Números del 1 al 20',
        3: 'Saludos',
        4: 'Días de la Semana',
        5: 'Meses del Año',
        6: 'Retroalimentación',
        7: 'Colores',
        8: 'Familia',
        9: 'Partes del Cuerpo',
        10: 'Profesiones',
        11: 'Partes de la casa',
        12: 'Retroalimentación 2',
        13: 'Examen Final'
    };

    // Obtener los datos de las lecciones desde la base de datos
    conexion.query(
        `SELECT 
            lr.leccion_id, 
            lr.repitio, 
            lr.intentos, 
            lr.tiempo_total_segundos AS tiempo, 
            lr.fecha_ultimo_intento,
            nc.leccion_id AS numero_leccion
        FROM 
            leccion_reporte lr
        JOIN 
            niveles_completados nc ON lr.leccion_id = nc.id 
        WHERE 
            lr.usuario_id = $1
        ORDER BY 
            nc.leccion_id`,
        [userId],
        (error, results) => {
            if (error) {
                console.error('Error al obtener los datos del reporte:', error);
                return res.status(500).json({ error: 'Error al obtener los datos del reporte' });
            }

            // Mapear los resultados para pasarlos a la vista
            const reportes = results.rows.map(row => ({
                leccionId: row.numero_leccion,  // Aquí usamos el número de lección obtenido de la tabla niveles_completados
                tituloLeccion: lecciones[row.numero_leccion] || 'Lección desconocida', // Usamos el mapeo
                repitio: row.repitio,
                intentos: row.intentos,
                tiempo: row.tiempo,
                ultimoIntento: row.fecha_ultimo_intento
            }));

            // Renderizar la vista pasando los datos
            res.render('reporte', {alert: false, user: req.user || null, reportes });
        }
    );
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

        // Renderiza la vista de la lección actual, pasando los datos y la siguiente lección
        res.render(`lecciones/leccion${leccionId}`, { 
            leccionData, 
            leccionId,
            leccionesCompletadas,
            siguienteLeccion: siguienteLeccionId, 
            user: req.user || null 
        });
    });
});

// Ruta para marcar lecciones como completadas
router.post('/completar-leccion', (req, res) => {
    const { leccionId, puntaje, repitio, intentos, tiempoTotalSegundos, ultimoIntento } = req.body;
    const userId = req.user ? req.user.id : null;

    console.log(`Usuario ID: ${userId}, Lección ID: ${leccionId}`);

    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar si la lección ya ha sido completada en niveles_completados
    conexion.query(
        'SELECT id FROM niveles_completados WHERE user_id = $1 AND leccion_id = $2',
        [userId, leccionId],
        (error, results) => {
            if (error) {
                console.error('Error al verificar niveles_completados:', error);
                return res.status(500).json({ error: 'Error al verificar niveles_completados' });
            }

            const nivelCompletadoId = results.rowCount > 0
                ? results.rows[0].id // Si ya existe, usar su ID
                : null;

            const insertarReporte = (nivelId) => {
                // Insertar en leccion_reporte usando el ID correcto
                conexion.query(
                    `INSERT INTO leccion_reporte (usuario_id, leccion_id, intentos, tiempo_total_segundos, repitio, fecha_ultimo_intento)
                    VALUES ($1, $2, $3, $4, $5, $6)`,
                    [userId, nivelId, intentos, tiempoTotalSegundos, repitio, ultimoIntento],
                    (error) => {
                        if (error) {
                            console.error('Error al guardar el reporte de la lección:', error);
                            return res.status(500).json({ error: 'Error al guardar el reporte de la lección' });
                        }
                        res.status(200).json({ message: 'Lección completada y reporte guardado' });
                    }
                );
            };

            if (nivelCompletadoId) {
                // Si ya existe el registro en niveles_completados
                insertarReporte(nivelCompletadoId);
            } else {
                // Si no existe, insertar en niveles_completados y usar su nuevo ID
                conexion.query(
                    'INSERT INTO niveles_completados (user_id, leccion_id) VALUES ($1, $2) RETURNING id',
                    [userId, leccionId],
                    (error, result) => {
                        if (error) {
                            console.error('Error al insertar en niveles_completados:', error);
                            return res.status(500).json({ error: 'Error al insertar en niveles_completados' });
                        }
                        insertarReporte(result.rows[0].id);
                    }
                );
            }
        }
    );
});


// Rutas para los métodos del controlador
router.post('/login', authController.login);
router.post('/acceder', authController.acceder);
router.get('/logout', authController.logout);

module.exports = router;