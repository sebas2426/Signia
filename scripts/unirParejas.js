// Seleccionamos todos los botones (las imágenes que se pueden arrastrar)
const botonesParejas = document.querySelectorAll('.botonParejas');
const espaciosBlancos = document.querySelectorAll('.divBlanco');
const siguienteNivelBtn = document.querySelectorAll('.siguienteNivel2'); // Botones para pasar al siguiente nivel

// Guardamos las posiciones originales de los botones
const posicionesOriginales = new Map();

// Contadores para verificar cuántas parejas correctas se han colocado
let parejasCorrectasNivel1 = 0;
let parejasCorrectasNivel2 = 0;

// Función para manejar la lógica de arrastre
const manejarBoton = (boton) => {
    const rect = boton.getBoundingClientRect(); // Obtenemos la posición actual
    posicionesOriginales.set(boton, { top: rect.top, left: rect.left }); // Guardamos la posición

    boton.setAttribute('draggable', true);

    // Evento que se dispara cuando se comienza a arrastrar
    boton.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('pareja', boton.getAttribute('data-pareja2'));
        boton.classList.add('dragging');
    });

    // Evento que se dispara cuando el arrastre termina
    boton.addEventListener('dragend', (event) => {
        boton.classList.remove('dragging');
    });
};

// Función para manejar la lógica de arrastre en los espacios en blanco
const manejarArrastre = (espacio, nivel) => {
    espacio.addEventListener('dragover', (event) => {
        event.preventDefault(); // Es necesario para permitir el drop
    });

    espacio.addEventListener('drop', (event) => {
        event.preventDefault();

        const parejaArrastrada = event.dataTransfer.getData('pareja');
        const parejaCorrecta = espacio.getAttribute('data-pareja2');

        const boton = document.querySelector(`.botonParejas[data-pareja2="${parejaArrastrada}"]`);

        // Verificamos si el botón y el espacio son válidos
        if (boton) {
            // Temporalmente colocamos el botón en el espacio en blanco
            espacio.innerHTML = ''; // Limpiamos el contenido del espacio en blanco
            espacio.appendChild(boton); // Añadimos el botón al espacio

            if (parejaArrastrada === parejaCorrecta) {
                // Si la pareja es correcta, el botón se queda en el espacio
                boton.setAttribute('draggable', false); // Ya no se puede arrastrar

                // Cambiamos el borde del contenedor blanco a verde
                espacio.style.border = '2px solid green';

                // Incrementamos el contador de parejas correctas según el nivel
                if (nivel === 1) {
                    parejasCorrectasNivel1++;
                } else if (nivel === 2) {
                    parejasCorrectasNivel2++;
                }

                // Comprobamos si todos los botones están en su lugar en el nivel actual
                const espaciosEnNivelActual = espacio.closest('.nivel1') || espacio.closest('.nivel2') || espacio.closest('.nivel3');
                const espaciosBlancosActuales = espaciosEnNivelActual.querySelectorAll('.divBlanco');

                if (nivel === 1 && parejasCorrectasNivel1 === 3) { // Cambia el número según cuántas parejas hay en nivel 1
                    siguienteNivelBtn[0].style.display = 'block'; // Muestra el botón para nivel 1
                } else if (nivel === 2 && parejasCorrectasNivel2 === 3) { // Cambia el número según cuántas parejas hay en nivel 2
                    siguienteNivelBtn[1].style.display = 'block'; // Muestra el botón para nivel 2
                }
            } else {
                // Si la pareja es incorrecta, cambiamos el borde a rojo
                espacio.style.border = '2px solid red';

                // Después de 1 segundo, el botón regresa a su posición original
                setTimeout(() => {
                    const originalPosition = posicionesOriginales.get(boton);

                    // Creamos una transición suave de regreso
                    boton.classList.add('returning');
                    boton.style.transition = 'transform 0.5s ease'; // Añadir transición para suavizar el movimiento
                    boton.style.transform = `translate(${originalPosition.left - boton.getBoundingClientRect().left}px, ${originalPosition.top - boton.getBoundingClientRect().top}px)`;

                    // Después de la transición, movemos el botón de vuelta a la fila original
                    boton.addEventListener('transitionend', () => {
                        boton.style.transform = ''; // Reseteamos el estilo
                        boton.classList.remove('returning');

                        // Volvemos a colocar el botón en su contenedor original (la fila de botones)
                        const imagenesParejas = espacio.closest('.nivel1') ? espacio.closest('.nivel1').querySelector('.imagenesParejas') :
                            espacio.closest('.nivel2') ? espacio.closest('.nivel2').querySelector('.imagenesParejas') :
                            espacio.closest('.nivel3').querySelector('.imagenesParejas');
                        imagenesParejas.appendChild(boton); // Movemos el botón de vuelta a la fila

                        // Limpiamos el espacio en blanco que quedó vacío
                        espacio.innerHTML = ''; // Limpiamos el contenido del espacio en blanco
                        espacio.style.border = ''; // Restauramos el borde después de 1 segundo
                    }, { once: true });
                }, 1000); // Esperamos 1 segundo antes de que vuelva
            }
        }
    });
};

// Llamamos a la función para los botones de todos los niveles
botonesParejas.forEach(manejarBoton);

// Llamamos a la función para los espacios en blanco de todos los niveles
const espaciosNivel1 = document.querySelectorAll('.nivel1 .divBlanco');
const espaciosNivel2 = document.querySelectorAll('.nivel2 .divBlanco');
const espaciosNivel3 = document.querySelectorAll('.nivel3 .divBlanco');

espaciosNivel1.forEach(espacio => manejarArrastre(espacio, 1)); // Nivel 1
espaciosNivel2.forEach(espacio => manejarArrastre(espacio, 2)); // Nivel 2
espaciosNivel3.forEach(espacio => manejarArrastre(espacio, 3)); // Nivel 3

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

        // Reseteamos el contador de parejas correctas para el siguiente nivel
        if (nivelActual.classList.contains('nivel1')) {
            parejasCorrectasNivel1 = 0; // Resetea el contador de nivel 1
        } else if (nivelActual.classList.contains('nivel2')) {
            parejasCorrectasNivel2 = 0; // Resetea el contador de nivel 2
        }
    });
});
