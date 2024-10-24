const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");
const toggleButton = document.getElementById('toggle-dark-mode');
const icon = document.querySelector('#iconNightSun'); // Define el icono aquí

// Mostrar el menú
abrir.addEventListener("click", () => {
    nav.classList.add("visible");
});

// Ocultar el menú
cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
});

// Al cargar la página, verifica si el modo oscuro está activado
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    icon.classList.remove('bi-moon-fill'); // Cambia el icono al sol
    icon.classList.add('bi-brightness-high-fill');
    icon.style.color='white';
}else{
    icon.style.color='';
}

// Función para alternar entre los modos y los iconos
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('bi-moon-fill'); // Elimina el icono de la luna
        icon.classList.add('bi-brightness-high-fill'); // Añade el icono del sol
        icon.style.color='white';
        localStorage.setItem('darkMode', 'enabled'); // Guarda el estado del modo oscuro
    } else {
        icon.classList.remove('bi-brightness-high-fill'); // Elimina el icono del sol
        icon.classList.add('bi-moon-fill'); // Añade el icono de la luna
        icon.style.color='';
        localStorage.setItem('darkMode', 'disabled'); // Guarda el estado del modo claro
    }
});

