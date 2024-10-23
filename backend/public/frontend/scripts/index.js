const nav= document.querySelector("#nav")
const abrir= document.querySelector("#abrir")
const cerrar= document.querySelector("#cerrar")
const toggleButton = document.getElementById('toggle-dark-mode');

abrir.addEventListener("click", () =>{
    nav.classList.add("visible");
})

cerrar.addEventListener("click",() =>{
    nav.classList.remove("visible");
})

// Función para alternar el modo noche
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Guardar la preferencia del usuario en el localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Al cargar la página, aplicar el modo noche si está activado
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

