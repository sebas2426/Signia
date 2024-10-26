const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')
const cookieParser = require('cookie-parser')

// Procedimiento para registrarse
exports.login = async (req, res) => {
    try {
        const name = req.body.name;
        const user = req.body.user;
        const pass = req.body.pass;
        let passHash = await bcryptjs.hash(pass, 8);

        if (!user || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon: "info",
                showConfirmButton: true,
                timer: false,
                user: req.user || null,
                ruta: 'login'
            });
        } else {
            // Verificar si el usuario ya existe
            conexion.query('SELECT * FROM users WHERE username = $1', [user], (error, results) => {
                if (error) {
                    console.error(error);
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Error en la base de datos" + error.message,
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        user: req.user || null,
                        ruta: 'login'
                    });
                } else if (results.rowCount > 0) {
                    // Si el usuario ya existe
                    res.render('login', {
                        alert: true,
                        alertTitle: "Advertencia",
                        alertMessage: "El nombre de usuario ya está en uso",
                        alertIcon: "info",
                        showConfirmButton: true,
                        timer: false,
                        user: req.user || null,
                        ruta: 'login'
                    });
                } else {
                    // Registro OK
                    conexion.query('INSERT INTO users (username, name, pass) VALUES ($1, $2, $3)', { user: user, name: name, pass: passHash }, (error, results) => {
                        if (error) {
                            console.log(error);
                            res.render('login', {
                                alert: true,
                                alertTitle: "Error",
                                alertMessage: "Error al crear la cuenta",
                                alertIcon: "error",
                                showConfirmButton: true,
                                timer: false,
                                user: req.user || null,
                                ruta: 'login'
                            });
                        } else {
                            res.render('login', {
                                alert: true,
                                alertTitle: "Operación exitosa",
                                alertMessage: "Cuenta creada exitosamente",
                                alertIcon: "success",
                                showConfirmButton: true,
                                timer: false,
                                user: req.user || null,
                                ruta: 'acceder'
                            });
                        }
                    });
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};


exports.acceder = async (req, res)=>{
    try {
       const user = req.body.user
        const pass = req.body.pass
        
        if(!user || !pass){
            res.render('acceder', {
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon: "info",
                showConfirmButton: true,
                timer:false,
                user: req.user || null,
                ruta: 'acceder'
            })
        }else{
            conexion.query('SELECT * FROM users WHERE username = ?', [user], async (error, results) =>{
                if(results.length == 0 || ! (await bcryptjs.compare(pass,results[0].pass))){
                    res.render('acceder', {
                        alert:true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectos",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer:false,
                        user: req.user || null,
                        ruta: 'acceder'
                    })
                }else{
                    //inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    
                    console.log(`TOKEN ${token} para el usuario ${user}`)
                    const cookiesOptions = {
                        expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    req.user = results[0]
                    return res.redirect('/lista_lecciones') 
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.logout = (req,res)=>{
    res.clearCookie('jwt')
    return res.redirect('/')
}
