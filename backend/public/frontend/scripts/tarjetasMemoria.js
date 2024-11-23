const btnNivelSiguiente = document.getElementById('nivelSiguiente');
let primeraTarjeta = null;
let segundaTarjeta = null;
let tableroBloqueado = false;
let nivelActual = 1;
let aciertosRequeridos = 3;
let aciertos = 0;
let tiempoInicioTarjetasMemoria = 0;
let tiempoTranscurrido = 0; // Guardar el tiempo transcurrido en segundos
let tiempoIntervalo = null; // Intervalo para el contador
let repeticionesTarjetasMemoria = 0; // Inicializar esta variable normalmente
let repitioTarjetasMemoria=false;
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

mezclarTarjetasSenas();

function voltearTarjeta() {
    if (!tiempoInicioTarjetasMemoria) {
        tiempoInicioTarjetasMemoria = Date.now();
        iniciarContador(); // Iniciar el contador de tiempo cuando se voltea la primera tarjeta
    }

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
        const resultado = document.getElementById('resultado');
        if (nivelActual === 3) {
            // Mensaje de victoria final
            resultado.textContent = `¡Felicidades! Has completado el juego. Lo repetiste ${repeticionesTarjetasMemoria} veces. Y cada intento te llevo ${calcularTiempo()} segundos.`;
            document.getElementById('reiniciarJuego').style.display = 'block'; // Mostrar botón de reinicio

            // Guardar el tiempo del intento en el array de tiempos
            datosJuegos.tiemposIntentosJuegos.push(tiempoTranscurrido);
            // Almacenar la cantidad final de repeticiones en el array de repeticiones
            datosJuegos.repeticionesJuegos.push(repeticionesTarjetasMemoria);
            // Registrar si se repitió el juego
            datosJuegos.repitioJuegos.push(repitioTarjetasMemoria);

            console.log('Los tiempos para cada intento son '+ datosJuegos.tiemposIntentosJuegos);
            console.log('El numero de repeticiones es '+ datosJuegos.repeticionesJuegos);
            console.log('Repitió? '+ datosJuegos.repitioJuegos);

            detenerContador(); // Detener el contador cuando el juego se complete
        } else {
            resultado.textContent = '¡Nivel completado! Presiona el botón para continuar.';
        }
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

// Función para calcular el tiempo en segundos
function calcularTiempo() {
    return tiempoTranscurrido;
}

// Función para iniciar el contador
function iniciarContador() {
    if (!tiempoIntervalo) {
        tiempoIntervalo = setInterval(actualizarContador, 1000); // Llama a la función actualizarContador cada segundo
    }
}

// Función para actualizar el contador de tiempo
function actualizarContador() {
    tiempoTranscurrido++; // Incrementa el contador cada segundo
}

// Función para detener el contador
function detenerContador() {
    clearInterval(tiempoIntervalo); // Detiene el intervalo
    tiempoIntervalo = null;
}

/*CAMBIAR DE NIVEL*/
document.getElementById('nivelSiguiente').addEventListener('click', function () {
    if (nivelActual === 1) {
        cambiarNivel('.nivel-1', '.nivel-2', 2, 4, 'Ir al nivel 3');
    } else if (nivelActual === 2) {
        cambiarNivel('.nivel-2', '.nivel-3', 3, 5, 'Completar el juego');
    } else if (nivelActual === 3) {
        // Si ya se completó el nivel 3, ocultar el botón
        btnNivelSiguiente.style.display = 'none';
    }
});

function cambiarNivel(claseActual, claseSiguiente, nuevoNivel, nuevosAciertosRequeridos, textoBoton) {
    let nivelActualTarjetas = document.querySelectorAll(claseActual);
    let nivelSiguienteTarjetas = document.querySelectorAll(claseSiguiente);

    // Cambiar visualmente de nivel
    nivelActualTarjetas.forEach(el => el.style.display = 'none');
    nivelSiguienteTarjetas.forEach(el => el.style.display = 'flex');

    // Actualizar las variables del nivel
    nivelActual = nuevoNivel;
    aciertosRequeridos = nuevosAciertosRequeridos;
    aciertos = 0;
    document.getElementById('resultado').textContent = ''; // Limpiar el mensaje anterior
    this.textContent = textoBoton;

    // Si es el último nivel, oculta el botón
    if (nuevoNivel === 3) {
        btnNivelSiguiente.style.display = 'none';
    }
}

/* REINICIAR EL JUEGO */
document.getElementById('reiniciarJuego').addEventListener('click', function () {
    nivelActual = 1;
    aciertos = 0;
    aciertosRequeridos = 3;
    repeticionesTarjetasMemoria++; // Solo aumentar la variable
    repitioTarjetasMemoria = true;
    tiempoTranscurrido = 0; // Resetear el tiempo
    tiempoInicioTarjetasMemoria = 0; // Resetear el tiempo de inicio
    mezclarTarjetasSenas(); // Reordenar las tarjetas

    // Restaurar todas las tarjetas al estado inicial
    todasLasTarjetas.forEach(tarjeta => {
        tarjeta.classList.remove('volteada'); // Quitar la clase volteada
        tarjeta.addEventListener('click', voltearTarjeta); // Reactivar el evento click
    });

    // Restaurar la visibilidad de los niveles
    document.querySelectorAll('.nivel-2, .nivel-3').forEach(nivel => (nivel.style.display = 'none'));
    document.querySelectorAll('.nivel-1').forEach(nivel => (nivel.style.display = 'flex'));

    // Resetear el mensaje y los botones
    document.getElementById('resultado').textContent = '';
    document.getElementById('nivelSiguiente').style.display = 'block';
    this.style.display = 'none'; // Ocultar el botón de reinicio

    // No borrar los tiempos de intentos previos
});
