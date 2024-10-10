const nav= document.querySelector("#nav")
const abrir= document.querySelector("#abrir")
const cerrar= document.querySelector("#cerrar")

abrir.addEventListener("click", () =>{
    nav.classList.add("visible");
})

cerrar.addEventListener("click",() =>{
    nav.classList.remove("visible");
})

/*TARJETAS DE MEMORIA*/

let primeraTarjeta = null;
let segundaTarjeta = null;
let tableroBloqueado = false;
let nivelActual = 1;
let aciertosRequeridos = 3;
let aciertos = 0;

// Seleccionamos solo las tarjetas con señas
const tarjetasSenas = Array.from(document.querySelectorAll('.tarjeta-senas'));
const todasLasTarjetas = Array.from(document.querySelectorAll('.tarjeta'));

// Función para mezclar solo las tarjetas con señas
function mezclarTarjetasSenas() {
    tarjetasSenas.forEach(tarjeta => {
        const posicionAleatoria = Math.floor(Math.random() * tarjetasSenas.length);
        tarjeta.style.order = posicionAleatoria;
    });
}

// Añadir los event listeners para voltear a todas las tarjetas
todasLasTarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', voltearTarjeta);
});

mezclarTarjetasSenas(); // Mezcla las tarjetas de señas al cargar la página

function voltearTarjeta() {
    if (tableroBloqueado) return;
    if (this === primeraTarjeta) return;

    this.classList.add('volteada');

    if (!primeraTarjeta) {
        primeraTarjeta = this;
        return;
    }

    segundaTarjeta = this;

    comprobarPareja();
}

function comprobarPareja() {
    const esPareja = primeraTarjeta.dataset.pareja === segundaTarjeta.dataset.pareja;

    esPareja ? desactivarTarjetas() : desvoltearTarjetas();
}

function desactivarTarjetas() {
    primeraTarjeta.removeEventListener('click', voltearTarjeta);
    segundaTarjeta.removeEventListener('click', voltearTarjeta);

    reiniciarTablero();
    aciertos++;

    if (aciertos === aciertosRequeridos) {
        const resultado=document.getElementById('resultado');
        resultado.textContent = '¡Felicidades! Has encontrado todas las parejas.';
        resultado.classList.add('mostrar');
    }

}

function desvoltearTarjetas() {
    tableroBloqueado = true;

    setTimeout(() => {
        primeraTarjeta.classList.remove('volteada');
        segundaTarjeta.classList.remove('volteada');

        reiniciarTablero();
    }, 1000);
}

function reiniciarTablero() {
    [primeraTarjeta, segundaTarjeta] = [null, null];
    tableroBloqueado = false;
}

/*CAMBIAR DE NIVEL*/
document.getElementById('nivelSiguiente').addEventListener('click', function () {
    if (nivelActual === 1) {
        let nivel1 = document.querySelectorAll('.nivel-1');
        let nivel2 = document.querySelectorAll('.nivel-2');

        // Cambiar de nivel 1 a nivel 2
        nivel1.forEach(el => el.style.display = 'none');
        nivel2.forEach(el => el.style.display = 'flex');

        nivelActual = 2;
        aciertosRequeridos = 4; // Para el nivel 2 se necesitan 4 aciertos
        aciertos = 0;
        resultado.textContent = ''; // Borrar mensaje de victoria
        this.textContent = 'Ir al nivel 3'; // Cambiar texto del botón
    } else if (nivelActual === 2) {
        let nivel2 = document.querySelectorAll('.nivel-2');
        let nivel3 = document.querySelectorAll('.nivel-3');

        // Cambiar de nivel 2 a nivel 3
        nivel2.forEach(el => el.style.display = 'none');
        nivel3.forEach(el => el.style.display = 'flex');

        nivelActual = 3;
        aciertosRequeridos = 5;
        aciertos = 0;
        resultado.textContent = '';
        this.style.display = 'none';
    }});


