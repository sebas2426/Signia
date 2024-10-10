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


