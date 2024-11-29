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
        let tipo_usuario= 'A';
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
                    conexion.query('INSERT INTO users (username, name, user_pass, tipo_usuario) VALUES ($1, $2, $3, $4)', [user, name, passHash, tipo_usuario], (error, results) => {
                        if (error) {
                            console.error(error);
                            res.render('login', {
                                alert: true,
                                alertTitle: "Error",
                                alertMessage: "Error al crear la cuenta" + error.message,
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


exports.acceder = async (req, res) => {
    try {
        const user = req.body.user;
        const pass = req.body.pass;
        const tipoUsuario = req.body.tipoUsuario;  // Capturamos el tipo de usuario seleccionado

        if (!user || !pass || !tipoUsuario) {
            return res.render('acceder', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario, contraseña y tipo de usuario",
                alertIcon: "info",
                showConfirmButton: true,
                timer: false,
                user: req.user || null,
                ruta: 'acceder'
            });
        } else {
            // Realizar la consulta en la base de datos para verificar el usuario
            conexion.query('SELECT * FROM users WHERE username = $1', [user], async (error, results) => {
                if (error) {
                    console.error("Error en la consulta de usuario:", error);
                    return res.render('acceder', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Hubo un error al verificar el usuario",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        user: req.user || null,
                        ruta: 'acceder'
                    });
                }

                // Validar si el usuario no existe o la contraseña es incorrecta
                if (results.rows.length === 0 || !(await bcryptjs.compare(pass, results.rows[0].user_pass))) {
                    return res.render('acceder', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectos",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        user: req.user || null,
                        ruta: 'acceder'
                    });
                }

                // Verificar si el tipo de usuario coincide con el tipo de la base de datos
                const tipoUsuarioEnDB = results.rows[0].tipo_usuario;  // Suponemos que el campo en la base de datos es `tipo_usuario`

                if (tipoUsuario !== tipoUsuarioEnDB) {
                    return res.render('acceder', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "El tipo de usuario es incorrecto",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        user: req.user || null,
                        ruta: 'acceder'
                    });
                }

                // Si la validación es exitosa
                const id = results.rows[0].id;
                const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                    expiresIn: process.env.JWT_TIEMPO_EXPIRA
                });

                const cookiesOptions = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 1000),
                    httpOnly: true
                };
                res.cookie('jwt', token, cookiesOptions);
                req.user = results.rows[0];
                return res.redirect('/lista_lecciones');
            });
        }
    } catch (error) {
        console.error("Error en el acceso: " + error);
    }
};

exports.logout = (req,res)=>{
    res.clearCookie('jwt')
    return res.redirect('/')
}