/*EVALUACION*/
const preguntas = [
    {
        pregunta: "¿Qué es el abecedario dactilológico?",
        opciones: ["Un sistema para representar números", "Un sistema de escritura visual", "Un sistema de signos manuales para representar letras del abecedario", "Un sistema de signos para expresar emociones"],
        respuestaCorrecta: 2,
        imagen: null
    },
    {
        pregunta: "¿Cuál es la principal función del abecedario dactilológico?",
        opciones: ["Expresar palabras completas en lenguaje de señas", "Deletrear nombres y palabras que no tienen un signo específico", "Hacer gestos con las manos", "Contar números"],
        respuestaCorrecta: 1,
        imagen: null
    },
    {
        pregunta: "¿A qué letra del abecedario corresponde este signo?",
        opciones: ["T", "X", "A", "M"],
        respuestaCorrecta: 0,
        imagen: "../images/abecedario/T.png"
    },
    {
        pregunta: "¿Todas las letras del abecedario dactilológico se pueden hacer con una mano?",
        opciones: ["No", "La F y la H usan las dos manos", "Sí", "Todas las letras usan las dos manos"],
        respuestaCorrecta: 2,
        imagen: null
    },
    {
        pregunta: "¿A qué letra del abecedario corresponde este signo?",
        opciones: ["T", "X", "A", "M"],
        respuestaCorrecta: 2,
        imagen: "../images/abecedario/A.png"
    },
    {
        pregunta: "¿A qué letra del abecedario corresponde este signo?",
        opciones: ["W", "K", "P", "E"],
        respuestaCorrecta: 3,
        imagen: "../images/abecedario/E.png" 
    },
    {
        pregunta: "¿A qué letra del abecedario corresponde este signo?",
        opciones: ["I", "C", "F", "D"],
        respuestaCorrecta: 2,
        imagen: "../images/abecedario/F.png" 
    },
    {
        pregunta: "¿A qué letra del abecedario corresponde este signo?",
        opciones: ["U", "G", "N", "L"],
        respuestaCorrecta: 0,
        imagen: "../images/abecedario/U.png"
    },
    {
        pregunta: "¿A qué letra del abecedario corresponde este signo?",
        opciones: ["Q", "F", "T", "L"],
        respuestaCorrecta: 3,
        imagen: "../images/abecedario/L.png"
    },
    {
        pregunta: "¿A qué letra del abecedario corresponde este signo?",
        opciones: ["Z", "R", "O", "E"],
        respuestaCorrecta: 0,
        imagen: "../images/abecedario/R.png" 
    }
];

let indicePregunta = 0;
let puntaje = 10; // Inicializa el puntaje en 10

