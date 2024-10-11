// Seleccionamos los botones (las imágenes que se pueden arrastrar)
const botonesParejas = document.querySelectorAll('.botonParejas');

// Seleccionamos los espacios en blanco donde se deben soltar las imágenes
const espaciosBlancos = document.querySelectorAll('.divBlanco');

// Guardamos las posiciones originales de los botones
const posicionesOriginales = new Map();

botonesParejas.forEach(boton => {
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
});

// Permitimos que los divs blancos acepten las imágenes arrastradas
espaciosBlancos.forEach(espacio => {
    espacio.addEventListener('dragover', (event) => {
        event.preventDefault(); // Es necesario para permitir el drop
    });

    espacio.addEventListener('drop', (event) => {
        event.preventDefault();

        const parejaArrastrada = event.dataTransfer.getData('pareja');
        const parejaCorrecta = espacio.getAttribute('data-pareja2');

        const boton = document.querySelector(`.botonParejas[data-pareja2="${parejaArrastrada}"]`);

        // Temporalmente colocamos el botón en el espacio en blanco
        espacio.innerHTML = ''; // Limpiamos el contenido del espacio en blanco
        espacio.appendChild(boton); // Añadimos el botón al espacio

        if (parejaArrastrada === parejaCorrecta) {
            // Si la pareja es correcta, el botón se queda en el espacio
            boton.setAttribute('draggable', false); // Ya no se puede arrastrar
        } else {
            // Si la pareja es incorrecta, después de 1 segundo el botón regresa a su posición original
            setTimeout(() => {
                const originalPosition = posicionesOriginales.get(boton);

                // Creamos una transición suave de regreso
                boton.classList.add('returning');
                boton.style.transform = `translate(${originalPosition.left - boton.getBoundingClientRect().left}px, ${originalPosition.top - boton.getBoundingClientRect().top}px)`;

                // Después de la transición, movemos el botón de vuelta a la fila original
                boton.addEventListener('transitionend', () => {
                    boton.style.transform = ''; // Reseteamos el estilo
                    boton.classList.remove('returning');

                    // Volvemos a colocar el botón en su contenedor original (la fila de botones)
                    const imagenesParejas = document.querySelector('.imagenesParejas');
                    imagenesParejas.appendChild(boton); // Movemos el botón de vuelta a la fila
                }, { once: true });
            }, 1000); // Esperamos 1 segundo antes de que vuelva
        }
    });
});


