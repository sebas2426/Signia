let indicePregunta = 0;
let puntaje = 10; // Inicializa el puntaje en 10
let preguntas = [];
let intentos=1;
let ultimoIntento = new Date().toISOString();
let repitio= false;
let tiempoInicio; 
let tiempoFin;
let tiempoTotalSegundos = 0;

const botonCompletado = document.getElementById('botonCompletado');
const enlaceCompletado = document.getElementById('enlaceCompletado');
const mensajeEvaluacion = document.getElementById('mensajeEvaluacion');

// Detecta si el dispositivo es táctil
const esDispositivoMovil = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Obtener el nombre del archivo actual y extraer el número de la lección
const nombreArchivo = window.location.pathname.split('/').pop();
const idLeccion = parseInt(nombreArchivo.replace('leccion', ''));
// Establece el valor del campo oculto en el formulario
document.getElementById('leccionId').value = idLeccion;

// Función para cargar el archivo JSON con las preguntas
function cargarPreguntasDesdeJSON() {
    fetch('/frontend/scripts/preguntas.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const leccion = data.lecciones.find(leccion => leccion.id === idLeccion);
            if (leccion) {
                preguntas = leccion.preguntas;
                preCargarImagenes(); // Pre-carga las imágenes antes de iniciar las preguntas
            } else {
                console.error("Lección no encontrada.");
            }
        })
        .catch(error => {
            console.error("Error al cargar las preguntas:", error);
        });
}

// Función para pre-cargar las imágenes
function preCargarImagenes() {
    const imagenesParaCargar = preguntas.map(pregunta => pregunta.imagen).filter(imagen => imagen);
    let imagenesCargadas = 0;

    if (imagenesParaCargar.length === 0) {
        cargarPregunta(); // Si no hay imágenes, cargamos la primera pregunta directamente
    }

    imagenesParaCargar.forEach(imagenUrl => {
        const img = new Image();
        img.src = imagenUrl;
        img.onload = () => {
            imagenesCargadas++;
            if (imagenesCargadas === imagenesParaCargar.length) {
                cargarPregunta(); // Una vez que todas las imágenes estén cargadas, mostramos la primera pregunta
            }
        };
        img.onerror = () => {
            console.error("Error al cargar la imagen: " + imagenUrl);
            imagenesCargadas++;
            if (imagenesCargadas === imagenesParaCargar.length) {
                cargarPregunta(); // Si alguna imagen no se carga, seguimos cargando las preguntas
            }
        };
    });
}

// Función para habilitar el botón o mostrar el botón de reintento según el puntaje
function verificarPuntaje() {
    mensajeEvaluacion.innerHTML = ''; // Limpia cualquier mensaje anterior

    if (puntaje >= 5) {
        botonCompletado.disabled = false; // Habilita el botón de completar
        const mensajeFinal = document.createElement('h2');
        mensajeFinal.innerText = "¡Has completado todas las preguntas!";
        mensajeEvaluacion.appendChild(mensajeFinal);
    } else {
        botonCompletado.disabled = true; // Deshabilita el botón si el puntaje es bajo
        const mensajeIntenta = document.createElement('h2');
        mensajeIntenta.innerText = "Necesitas obtener al menos 5 puntos para completar la lección.";
        mensajeEvaluacion.appendChild(mensajeIntenta);

        const botonReintentar = document.createElement('button');
        botonReintentar.innerText = "Inténtalo de nuevo";
        botonReintentar.className = "botonReintentar";
        botonReintentar.onclick = () => reiniciarTest();
        mensajeEvaluacion.appendChild(botonReintentar);
    }
}

function mostrarAlerta(titulo, texto, icono) {
    const isDarkMode = document.body.classList.contains('dark-mode'); // Verifica el modo actual
    return Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        confirmButtonText: 'Aceptar',
        background: isDarkMode ? '#2b2b2b' : '#fff',
        color: isDarkMode ? '#fff' : 'hsl(0,0%,33%)',
        confirmButtonColor: isDarkMode ? 'rgb(69, 100, 121)' : '#7066e0',
        iconColor: isDarkMode ? '#f8bb86' : '#3085d6',
        backdrop: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : ''
    });
}

