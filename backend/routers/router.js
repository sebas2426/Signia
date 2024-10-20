const express= require('express')
const router= express.Router()

const authController = require('../controlers/authController')

// Rutas para las vistas
router.get('/', (req, res) => {
    res.render('index', {user:req.user});
});

router.get('/login', (req, res) => {
    res.render('login'); 
});

router.get('/acceder', (req, res) => {
    res.render('acceder', { alert: false}); 
});

router.get('/lista_lecciones', (req, res) => {
    res.render('lista_lecciones');
});

// Rutas para los métodos del controlador
router.post('/login', authController.login);
router.post('/acceder', authController.acceder);
router.get('/logout', authController.logout);



module.exports=router