// Seleccionamos todos los botones (las imágenes)
const botonesParejas = document.querySelectorAll('.botonParejas');
const espaciosBlancos = document.querySelectorAll('.divBlanco');
const siguienteNivelBtn = document.querySelectorAll('.siguienteNivel2'); // Botones para pasar al siguiente nivel

// Guardamos las posiciones originales de los botones
const posicionesOriginales = new Map();

// Contadores para verificar cuántas parejas correctas se han colocado
let parejasCorrectasNivel1 = 0;
let parejasCorrectasNivel2 = 0;

// Variable para mantener el botón seleccionado por el toque
let botonSeleccionado = null;

// Función para manejar la lógica de selección de botones y colocación en espacios blancos
const manejarToques = () => {
    botonesParejas.forEach(boton => {
        const rect = boton.getBoundingClientRect(); // Obtenemos la posición actual
        posicionesOriginales.set(boton, { top: rect.top, left: rect.left }); // Guardamos la posición

        boton.addEventListener('click', () => {
            // Cuando se toca un botón, lo marcamos como seleccionado
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

                // Verificamos si la pareja es correcta
                if (parejaArrastrada === parejaCorrecta) {
                    // Creamos la animación para mover el botón
                    const espacioRect = espacio.getBoundingClientRect(); // Coordenadas del espacio blanco
                    const botonRect = botonSeleccionado.getBoundingClientRect(); // Coordenadas del botón

                    // Calculamos el movimiento (diferencia entre posiciones)
                    const offsetX = espacioRect.left - botonRect.left;
                    const offsetY = espacioRect.top - botonRect.top;

                    // Aplicamos animación de transición
                    botonSeleccionado.style.transition = 'transform 0.5s ease';
                    botonSeleccionado.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

                    // Después de la animación, colocamos el botón en el espacio blanco
                    setTimeout(() => {
                        espacio.innerHTML = ''; // Limpiamos el contenido del espacio en blanco
                        espacio.appendChild(botonSeleccionado); // Añadimos el botón al espacio
                        botonSeleccionado.style.transform = ''; // Reseteamos la transformación
                        botonSeleccionado.setAttribute('draggable', false); // Deshabilitamos el arrastre
                        botonSeleccionado.style.border = '2px solid green'; // Borde verde para indicar éxito

                        // Verificamos el nivel y sumamos al contador de parejas correctas
                        if (botonSeleccionado.closest('.nivel1')) {
                            parejasCorrectasNivel1++;
                        } else if (botonSeleccionado.closest('.nivel2')) {
                            parejasCorrectasNivel2++;
                        }

                        // Verificamos si todas las parejas están completas para mostrar el botón de siguiente nivel
                        if (parejasCorrectasNivel1 === 3) {
                            siguienteNivelBtn[0].style.display = 'block'; // Muestra el botón para nivel 1
                        } else if (parejasCorrectasNivel2 === 3) {
                            siguienteNivelBtn[1].style.display = 'block'; // Muestra el botón para nivel 2
                        }

                        // Reiniciamos la selección
                        botonSeleccionado = null;
                    }, 500); // Tiempo de la transición (0.5 segundos)

                } else {
                    // Mover el botón a la posición del espacio blanco incorrecto
                    const espacioRect = espacio.getBoundingClientRect();
                    const botonRect = botonSeleccionado.getBoundingClientRect();
                    const offsetX = espacioRect.left - botonRect.left;
                    const offsetY = espacioRect.top - botonRect.top;

                    // Aplicar transición para el movimiento incorrecto
                    botonSeleccionado.style.transition = 'transform 0.5s ease';
                    botonSeleccionado.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

                    // Después de la animación, aplicamos el borde rojo
                    setTimeout(() => {
                        botonSeleccionado.style.border = '2px solid red'; // Borde rojo para indicar error

                        // Después de 1 segundo, el botón regresa a su posición original
                        setTimeout(() => {
                            const originalPosition = posicionesOriginales.get(botonSeleccionado);

                            // Animación para el regreso
                            botonSeleccionado.classList.add('returning');
                            botonSeleccionado.style.transition = 'transform 0.5s ease'; // Añadimos transición
                            botonSeleccionado.style.transform = `translate(${originalPosition.left - botonSeleccionado.getBoundingClientRect().left}px, ${originalPosition.top - botonSeleccionado.getBoundingClientRect().top}px)`;

                            // Después de la transición, regresamos el botón a su lugar original
                            botonSeleccionado.addEventListener('transitionend', () => {
                                botonSeleccionado.style.transform = ''; // Reseteamos el estilo
                                botonSeleccionado.classList.remove('returning');

                                // Lo devolvemos a su contenedor original (fila de botones)
                                const imagenesParejas = botonSeleccionado.closest('.nivel1') ? botonSeleccionado.closest('.nivel1').querySelector('.imagenesParejas') :
                                    botonSeleccionado.closest('.nivel2') ? botonSeleccionado.closest('.nivel2').querySelector('.imagenesParejas') :
                                    botonSeleccionado.closest('.nivel3').querySelector('.imagenesParejas');
                                imagenesParejas.appendChild(botonSeleccionado); // Movemos el botón de vuelta a la fila

                                // Limpiamos el borde rojo del botón después de regresar
                                botonSeleccionado.style.border = '';

                                // Reiniciamos la selección
                                botonSeleccionado = null;
                            }, { once: true });
                        }, 1000); // Esperamos 1 segundo antes de que vuelva
                    }, 500); // Aplicar el borde rojo después de que llegue al div blanco
                }
            }
        });
    });
};

// Inicializamos la lógica de toques
manejarToques();

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
