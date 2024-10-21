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
    res.render('lista_lecciones', { user: req.user || null, completada: req.query.completada === 'true'});
});

// Ruta para lecciones
router.get('/leccion/1', (req,res)=>{
    res.render('lecciones/leccion1', {user:req.user || null})
})
// Rutas para los métodos del controlador
router.post('/login', authController.login);
router.post('/acceder', authController.acceder);
router.get('/logout', authController.logout);

module.exports = router;
