// Variables globales
let datosLeccionAhorcado = [];
let datosPalabraActualAhorcado;
let letrasAdivinadasAhorcado = [];
let erroresAhorcado = 0;
const maxIntentosAhorcado = 6;
const maxNivelesAhorcado = 4;
const mensajeVictoriaAhorcado = document.getElementById("mensaje-victoria-ahorcado");

// Propiedades de tiempo y repeticiones
let tiempoInicioAhorcado = 0;
let tiempoTranscurridoAhorcado = 0;
let tiempoIntervaloAhorcado = null;
let repeticionesAhorcado = 0;
let repitioAhorcado = false;

// Variable para seguir el nivel actual
let nivelActualAhorcado = 1;

// Función para cargar la lección y comenzar el juego
function cargarLeccionAhorcado() {
    const contenedorLeccionAhorcado = document.getElementById("datos-leccion-ahorcado");
    const elementosLeccionAhorcado = Array.from(contenedorLeccionAhorcado.children);

    datosLeccionAhorcado = elementosLeccionAhorcado.map(elemento => ({
        palabra: elemento.getAttribute("data-palabra"),
        imagenSeña: elemento.getAttribute("data-imagen-seña")
    }));

    iniciarJuegoAhorcado();
}

// Función para iniciar el juego con una nueva palabra
function iniciarJuegoAhorcado() {
    if (nivelActualAhorcado > maxNivelesAhorcado) {
        mostrarMensajeVictoriaAhorcado();
        return;
    }

    // Iniciar el tiempo
    tiempoInicioAhorcado = Date.now();
    if (tiempoIntervaloAhorcado !== null) {
        clearInterval(tiempoIntervaloAhorcado);
    }

    tiempoIntervaloAhorcado = setInterval(actualizarTiempoAhorcado, 1000); // Actualizar cada segundo

    datosPalabraActualAhorcado = datosLeccionAhorcado[Math.floor(Math.random() * datosLeccionAhorcado.length)];
    letrasAdivinadasAhorcado = [];
    erroresAhorcado = 0;

    document.getElementById("imagen-seña-ahorcado").src = datosPalabraActualAhorcado.imagenSeña;
    actualizarPantallaJuegoAhorcado();
    ocultarMensajeAhorcado();
}

// Función para actualizar el tiempo transcurrido
function actualizarTiempoAhorcado() {
    tiempoTranscurridoAhorcado = Math.floor((Date.now() - tiempoInicioAhorcado) / 1000); // en segundos
}

// Función para actualizar la pantalla del juego
function actualizarPantallaJuegoAhorcado() {
    const palabraMostradaAhorcado = datosPalabraActualAhorcado.palabra
        .split("")
        .map(letra => (letrasAdivinadasAhorcado.includes(letra) ? letra : "_"))
        .join(" ");
    
    document.getElementById("palabra-mostrada-ahorcado").textContent = palabraMostradaAhorcado;
    document.getElementById("imagen-ahorcado").src = `/frontend/images/dias_semana/ahorcado${erroresAhorcado + 1}.png`;
    document.getElementById("intentos-restantes-ahorcado").textContent = maxIntentosAhorcado - erroresAhorcado;

    if (palabraMostradaAhorcado.replace(/ /g, "") === datosPalabraActualAhorcado.palabra) {
        mostrarMensajeAhorcado("¡Ganaste! Pasemos a la siguiente palabra.", true);
    } else if (erroresAhorcado >= maxIntentosAhorcado) {
        mostrarMensajeAhorcado(`Perdiste. La palabra era: ${datosPalabraActualAhorcado.palabra}`, false);
    }
}

// Función para generar el teclado de letras con imágenes en lugar de texto
function generarTecladoAhorcado() {
    const contenedorTecladoAhorcado = document.getElementById("teclado-ahorcado");
    contenedorTecladoAhorcado.innerHTML = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letra => {
        const botonAhorcado = document.createElement("button");
        botonAhorcado.classList.add("boton-letra");
        
        // Cambia el texto por la imagen de fondo correspondiente
        botonAhorcado.style.backgroundImage = `url('/frontend/images/abecedario/imagenes-media/${letra}-transformed.png')`;
        botonAhorcado.style.backgroundSize = "cover"; // Asegura que la imagen cubra el botón
        botonAhorcado.style.width = "90px"; // Ajusta el tamaño del botón según sea necesario
        botonAhorcado.style.height = "90px";
        
        // Añade el evento de click para adivinar la letra
        botonAhorcado.addEventListener("click", () => adivinarLetraAhorcado(letra));
        contenedorTecladoAhorcado.appendChild(botonAhorcado);
    });
}

