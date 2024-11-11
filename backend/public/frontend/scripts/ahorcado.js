// Variables globales
let datosLeccionAhorcado = [];
let datosPalabraActualAhorcado;
let letrasAdivinadasAhorcado = [];
let erroresAhorcado = 0;
const maxIntentosAhorcado = 6;
const maxNivelesAhorcado = 4; // Límite de niveles

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

    datosPalabraActualAhorcado = datosLeccionAhorcado[Math.floor(Math.random() * datosLeccionAhorcado.length)];
    letrasAdivinadasAhorcado = [];
    erroresAhorcado = 0;

    document.getElementById("imagen-seña-ahorcado").src = datosPalabraActualAhorcado.imagenSeña;
    actualizarPantallaJuegoAhorcado();
    ocultarMensajeAhorcado();
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

// Función para generar el teclado de letras
function generarTecladoAhorcado() {
    const contenedorTecladoAhorcado = document.getElementById("teclado-ahorcado");
    contenedorTecladoAhorcado.innerHTML = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letra => {
        const botonAhorcado = document.createElement("button");
        botonAhorcado.textContent = letra;
        botonAhorcado.classList.add("boton-letra");
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
    iniciarJuegoAhorcado();
}

// Función para reiniciar el juego
function reiniciarJuegoAhorcado() {
    nivelActualAhorcado = 1;
    iniciarJuegoAhorcado();
}

// Función para mostrar el mensaje de victoria
function mostrarMensajeVictoriaAhorcado() {
    const mensajeVictoriaAhorcado = document.getElementById("mensaje-victoria");
    mensajeVictoriaAhorcado.style.display = "block";

    document.getElementById("mensaje-ahorcado").style.display = "none";
    document.getElementById("boton-siguiente-nivel").style.display = "none";
    document.getElementById("boton-reintentar").style.display = "none";
}

// Eventos para los botones en el mensaje
document.getElementById("boton-siguiente-nivel").addEventListener("click", () => {
    siguientePalabraAhorcado();
    ocultarMensajeAhorcado();
});

document.getElementById("boton-reintentar").addEventListener("click", () => {
    reiniciarJuegoAhorcado();
    ocultarMensajeAhorcado();
});

// Iniciar el juego al cargar la lección
document.addEventListener("DOMContentLoaded", () => {
    cargarLeccionAhorcado();
    generarTecladoAhorcado();
});

