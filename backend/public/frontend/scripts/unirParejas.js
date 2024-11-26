// Variables globales para el tiempo y repeticiones
let tiempoInicioParejas = 0;
let tiempoTranscurridoParejas = 0;
let tiempoIntervaloParejas = null; // Intervalo para el contador
let repeticionesParejas = 0; // Cantidad de repeticiones
let repitioParejas = false;

// Función para iniciar el contador
function iniciarContadorParejas() {
    if (!tiempoIntervaloParejas) {
        tiempoIntervaloParejas = setInterval(actualizarContadorParejas, 1000);
    }
}

// Función para actualizar el contador de tiempo
function actualizarContadorParejas() {
    tiempoTranscurridoParejas++;
}

// Función para detener el contador
function detenerContadorParejas() {
    clearInterval(tiempoIntervaloParejas);
    tiempoIntervaloParejas = null;
}

// Función para calcular el tiempo transcurrido
function calcularTiempoParejas() {
    return tiempoTranscurridoParejas;
}

// Seleccionamos todos los botones (las imágenes)
const botonesParejas = document.querySelectorAll('.botonParejas');
const espaciosBlancos = document.querySelectorAll('.divBlanco');
const siguienteNivelBtn = document.querySelectorAll('.siguienteNivel2'); // Botones para pasar al siguiente nivel
const contenedorJuego = document.querySelector('.contenedorJuego'); // Contenedor principal del juego

// Guardamos las posiciones originales de los botones
const posicionesOriginales = new Map();

// Contadores para verificar cuántas parejas correctas se han colocado
let parejasCorrectasNivel1 = 0;
let parejasCorrectasNivel2 = 0;
let parejasCorrectasNivel3 = 0;


// Variable para mantener el botón seleccionado por el toque
let botonSeleccionado = null;

// Función para manejar la lógica de selección de botones y colocación en espacios blancos
const manejarToques = () => {
    botonesParejas.forEach(boton => {
        const rect = boton.getBoundingClientRect(); // Obtenemos la posición actual
        posicionesOriginales.set(boton, { top: rect.top, left: rect.left }); // Guardamos la posición

        boton.addEventListener('click', () => {
            if (!tiempoInicioParejas) {
                tiempoInicioParejas = Date.now(); // Marcamos el tiempo de inicio
                iniciarContadorParejas(); // Iniciar el contador de tiempo
            }

            if (botonSeleccionado) {
                botonSeleccionado.classList.remove('selected'); // Deseleccionar si ya hay uno seleccionado
            }
            botonSeleccionado = boton;
            botonSeleccionado.classList.add('selected'); // Aplicamos efecto visual
        });
    });

    espaciosBlancos.forEach(espacio => {
        espacio.addEventListener('click', () => {
            if (botonSeleccionado) {
                const parejaCorrecta = espacio.getAttribute('data-pareja2');
                const parejaArrastrada = botonSeleccionado.getAttribute('data-pareja2');

                // Quitamos el fondo azul (la clase 'selected') antes de mover la imagen
                botonSeleccionado.classList.remove('selected');

                if (parejaArrastrada === parejaCorrecta) {
                    const espacioRect = espacio.getBoundingClientRect();
                    const botonRect = botonSeleccionado.getBoundingClientRect();
                    const offsetX = espacioRect.left - botonRect.left;
                    const offsetY = espacioRect.top - botonRect.top;

                    botonSeleccionado.style.transition = 'transform 0.5s ease';
                    botonSeleccionado.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

                    setTimeout(() => {
                        espacio.innerHTML = '';
                        espacio.appendChild(botonSeleccionado);
                        botonSeleccionado.style.transform = '';
                        botonSeleccionado.setAttribute('draggable', false);
                        botonSeleccionado.style.border = '2px solid green';

                        if (botonSeleccionado.closest('.nivel1')) {
                            parejasCorrectasNivel1++;
                        } else if (botonSeleccionado.closest('.nivel2')) {
                            parejasCorrectasNivel2++;
                        } else if (botonSeleccionado.closest('.nivel3')) {
                            parejasCorrectasNivel3++;
                        }
                        

                        if (parejasCorrectasNivel1 === 3) {
                            siguienteNivelBtn[0].style.display = 'block';
                        } 
                        if (parejasCorrectasNivel2 === 3) {
                            siguienteNivelBtn[1].style.display = 'block';
                        }

                        if (
                            parejasCorrectasNivel1 === 3 &&
                            parejasCorrectasNivel2 === 3 &&
                            parejasCorrectasNivel3 === 4
                        ) {

                            registrarDatosJuego(1, repeticionesParejas, tiempoTranscurridoParejas, repitioParejas); // Para el segundo juego
                            detenerContadorParejas();
                            mostrarVictoria();
                        }                        

                        botonSeleccionado = null;
                    }, 500);
                } else {
                    const espacioRect = espacio.getBoundingClientRect();
                    const botonRect = botonSeleccionado.getBoundingClientRect();
                    const offsetX = espacioRect.left - botonRect.left;
                    const offsetY = espacioRect.top - botonRect.top;

                    botonSeleccionado.style.transition = 'transform 0.5s ease';
                    botonSeleccionado.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

                    setTimeout(() => {
                        botonSeleccionado.style.border = '2px solid red';
                        setTimeout(() => {
                            const originalPos = posicionesOriginales.get(botonSeleccionado);
                            botonSeleccionado.style.transition = '';
                            botonSeleccionado.style.transform = '';
                            botonSeleccionado.style.left = `${originalPos.left}px`;
                            botonSeleccionado.style.top = `${originalPos.top}px`;
                        }, 1000);
                    }, 500);
                }
            }
        });
    });
};