// Función para manejar el intento de adivinar una letra
function adivinarLetraAhorcado(letra) {
    if (erroresAhorcado >= maxIntentosAhorcado || letrasAdivinadasAhorcado.includes(letra)) {
        return;
    }

    letrasAdivinadasAhorcado.push(letra);
    
    if (!datosPalabraActualAhorcado.palabra.includes(letra)) {
        erroresAhorcado++;
    }

    actualizarPantallaJuegoAhorcado();
}

// Función para mostrar el mensaje personalizado en pantalla
function mostrarMensajeAhorcado(mensaje, esVictoria) {
    const mensajeElementoAhorcado = document.getElementById("mensaje-ahorcado");
    const textoMensajeAhorcado = document.getElementById("texto-mensaje-ahorcado");
    const botonSiguienteNivelAhorcado = document.getElementById("boton-siguiente-nivel");
    const botonReintentarAhorcado = document.getElementById("boton-reintentar");

    textoMensajeAhorcado.textContent = mensaje;
    mensajeElementoAhorcado.style.display = "flex";

    if (esVictoria) {
        botonSiguienteNivelAhorcado.style.display = "inline-block";
        botonReintentarAhorcado.style.display = "none";
    } else {
        botonSiguienteNivelAhorcado.style.display = "none";
        botonReintentarAhorcado.style.display = "inline-block";
    }
}

// Función para ocultar el mensaje de la pantalla
function ocultarMensajeAhorcado() {
    const mensajeElementoAhorcado = document.getElementById("mensaje-ahorcado");
    mensajeElementoAhorcado.style.display = "none";
}

// Función para pasar a la siguiente palabra
function siguientePalabraAhorcado() {
    if (nivelActualAhorcado >= maxNivelesAhorcado) {
        mostrarMensajeVictoriaAhorcado();
        return;
    }

    nivelActualAhorcado++;  
    repitioAhorcado = true;
    iniciarJuegoAhorcado();
}

// Función para mostrar el mensaje de victoria
function mostrarMensajeVictoriaAhorcado() {
    mensajeVictoriaAhorcado.style.display = "block";
    registrarDatosJuego(3, repeticionesAhorcado, tiempoTranscurridoAhorcado, repitioAhorcado);
    console.log(datosJuegos);
    /*console.log(`repeticiones: ${repeticionesAhorcado}  tiempo: ${tiempoTranscurridoAhorcado}  repitio?: ${repitioAhorcado}`);*/
    document.getElementById("mensaje-ahorcado").style.display = "none";
    document.getElementById("boton-siguiente-nivel").style.display = "none";
    document.getElementById("boton-reintentar").style.display = "none";
    document.getElementById("reiniciarJuegoAhorcado").style.display = "block";
}

function reiniciarJuegoAhorcado() {
    // Restablecer todas las variables
    repeticionesAhorcado++;
    nivelActualAhorcado = 1;
    repitioAhorcado = false;
    letrasAdivinadasAhorcado = []; // Reiniciar las letras adivinadas
    erroresAhorcado = 0; // Reiniciar los errores
    tiempoTranscurridoAhorcado = 0; // Reiniciar el tiempo
    mensajeVictoriaAhorcado.style.display = "none";
    if (tiempoIntervaloAhorcado !== null) {
        clearInterval(tiempoIntervaloAhorcado); // Detener el intervalo
    }
    
    // Restablecer la imagen del ahorcado y la palabra mostrada
    document.getElementById("imagen-ahorcado").src = "/frontend/images/dias_semana/ahorcado1.png"; // Imagen del ahorcado en el primer estado
    document.getElementById("palabra-mostrada-ahorcado").textContent = ""; // Restablecer la palabra mostrada

    // Llamar a la función que comienza el juego desde el nivel 1
    iniciarJuegoAhorcado();
    
    // Mostrar el botón para reiniciar el juego
    document.getElementById("reiniciarJuegoAhorcado").style.display = "none"; // Asegurarse de que el botón de reiniciar esté oculto al empezar un nuevo juego
}

// Eventos para los botones en el mensaje
document.getElementById("boton-siguiente-nivel").addEventListener("click", () => {
    siguientePalabraAhorcado();
    ocultarMensajeAhorcado();
});

document.getElementById("reiniciarJuegoAhorcado").addEventListener("click", () => {
    reiniciarJuegoAhorcado();
    ocultarMensajeAhorcado();
});

// Iniciar el juego al cargar la lección
document.addEventListener("DOMContentLoaded", () => {
    cargarLeccionAhorcado();
    generarTecladoAhorcado();
});
