const express= require('express')
const router= express.Router()

const authController = require('../controlers/authController')

//router para las vistas
router.get('/', (req,res)=>{
    res.render('index')
})

router.get('/login', (req,res)=>{
    res.render('login')
})

router.get('/acceder', (req,res)=>{
    res.render('acceder')
})

router.get('/lista_lecciones', (req,res)=>{
    res.render('lista_lecciones')
})


//router para los metodos del controler
router.post('/login', authController.login)


module.exports=router