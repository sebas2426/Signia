let indicePregunta = 0;
let puntaje = 10; // Inicializa el puntaje en 10
let preguntas = [];

const botonCompletado = document.getElementById('botonCompletado');
const enlaceCompletado = document.getElementById('enlaceCompletado');
const mensajeEvaluacion = document.getElementById('mensajeEvaluacion');

// Detecta si el dispositivo es táctil
const esDispositivoMovil = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Obtener el nombre del archivo actual y extraer el número de la lección
const nombreArchivo = window.location.pathname.split('/').pop(); // Obtiene el nombre del archivo
const idLeccion = parseInt(nombreArchivo.replace('leccion', '')); // Extrae el número de lección

// Función para cargar el archivo JSON con las preguntas
function cargarPreguntasDesdeJSON() {
    fetch('/frontend/scripts/preguntas.json') // Ruta del archivo JSON
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
                cargarPregunta(); // Inicia con la primera pregunta
            } else {
                console.error("Lección no encontrada.");
            }
        })
        .catch(error => {
            console.error("Error al cargar las preguntas:", error);
        });
}

// Función para habilitar el botón o mostrar el botón de reintento según el puntaje
function verificarPuntaje() {
    botonCompletado.disabled = puntaje < 5;
    mensajeEvaluacion.innerHTML = ''; // Limpia cualquier mensaje anterior

    if (puntaje >= 5) {
        const mensajeFinal = document.createElement('h2');
        mensajeFinal.innerText = "¡Has completado todas las preguntas!";
        mensajeEvaluacion.appendChild(mensajeFinal);
    } else {
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

botonCompletado.addEventListener('click', function() {
    const pathSegments = window.location.pathname.split('/');
    const leccionId = pathSegments[pathSegments.length - 1];
    console.log("Leccion Id antes del fetch " + leccionId);

    // Realizar el fetch para completar la lección
    fetch('/completar-leccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leccionId }),
    })
    .then(response => {
        // Procesar la respuesta como JSON
        return response.json().then(data => ({ status: response.ok, data }));
    })
    .then(({ status }) => {
        // Redirigir a lista_lecciones si la inserción fue exitosa o si la respuesta falló pero los datos se enviaron correctamente
        if (status.ok) {
            window.location.href = `/lista_lecciones?completada=true`;
        } else {
            alert('Error al guardar la lección completada');
            // No redirigir aquí porque hubo un error en la respuesta
        }
    })
    .catch(error => {
        if(data.message==='Lección completada'){
            window.location.href = `/lista_lecciones?completada=true`;
        }
        console.error('Error:', error);
    });
});




// Función para reiniciar el test
function reiniciarTest() {
    indicePregunta = 0;
    puntaje = 10;
    document.querySelector('.pregunta').textContent = '';
    document.querySelector('.leccionNumero').textContent = `Pregunta 1/${preguntas.length} | Puntaje: ${puntaje}`;
    cargarPregunta();
    mensajeEvaluacion.innerHTML = '';
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
            }, 50);
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
        puntaje--;
    }

    document.querySelector('.leccionNumero').textContent = `Pregunta ${indicePregunta + 1}/${preguntas.length} | Puntaje: ${puntaje}`;

    indicePregunta++;
    if (indicePregunta < preguntas.length) {
        setTimeout(() => cargarPregunta(), 2000);
    } else {
        verificarPuntaje();
    }
}

// Inicia el test cargando las preguntas desde el archivo JSON
cargarPreguntasDesdeJSON();
