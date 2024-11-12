document.addEventListener("DOMContentLoaded", function () {
    const palabraElemento = document.getElementById("palabra-a-adivinar");
    const imagenAhorcado = document.getElementById("imagen-ahorcado");
    const intentosRestantesElemento = document.getElementById("intentos-restantes-ahorcado");
    const opcionesSeñas = document.getElementById("opciones-señas-ahorcado");
    const mensajeElemento = document.getElementById("mensaje-ahorcado");
    const textoMensaje = document.getElementById("texto-mensaje-ahorcado");
    const botonSiguienteNivel = document.getElementById("boton-siguiente-nivel");
    const botonReintentar = document.getElementById("boton-reintentar");

    const datosLeccion = document.querySelectorAll("#datos-leccion-ahorcado div");
    let intentosRestantes = 6;
    let nivelActual = 0;
    let juegoEnCurso = true;

    // Función para inicializar el nivel
    function iniciarNivel() {
        intentosRestantes = 6;
        intentosRestantesElemento.textContent = intentosRestantes;
        imagenAhorcado.src = `/frontend/images/dias_semana/ahorcado1.png`;
        mensajeElemento.style.display = "none";
        botonSiguienteNivel.style.display = "none";
        botonReintentar.style.display = "none";
        juegoEnCurso = true; // Reiniciar el estado del juego

        const datosActuales = datosLeccion[nivelActual];
        const palabra = datosActuales.getAttribute("data-palabra");
        palabraElemento.textContent = palabra;

        // Limpiar opciones previas
        opcionesSeñas.innerHTML = "";

        // Generar opciones de señas (mezcladas aleatoriamente)
        const opciones = Array.from(datosLeccion);
        opciones.sort(() => Math.random() - 0.5);
        opciones.forEach((opcion) => {
            const img = document.createElement("img");
            img.src = opcion.getAttribute("data-imagen-seña");
            img.alt = opcion.getAttribute("data-palabra");
            img.classList.add("opcion-seña");

            if (opcion.getAttribute("data-palabra") === "VIERNES") {
                img.classList.add("seña-viernes");
            }

            img.addEventListener("click", () => seleccionarOpcion(img.alt, palabra));
            opcionesSeñas.appendChild(img);
        });
    }

    // Función para manejar la selección de una opción
    function seleccionarOpcion(seleccion, palabraCorrecta) {
        if (!juegoEnCurso) return; // Detener si el juego no está en curso

        if (seleccion === palabraCorrecta) {
            mostrarMensaje("¡Correcto!", true);
            juegoEnCurso = false; // Detener el juego si se acierta
        } else {
            intentosRestantes--;
            intentosRestantesElemento.textContent = intentosRestantes;
            imagenAhorcado.src = `/frontend/images/dias_semana/ahorcado${7 - intentosRestantes}.png`;
            if (intentosRestantes <= 0) {
                mostrarMensaje("Inténtalo de nuevo. La palabra correcta era " + palabraCorrecta, false);
                juegoEnCurso = false; // Detener el juego si el puntaje llega a cero
            }
        }
    }

    // Función para mostrar mensaje al ganar o perder
    function mostrarMensaje(texto, esVictoria) {
        textoMensaje.textContent = texto;
        mensajeElemento.style.display = "block";
        if (esVictoria) {
            botonSiguienteNivel.style.display = "inline-block";
        } else {
            botonReintentar.style.display = "inline-block";
        }
    }

    // Eventos para avanzar o reintentar
    botonSiguienteNivel.addEventListener("click", () => {
        nivelActual++;
        if (nivelActual < datosLeccion.length) {
            iniciarNivel();
        } else {
            document.getElementById("mensaje-victoria").style.display = "block";
        }
    });
    botonReintentar.addEventListener("click", iniciarNivel);

    // Inicializar primer nivel
    iniciarNivel();
});
