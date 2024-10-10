let indicePregunta = 0;
let puntaje = 10; // Inicializa el puntaje en 10
let preguntas = [];

// Obtener el nombre del archivo actual y extraer el número de la lección
const nombreArchivo = window.location.pathname.split('/').pop(); // Obtiene el nombre del archivo
const idLeccion = parseInt(nombreArchivo.replace('leccion', '').replace('.html', '')); // Extrae el número de lección

// Función para cargar el archivo JSON con las preguntas
function cargarPreguntasDesdeJSON() {
    console.log("CARGANDOOO para lección:", idLeccion);
    fetch('../scripts/preguntas.json') // Ruta del archivo JSON
        .then(response => {
            console.log("Respuesta del servidor:", response);
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Filtrar preguntas de la lección correspondiente
            const leccion = data.lecciones.find(leccion => leccion.id === idLeccion);
            if (leccion) {
                preguntas = leccion.preguntas;
                console.log("Preguntas cargadas:", preguntas); // Verifica que se estén cargando
                cargarPregunta(); // Una vez cargado, inicia la primera pregunta
            } else {
                console.error("Lección no encontrada.");
            }
        })
        .catch(error => {
            console.error("Error al cargar las preguntas:", error);
        });
}

// Función para cargar la pregunta actual
function cargarPregunta() {
    // Limpiar colores de botones antes de cargar una nueva pregunta
    const opcionesBotones = [
        document.getElementById('btn1'),
        document.getElementById('btn2'),
        document.getElementById('btn3'),
        document.getElementById('btn4')
    ];
    
    // Reiniciar los colores de fondo de los botones
    opcionesBotones.forEach(btn => {
        btn.style.backgroundColor = ''; // Resetea el color de fondo
    });

    if (preguntas && preguntas.length > 0 && indicePregunta < preguntas.length) {
        const preguntaActual = preguntas[indicePregunta]; // Accede a la pregunta según el índice

        // Muestra la pregunta en el HTML
        document.getElementById('pregunta').innerText = preguntaActual.pregunta;

        const imagenPregunta = document.querySelector('.imagen'); // Cambia a tu selector adecuado
        if (preguntaActual.imagen) {
            imagenPregunta.src = preguntaActual.imagen;
            imagenPregunta.style.display = 'block'; // Mostrar la imagen
            setTimeout(() => {
                imagenPregunta.style.opacity = '1'; // Aparecer
            }, 50); // Retraso de 0 para que el cambio de opacidad se aplique
        } else {
            imagenPregunta.style.opacity = '0'; // Desvanecer
                imagenPregunta.style.display = 'none'; // Ocultar después de la transición
        }

        // Limpia las opciones anteriores
        const opcionesContainer = document.querySelectorAll('.botoneS .btn');
        opcionesContainer.forEach((btn, index) => {
            if (preguntaActual.opciones[index]) {
                btn.innerText = preguntaActual.opciones[index];
                btn.onclick = () => {
                    seleccionarOpcion(index); // Llama a la función con el índice de la opción seleccionada
                };
            } else {
                btn.innerText = ''; // Limpia si no hay más opciones
                btn.onclick = null; // Limpia el evento click
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

    // Incrementar el índice y cargar la siguiente pregunta
    indicePregunta++;
    if (indicePregunta < preguntas.length) {
        setTimeout(() => {
            cargarPregunta(); // Cargar la siguiente pregunta después de un tiempo
        }, 2000); // Espera 2 segundos antes de mostrar la siguiente pregunta
    } else {
        const contenedorEvaluacion = document.querySelector('.contenedorEvaluacion');
        const mensajeFinal = document.createElement('h2');
        mensajeFinal.textContent = '¡Has completado las preguntas!';
        contenedorEvaluacion.insertBefore(mensajeFinal, document.querySelector('.contenedorBotonesFinales'));
    }
}

// Inicia el test cargando las preguntas desde el archivo JSON
cargarPreguntasDesdeJSON();
