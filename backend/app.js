const express= require('express')
const dotenv= require('dotenv')
const cookieParser= require('cookie-parser')
const path= require('path')

const app= express()

//setear el motor de plantillas
app.set('view engine', 'ejs')

//setear el front
app.use(express.static(path.join(__dirname, '../frontend')));

//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//setear las variables de entorno
dotenv.config({path:'./env/.env'})

//setear las cookies
//app.use(cookieParser)

//llamar al router
app.use('/', require('./routers/router'))


app.listen(3000, ()=>{
    console.log("SERVER UP running in http://localhost:3000")
})