let indicePregunta = 0;
let puntaje = 10; // Inicializa el puntaje en 10
let preguntas = [];

const botonCompletado = document.getElementById('botonCompletado');
const enlaceCompletado = document.getElementById('enlaceCompletado');
const mensajeEvaluacion = document.getElementById('mensajeEvaluacion');

// Obtener el nombre del archivo actual y extraer el número de la lección
const nombreArchivo = window.location.pathname.split('/').pop(); // Obtiene el nombre del archivo
const idLeccion = parseInt(nombreArchivo.replace('leccion', '')); // Extrae el número de lección

console.log('ID de la lección:', idLeccion);

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
    // Deshabilita el botón de completado y el enlace de completado al inicio
    botonCompletado.disabled = true; // Deshabilita el botón

    // Limpia el contenido anterior
    mensajeEvaluacion.innerHTML = ''; // Limpia cualquier mensaje anterior

    // Verifica el puntaje
    if (puntaje >= 5) {
        console.log('Puntaje actual:', puntaje);
        // Habilitar el botón de completado
        botonCompletado.disabled = false; // Habilita el botón

        // Mostrar mensaje de completado en el lugar correcto
        const mensajeFinal = document.createElement('h2');
        mensajeFinal.innerText = "¡Has completado todas las preguntas!";
        
        // Coloca el mensaje justo después del contenedor del test
        const contenedorTest = document.querySelector('.contenedorTest'); // Asegúrate de que esta clase apunte al contenedor del test
        mensajeEvaluacion.appendChild(mensajeFinal);

    // Obtener el ID de la lección
const pathSegments = window.location.pathname.split('/');
const leccionId = pathSegments[pathSegments.length - 1];

    botonCompletado.addEventListener('click', function() {
        console.log("Id de la leccion "+leccionId)
        // Enviar la solicitud POST a la base de datos
        fetch('/completar-leccion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ leccionId }),
        })
        .then(response => {
            console.log("Estado de la respuesta:", response.status)
            if (response.ok) {
                // Redirigir a la página de lista de lecciones con el parámetro de consulta
                window.location.href = `/lista_lecciones?completada=true`;
            } else {
                alert('Error al guardar la lección completada');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema con la conexión al servidor.');
        });
    });

    } else {
        // Mostrar el mensaje de que se necesita volver a intentar
        const mensajeIntenta = document.createElement('h2');
        mensajeIntenta.innerText = "Necesitas obtener al menos 5 puntos para completar la lección.";
        mensajeEvaluacion.appendChild(mensajeIntenta); // Mantiene el botón en su lugar

        // Crear botón "Inténtalo de nuevo"
        const botonReintentar = document.createElement('button');
        botonReintentar.innerText = "Inténtalo de nuevo";
        botonReintentar.className = "botonReintentar"; // Estilo opcional

        // Agregar evento para reiniciar el test al hacer clic
        botonReintentar.onclick = () => reiniciarTest();

        // Insertar el botón en el contenedor de evaluación
        mensajeEvaluacion.appendChild(botonReintentar);
    }
}


// Función para reiniciar el test
function reiniciarTest() {
    indicePregunta = 0; // Reinicia el índice de preguntas
    puntaje = 10; // Reinicia el puntaje
    document.querySelector('.pregunta').textContent = ''; // Limpia cualquier mensaje
    document.querySelector('.leccionNumero').textContent = `Pregunta 1/${preguntas.length} | Puntaje: ${puntaje}`;
    cargarPregunta(); // Vuelve a cargar la primera pregunta

    // Limpia el contenido de evaluación
    mensajeEvaluacion.innerHTML = ''; // Elimina el mensaje de evaluación
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
                btn.onclick = () => seleccionarOpcion(index);

                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    seleccionarOpcion(index);
                });
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
        // Verifica el puntaje al final
        verificarPuntaje();
    }
}

// Inicia el test cargando las preguntas desde el archivo JSON
cargarPreguntasDesdeJSON();

