// Selección de elementos
const cajaCerrada = document.getElementById("caja-cerrada-cajas");
const cajaAbierta = document.getElementById("caja-abierta-cajas");
const mensajeCajas = document.getElementById("mensaje-cajas");
const mesesCajas = document.querySelectorAll(".mes-caja");

let mesActual;
let mesesAcertados = [];  // Array para almacenar los meses acertados
let juegoTerminado = false;  // Flag para controlar si el juego ha terminado

// Función para iniciar una nueva ronda del juego
function iniciarRonda() {
    if (juegoTerminado) {
        return; // Si el juego ha terminado, no hacer nada
    }

    // Oculta todos los contenedores de meses
    mesesCajas.forEach(mesCaja => mesCaja.style.display = "none");

    // Oculta la caja abierta y muestra la caja cerrada
    cajaAbierta.style.display = "none";
    cajaCerrada.style.display = "block";
    
    // Selecciona aleatoriamente un mes que no haya sido acertado aún
    let mesesDisponibles = Array.from(mesesCajas).filter(mesCaja => !mesesAcertados.includes(mesCaja.getAttribute("data-mes")));
    
    // Si todos los meses han sido acertados, finaliza el juego
    if (mesesDisponibles.length === 0) {
        mensajeCajas.textContent = "¡Felicidades! Has acertado todos los meses.";
        mensajeCajas.style.color = "blue";
        juegoTerminado = true;  // Marca que el juego ha terminado
        return;
    }

    // Selecciona un mes disponible aleatoriamente
    mesActual = mesesDisponibles[Math.floor(Math.random() * mesesDisponibles.length)];
    
    // Limpia el mensaje de acierto/error
    mensajeCajas.textContent = "";
}

// Evento para abrir la caja y mostrar la imagen y opciones del mes
cajaCerrada.addEventListener("click", () => {
    if (juegoTerminado) {
        return; // Si el juego ha terminado, no hacer nada
    }

    // Muestra la caja abierta y oculta la caja cerrada
    cajaCerrada.style.display = "none";
    cajaAbierta.style.display = "block";

    // Muestra el mes y sus opciones
    mesActual.style.display = "block";
});

// Evento para verificar la respuesta
mesesCajas.forEach(mesCaja => {
    const opciones = mesCaja.querySelectorAll(".opcion-cajas");
    opciones.forEach(opcion => {
        opcion.addEventListener("click", () => {
            if (juegoTerminado) {
                return; // Si el juego ha terminado, no hacer nada
            }

            const respuestaCorrecta = mesCaja.getAttribute("data-mes");
            if (opcion.textContent === respuestaCorrecta) {
                mensajeCajas.textContent = "¡Correcto!";
                mensajeCajas.style.color = "green";  // Cambia el color del mensaje a verde

                // Añadir el mes a la lista de meses acertados
                mesesAcertados.push(respuestaCorrecta);
            } else {
                mensajeCajas.textContent = "Inténtalo de nuevo.";
                mensajeCajas.style.color = "red";    // Cambia el color del mensaje a rojo
            }
            
            // Reiniciar el juego después de unos segundos
            setTimeout(iniciarRonda, 2000);
        });
    });
});

// Inicia la primera ronda del juego
iniciarRonda();