// Función para cargar la pregunta
function cargarPregunta() {
    const preguntaActual = preguntas[indicePregunta];
    const contenedorEvaluacion = document.querySelector('.contenedorEvaluacion');
    const imagenElemento = document.querySelector('.imagen');

    // Elemento de la pregunta
    const contenedorPregunta = document.querySelector('.pregunta');

    // Si no es la primera pregunta, aplicar el efecto fade out
    if (indicePregunta > 0) {
        contenedorPregunta.style.opacity = 0; // Comienza en 0 para el efecto fade out

        // Espera a que termine el fade out antes de cambiar la pregunta
        setTimeout(() => {
            // Actualiza el texto de la pregunta
            contenedorPregunta.textContent = preguntaActual.pregunta;

            // Actualiza las opciones de respuesta
            const opcionesBotones = [
                document.getElementById('btn1'),
                document.getElementById('btn2'),
                document.getElementById('btn3'),
                document.getElementById('btn4')
            ];

            opcionesBotones.forEach((boton, index) => {
                boton.textContent = preguntaActual.opciones[index];
                boton.onclick = () => seleccionarOpcion(index);
                boton.style.backgroundColor = ''; // Resetea el color del botón al cargar una nueva pregunta
            });

            // Actualiza el número de lección y el puntaje
            document.querySelector('.leccionNumero').textContent = `Pregunta ${indicePregunta + 1}/${preguntas.length} | Puntaje: ${puntaje}`;

            // Verifica si hay una imagen y la muestra de manera suave
            const imagenElemento = document.querySelector('.imagen');
            if (preguntaActual.imagen) {
                imagenElemento.src = preguntaActual.imagen;
                imagenElemento.style.display = 'block'; // Mostrar la imagen si está disponible

                // Aplicar el efecto de fade-in (transición suave)
                setTimeout(() => {
                    imagenElemento.style.opacity = 1; // Gradualmente hacer visible la imagen
                }, 50); // Espera un pequeño tiempo antes de cambiar la opacidad
            } else {
                imagenElemento.style.display = 'none'; // Ocultar la imagen si no está disponible
                imagenElemento.style.opacity = 0; // Reinicia la opacidad para la próxima imagen
                contenedorEvaluacion.classList.remove('conImagen');
                contenedorEvaluacion.classList.add('sinImagen');
            }
    

            // Aplicar efecto fade-in a la pregunta
            setTimeout(() => {
                contenedorPregunta.style.opacity = 1; // Gradualmente hacer visible la pregunta
            }, 50); // Espera un pequeño tiempo antes de cambiar la opacidad
        }, 1000); // Esperar 1 segundo para el efecto fade out
    } else {
        // Si es la primera pregunta, cargarla directamente sin efecto
        contenedorPregunta.textContent = preguntaActual.pregunta;

        // Actualiza las opciones de respuesta
        const opcionesBotones = [
            document.getElementById('btn1'),
            document.getElementById('btn2'),
            document.getElementById('btn3'),
            document.getElementById('btn4')
        ];

        opcionesBotones.forEach((boton, index) => {
            boton.textContent = preguntaActual.opciones[index];
            boton.onclick = () => seleccionarOpcion(index);
            boton.style.backgroundColor = ''; // Resetea el color del botón al cargar una nueva pregunta
        });

        // Actualiza el número de lección y el puntaje
        document.querySelector('.leccionNumero').textContent = `Pregunta ${indicePregunta + 1}/${preguntas.length} | Puntaje: ${puntaje}`;

        // Verifica si hay una imagen y la muestra de manera suave
        const imagenElemento = document.querySelector('.imagen');
        if (preguntaActual.imagen) {
            imagenElemento.src = preguntaActual.imagen;
            imagenElemento.style.display = 'block'; // Mostrar la imagen si está disponible

            // Aplicar el efecto de fade-in (transición suave)
            setTimeout(() => {
                imagenElemento.style.opacity = 1; // Gradualmente hacer visible la imagen
            }, 50); // Espera un pequeño tiempo antes de cambiar la opacidad
        } else {
            imagenElemento.style.display = 'none'; // Ocultar la imagen si no está disponible
            imagenElemento.style.opacity = 0; // Reinicia la opacidad para la próxima imagen
        }
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
        opcionesBotones[opcionSeleccionada].style.backgroundColor = 'lightgreen'; // Verde para correcto
        document.querySelector('.pregunta').textContent = '¡Correcto!';
    } else {
        opcionesBotones[opcionSeleccionada].style.backgroundColor = 'lightcoral'; // Rojo para incorrecto
        document.querySelector('.pregunta').textContent = 'Incorrecto.';

        // Resalta el botón de la respuesta correcta
        opcionesBotones[preguntaActual.respuestaCorrecta].style.backgroundColor = 'lightgreen'; // Verde para correcto

        // Reduce el puntaje en 1 por respuesta incorrecta
        puntaje--;
    }

    // Actualiza el puntaje
    document.querySelector('.leccionNumero').textContent = `Pregunta ${indicePregunta + 1}/${preguntas.length} | Puntaje: ${puntaje}`;

    // Avanzar a la siguiente pregunta
    indicePregunta++;
    if (indicePregunta < preguntas.length) {
        setTimeout(() => {
            cargarPregunta();
        }, 2000); // Esperar 2 segundos antes de cargar la siguiente pregunta
    } else {
        // Crear el mensaje final
        const contenedorEvaluacion = document.querySelector('.contenedorEvaluacion');
        const mensajeFinal = document.createElement('h2');
        mensajeFinal.textContent = '¡Has completado las preguntas!';
    
        // Insertar el mensaje antes de los botones finales
        const botonFinal= document.querySelector('.contenedorBotonesFinales'); // Asegúrate de tener una clase o identificador específico para los botones
        contenedorEvaluacion.insertBefore(mensajeFinal, botonFinal);
    }
}

// Cargar la primera pregunta al inicio
cargarPregunta();