// Mostrar mensaje de victoria y datos en consola
function mostrarVictoria() {
    // Mostrar mensaje de victoria en el contenedor mensajeVictoria
    const mensajeVictoria = document.createElement('p');
    mensajeVictoria.textContent = `¡Felicidades! Has completado el juego en ${calcularTiempoParejas()} segundos con ${repeticionesParejas} repeticiones.`;
    mensajeVictoria.style.textAlign = 'center';
    mensajeVictoria.style.fontSize = '1.5em';
    mensajeVictoria.style.color = 'green';
    const contenedorVictoria = document.querySelector('.mensajeVictoria');
    contenedorVictoria.innerHTML = ''; // Limpiar cualquier contenido anterior
    contenedorVictoria.appendChild(mensajeVictoria);
    document.getElementById('reiniciarJuegoParejas').style.display = 'block'; // Mostrar botón de reinicio
}

// Lógica para el botón de siguiente nivel
siguienteNivelBtn.forEach(btn => {
    btn.style.display = 'none'; // Escondemos el botón al iniciar
    btn.addEventListener('click', () => {
        // Ocultamos el nivel actual (nivel 1, 2 o 3)
        const nivelActual = btn.closest('.nivel1') || btn.closest('.nivel2') || btn.closest('.nivel3');
        nivelActual.style.display = 'none';

        // Mostramos el siguiente nivel
        const siguienteNivel = nivelActual.nextElementSibling;
        siguienteNivel.style.display = 'block';
    });
});
// Escuchar el evento de clic en el botón de reiniciar
document.getElementById('reiniciarJuegoParejas').addEventListener('click', function () {
    // Resetear el nivel actual
    let nivelActual = 1;

    // Restaurar la visibilidad de los niveles
    document.querySelectorAll('.nivel-1, .nivel-2, .nivel-3').forEach(nivel => nivel.style.display = 'none');
    document.querySelector(`.nivel${nivelActual}`).style.display = 'flex'; // Mostrar el nivel 1 al inicio

    // Restaurar los botones y las parejas
    document.querySelectorAll('.botonParejas').forEach(boton => {
        // Quitar posibles clases de selección o estados anteriores
        boton.disabled = false; // Habilitar los botones de nuevo
        boton.classList.remove('seleccionado'); // Eliminar cualquier clase de estilo
    });

    // Restaurar los divs blancos a su estado inicial
    document.querySelectorAll('.divBlanco').forEach(divBlanco => {
        divBlanco.classList.remove('ocupado'); // Eliminar clase que indica que ya fue seleccionado
        divBlanco.innerHTML = ''; // Limpiar cualquier imagen que esté dentro
    });

    // Ocultar el mensaje de victoria
    document.querySelector('.mensajeVictoria').style.display = 'none';

    // Mostrar el botón de reiniciar si está oculto
    this.style.display = 'none'; // Ocultar el botón de reiniciar
    document.getElementById('siguienteNivel2').style.display = 'none'; // Asegurar que no esté visible al reiniciar

    // Aquí puedes restablecer cualquier otra variable o estado del juego si es necesario
});



// Llamamos a la función para activar los eventos
document.addEventListener('DOMContentLoaded', () => {
    manejarToques(); // Llama a tu función principal
});

