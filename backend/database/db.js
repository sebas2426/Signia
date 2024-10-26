const { Pool } = require('pg');

// Crea un nuevo pool de conexiones
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false // Configuración para aceptar el certificado auto-firmado
    }
});

pool.connect((error) => {
    if (error) {
        console.log("El error de conexión es: " + error);
    } else {
        console.log("La conexión a la base de datos es exitosa :)");
    }
});

// Exportar el pool para usarlo en otras partes de la aplicación
module.exports = pool;
