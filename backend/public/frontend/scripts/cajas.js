// Selección de elementos
const cajaCerrada = document.getElementById("caja-cerrada-cajas");
const cajaAbierta = document.getElementById("caja-abierta-cajas");
const mensajeCajas = document.getElementById("mensaje-cajas");
const mesesCajas = document.querySelectorAll(".mes-caja");
const botonReiniciar = document.getElementById("reiniciarJuegoCajas");

let mesActual;
let mesesAcertados = []; // Array para almacenar los meses acertados
let juegoTerminado = false; // Flag para controlar si el juego ha terminado

// Propiedades de tiempo y repeticiones
let tiempoInicioCajas = 0; // Tiempo de inicio del juego
let tiempoTranscurridoCajas = 0; // Tiempo transcurrido
let repeticionesCajas = 0; // Número de repeticiones
let repitioCajas = false; // Indica si se ha repetido el juego
let tiempoIntervaloCajas = null; // Intervalo para actualizar el tiempo

// Función para iniciar una nueva partida completa
function iniciarJuego() {
    // Reinicia las variables principales
    mesesAcertados = [];
    juegoTerminado = false;

    // Marca el inicio del tiempo del juego
    tiempoInicioCajas = Date.now();

    // Limpia cualquier intervalo previo
    if (tiempoIntervaloCajas) {
        clearInterval(tiempoIntervaloCajas);
    }

    // Inicia un intervalo para calcular el tiempo transcurrido
    tiempoIntervaloCajas = setInterval(() => {
        tiempoTranscurridoCajas = Math.floor((Date.now() - tiempoInicioCajas) / 1000);
    }, 1000);

    // Oculta el botón de reinicio si está visible
    botonReiniciar.style.display = "none";

    // Inicia la primera ronda
    iniciarRonda();
}

// Función para iniciar una nueva ronda del juego
function iniciarRonda() {
    if (juegoTerminado) {
        return; // Si el juego ha terminado, no hacer nada
    }

    // Oculta todos los contenedores de meses
    mesesCajas.forEach((mesCaja) => (mesCaja.style.display = "none"));

    // Oculta la caja abierta y muestra la caja cerrada
    cajaAbierta.style.display = "none";
    cajaCerrada.style.display = "block";

    // Selecciona aleatoriamente un mes que no haya sido acertado aún
    let mesesDisponibles = Array.from(mesesCajas).filter(
        (mesCaja) => !mesesAcertados.includes(mesCaja.getAttribute("data-mes"))
    );

    // Si todos los meses han sido acertados, finaliza el juego
    if (mesesDisponibles.length === 0) {
        clearInterval(tiempoIntervaloCajas); // Detiene el intervalo
        mensajeCajas.textContent = `¡Felicidades! Has acertado todas las opciones`;
        mensajeCajas.style.color = "blue";
        juegoTerminado = true; // Marca que el juego ha terminado
       /* console.log(
            `repeticiones: ${repeticionesCajas}  tiempo: ${tiempoTranscurridoCajas} segundos  repitio?: ${repitioCajas}`
        );*/
        registrarDatosJuego(4, repeticionesAhorcado, tiempoTranscurridoAhorcado, repitioAhorcado);
        console.log(datosJuegos)
        // Mostrar el botón de reinicio
        botonReiniciar.style.display = "block";

        return;
    }

    // Selecciona un mes disponible aleatoriamente
    mesActual = mesesDisponibles[Math.floor(Math.random() * mesesDisponibles.length)];

    // Limpia el mensaje de acierto/error
    mensajeCajas.textContent = "";
}

// Evento para abrir la caja y mostrar la imagen y opciones del mes
cajaCerrada.addEventListener("click", () => {
    if (juegoTerminado) {
        return; // Si el juego ha terminado, no hacer nada
    }

    // Muestra la caja abierta y oculta la caja cerrada
    cajaCerrada.style.display = "none";
    cajaAbierta.style.display = "block";

    // Muestra el mes y sus opciones
    mesActual.style.display = "block";
});

// Evento para verificar la respuesta
mesesCajas.forEach((mesCaja) => {
    const opciones = mesCaja.querySelectorAll(".opcion-cajas");
    opciones.forEach((opcion) => {
        opcion.addEventListener("click", () => {
            if (juegoTerminado) {
                return; // Si el juego ha terminado, no hacer nada
            }

            const respuestaCorrecta = mesCaja.getAttribute("data-mes");
            if (opcion.textContent === respuestaCorrecta) {
                mensajeCajas.textContent = "¡Correcto!";
                mensajeCajas.style.color = "green"; // Cambia el color del mensaje a verde

                // Añadir el mes a la lista de meses acertados
                mesesAcertados.push(respuestaCorrecta);
            } else {
                mensajeCajas.textContent = "Inténtalo de nuevo.";
                mensajeCajas.style.color = "red"; // Cambia el color del mensaje a rojo
            }

            // Avanzar a la siguiente ronda después de unos segundos
            setTimeout(iniciarRonda, 2000);
        });
    });
});

// Evento para reiniciar el juego
botonReiniciar.addEventListener("click", () => {
    // Incrementar las repeticiones del juego
    repeticionesCajas++;
    // Reiniciar todas las variables excepto repeticionesCajas
    mesesAcertados = [];
    juegoTerminado = false;
    tiempoInicioCajas = 0;
    tiempoTranscurridoCajas = 0;
    repitioCajas = true;

    // Ocultar el botón de reinicio
    botonReiniciar.style.display = "none";

    // Reiniciar el juego
    iniciarJuego();
});

// Inicia el juego al cargar la página
iniciarJuego();

