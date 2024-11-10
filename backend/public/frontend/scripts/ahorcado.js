// Variables globales
let datosLeccion = [];
let datosPalabraActual;
let letrasAdivinadas = [];
let errores = 0;
const maxIntentos = 6;
const maxNiveles = 4; // Límite de niveles

// Variable para seguir el nivel actual
let nivelActual = 1;

// Función para cargar la lección y comenzar el juego
function cargarLeccion() {
    const contenedorLeccion = document.getElementById("datos-leccion-ahorcado");
    const elementosLeccion = Array.from(contenedorLeccion.children);

    datosLeccion = elementosLeccion.map(elemento => ({
        palabra: elemento.getAttribute("data-palabra"),
        imagenSeña: elemento.getAttribute("data-imagen-seña")
    }));

    iniciarJuego();
}

// Función para iniciar el juego con una nueva palabra
function iniciarJuego() {
    if (nivelActual > maxNiveles) {
        mostrarMensajeVictoria();
        return;
    }

    // Filtramos las palabras según el nivel actual (puedes ajustarlo a tu lógica de lecciones)
    datosPalabraActual = datosLeccion[Math.floor(Math.random() * datosLeccion.length)];
    letrasAdivinadas = [];
    errores = 0;

    document.getElementById("imagen-seña-ahorcado").src = datosPalabraActual.imagenSeña;
    actualizarPantallaJuego();
    ocultarMensaje();
}

// Función para actualizar la pantalla del juego
function actualizarPantallaJuego() {
    const palabraMostrada = datosPalabraActual.palabra
        .split("")
        .map(letra => (letrasAdivinadas.includes(letra) ? letra : "_"))
        .join(" ");
    
    document.getElementById("palabra-mostrada-ahorcado").textContent = palabraMostrada;
    document.getElementById("imagen-ahorcado").src = `/frontend/images/dias_semana/ahorcado${errores + 1}.png`;
    document.getElementById("intentos-restantes-ahorcado").textContent = maxIntentos - errores;

    if (palabraMostrada.replace(/ /g, "") === datosPalabraActual.palabra) {
        mostrarMensaje("¡Ganaste! Pasemos a la siguiente palabra.", true);
    } else if (errores >= maxIntentos) {
        mostrarMensaje(`Perdiste. La palabra era: ${datosPalabraActual.palabra}`, false);
    }
}

// Función para generar el teclado de letras
function generarTeclado() {
    const contenedorTeclado = document.getElementById("teclado-ahorcado");
    contenedorTeclado.innerHTML = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letra => {
        const boton = document.createElement("button");
        boton.textContent = letra;
        boton.classList.add("boton-letra");
        boton.addEventListener("click", () => adivinarLetra(letra));
        contenedorTeclado.appendChild(boton);
    });
}

// Función para manejar el intento de adivinar una letra
function adivinarLetra(letra) {
    // Evita continuar si el juego ya terminó
    if (errores >= maxIntentos || letrasAdivinadas.includes(letra)) {
        return;
    }

    letrasAdivinadas.push(letra);
    
    if (!datosPalabraActual.palabra.includes(letra)) {
        errores++;
    }

    actualizarPantallaJuego();
}

// Función para mostrar el mensaje personalizado en pantalla
function mostrarMensaje(mensaje, esVictoria) {
    const mensajeElemento = document.getElementById("mensaje-ahorcado");
    const textoMensaje = document.getElementById("texto-mensaje-ahorcado");
    const botonSiguienteNivel = document.getElementById("boton-siguiente-nivel");
    const botonReintentar = document.getElementById("boton-reintentar");

    textoMensaje.textContent = mensaje;
    mensajeElemento.style.display = "flex";

    if (esVictoria) {
        // Si se gana un nivel, permitir pasar al siguiente
        botonSiguienteNivel.style.display = "inline-block";
        botonReintentar.style.display = "none";
    } else {
        // Si se pierde, mostrar el botón de reintentar
        botonSiguienteNivel.style.display = "none";
        botonReintentar.style.display = "inline-block";
    }
}

// Función para ocultar el mensaje de la pantalla
function ocultarMensaje() {
    const mensajeElemento = document.getElementById("mensaje-ahorcado");
    mensajeElemento.style.display = "none";
}

// Función para pasar a la siguiente palabra
function siguientePalabra() {
    if (nivelActual >= maxNiveles) {
        mostrarMensajeVictoria();
        return;
    }

    nivelActual++;  // Incrementamos el nivel

    iniciarJuego();  // Iniciamos el siguiente nivel
}

// Función para reiniciar el juego
function reiniciarJuego() {
    nivelActual = 1;  // Reiniciamos al primer nivel
    iniciarJuego();  // Comenzamos de nuevo
}

// Función para mostrar el mensaje de victoria
function mostrarMensajeVictoria() {
    const mensajeVictoria = document.getElementById("mensaje-victoria");
    mensajeVictoria.style.display = "block"; // Mostramos el mensaje de victoria

    // Ocultamos los botones de siguiente nivel y reintentar
    document.getElementById("mensaje-ahorcado").style.display = "none";
    document.getElementById("boton-siguiente-nivel").style.display = "none";
    document.getElementById("boton-reintentar").style.display = "none";
}

// Eventos para los botones en el mensaje
document.getElementById("boton-siguiente-nivel").addEventListener("click", () => {
    siguientePalabra();
    ocultarMensaje();
});

document.getElementById("boton-reintentar").addEventListener("click", () => {
    reiniciarJuego();
    ocultarMensaje();
});

// Iniciar el juego al cargar la lección
document.addEventListener("DOMContentLoaded", () => {
    cargarLeccion();
    generarTeclado();  // Generamos el teclado al inicio
});