document.getElementById('formCompletarLeccion').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío por defecto del formulario

    const leccionId = this.leccionId.value;
    tiempoFin = Date.now(); // Marca el tiempo de finalización
    tiempoTotalSegundos = Math.round((tiempoFin - tiempoInicio) / 1000); // Calcula los segundos
    console.log(`Tiempo total: ${tiempoTotalSegundos} segundos`);
    console.log(`Repitio? ${repitio}`);
    console.log(`Cuántos intentos? ${intentos}`);
    ultimoIntento = new Date().toISOString();
    console.log(`Cuál es la fecha de su último intento? ${ultimoIntento}`);
    console.log(`Cuál es el ID de la lección? ${leccionId}`);

    fetch('/completar-leccion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            leccionId: leccionId,
            puntaje: puntaje,
            intentos: intentos,
            tiempoTotalSegundos: tiempoTotalSegundos,
            repitio: repitio,
            ultimoIntento: ultimoIntento
        })
    })
    .then(response => {
        // Manejamos el estado de la respuesta
        if (response.ok) {
            return response.json(); // Si es un 200, parsea a JSON
        }
        return response.json().then(data => {
            throw new Error(data.error || 'Error inesperado en el servidor'); // Manejo de errores
        });
    })
    .then(data => {
        console.log(data); // Log de la respuesta del servidor
        if (data.message) {
            console.log('Mensaje de éxito:', data.message); // Log del mensaje de éxito
            mostrarAlerta('Éxito', data.message, 'success').then(() => {
                let leccionesRequeridas = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, 3, ..., 12]
                let todasCompletadas = leccionesRequeridas.every(leccion => leccionesCompletadas.includes(leccion));
                if(todasCompletadas){
                    localStorage.setItem('leccion13_completada', 'true'); // Guarda en Local Storage
                    window.location.href = '/curso_completado';
                }else{
                    window.location.href = '/lista_lecciones?completada=true';
                }
                
            });
        } else {
            console.error('No se recibió un mensaje de éxito'); // Log si no hay mensaje
        }
    })
    .catch(error => {
        console.error("Error al enviar la lección completada:", error.message);
        mostrarAlerta('Error', error.message, 'error');
    });    
});

// Función para reiniciar el test
function reiniciarTest() {
    repitio=true;
    intentos++;
    indicePregunta = 0;
    puntaje = 10;
    document.querySelector('.pregunta').textContent = '';
    document.querySelector('.leccionNumero').textContent = `Pregunta 1/${preguntas.length} | Puntaje: ${puntaje}`;
    cargarPregunta();
    mensajeEvaluacion.innerHTML = '';
    console.log(`Repitio? ${repitio}`);
    console.log(`Cuántos intentos? ${intentos}`);
    ultimoIntento = new Date().toISOString();
    console.log(`Cuál es la fecha de su último intento? ${ultimoIntento}`);
}

// Función para cargar la pregunta actual
function cargarPregunta() {
    const opcionesBotones = [
        document.getElementById('btn1'),
        document.getElementById('btn2'),
        document.getElementById('btn3'),
        document.getElementById('btn4')
    ];

    opcionesBotones.forEach(btn => btn.style.backgroundColor = ''); // Resetea los botones

    if (preguntas && preguntas.length > 0 && indicePregunta < preguntas.length) {
        const preguntaActual = preguntas[indicePregunta];
        if (!preguntaActual) return; // Verifica que la pregunta exista antes de continuar

        document.getElementById('pregunta').innerText = preguntaActual.pregunta;
        const imagenPregunta = document.querySelector('.imagen');

        if (preguntaActual.imagen) {
            imagenPregunta.src = preguntaActual.imagen;
            imagenPregunta.style.display = 'block';
            setTimeout(() => {
                imagenPregunta.style.opacity = '1';
            }, 20);
        } else {
            imagenPregunta.style.opacity = '0';
            imagenPregunta.style.display = 'none';
        }

        const opcionesContainer = document.querySelectorAll('.botoneS .btn');
        opcionesContainer.forEach((btn, index) => {
            if (preguntaActual.opciones[index]) {
                btn.innerText = preguntaActual.opciones[index];

                // Configuración para eventos según el tipo de dispositivo
                if (esDispositivoMovil) {
                    btn.ontouchstart = (e) => {
                        e.preventDefault();
                        seleccionarOpcion(index);
                    };
                } else {
                    btn.onclick = () => seleccionarOpcion(index);
                }
            } else {
                btn.innerText = '';
                btn.onclick = null;
            }
        });
    } else {
        console.error("No hay preguntas disponibles.");
    }
}

// Función para seleccionar una opción
function seleccionarOpcion(opcionSeleccionada) {
    const preguntaActual = preguntas[indicePregunta];
    if (!preguntaActual) return; // Verifica que la pregunta actual esté definida

    const opcionesBotones = [
        document.getElementById('btn1'),
        document.getElementById('btn2'),
        document.getElementById('btn3'),
        document.getElementById('btn4')
    ];

    if (opcionSeleccionada === preguntaActual.respuestaCorrecta) {
        opcionesBotones[opcionSeleccionada].style.backgroundColor = 'lightgreen';
        document.querySelector('.pregunta').textContent = '¡Correcto!';
    } else {
        opcionesBotones[opcionSeleccionada].style.backgroundColor = 'lightcoral';
        document.querySelector('.pregunta').textContent = 'Incorrecto.';
        opcionesBotones[preguntaActual.respuestaCorrecta].style.backgroundColor = 'lightgreen';
        puntaje = Math.max(0, puntaje - 1); // Evita que el puntaje sea negativo
    }

    setTimeout(() => {
        indicePregunta++;
        if (indicePregunta < preguntas.length) {
            document.querySelector('.leccionNumero').textContent = `Pregunta ${indicePregunta + 1}/${preguntas.length} | Puntaje: ${puntaje}`;
            cargarPregunta();
        } else {
            verificarPuntaje();
        }
    }, 1500);  // Retraso de 1.5 segundos antes de cargar la siguiente pregunta
}

// Inicia cargando las preguntas cuando la página se haya cargado
window.onload = function () {
    tiempoInicio = Date.now(); // Marca el tiempo de inicio
    cargarPreguntasDesdeJSON();
};
