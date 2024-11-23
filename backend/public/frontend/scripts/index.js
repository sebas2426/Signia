const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");
const toggleButton = document.getElementById('toggle-dark-mode');
const icon = document.querySelector('#iconNightSun'); // Define el icono aquí
let datosJuegos = {
    repeticionesJuegos: [1],
    tiemposIntentosJuegos: [],
    repitioJuegos: []
};

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


document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    let showingImage = true; // Indica si se está mostrando una imagen
    let preloadedImages = []; // Array para almacenar las imágenes precargadas

    // Función para precargar imágenes
    function preloadImages() {
        leccionData.forEach(media => {
            const img = new Image(); // Crea un nuevo objeto de imagen
            img.src = media.imagenUrl; // Asigna la URL de la imagen
            preloadedImages.push(img); // Guarda la imagen en el array
        });
    }

    // Función para actualizar el contenido
    function updateMedia() {
        const currentMedia = leccionData[currentIndex];
        const mediaImageElement = document.getElementById('media-image');
        const mediaVideoElement = document.getElementById('media-video');

        // Actualiza el título del <h3> para reflejar la letra actual
        document.querySelector('.media-contenedor h3').innerText = currentMedia.letra;
        document.querySelector('.media-contenedor p').innerText = currentMedia.descripcion;

        // Oculta o muestra los elementos según el tipo
        if (showingImage) {
            // Desplaza la vista hacia el contenedor
            mediaImageElement.src = preloadedImages[currentIndex].src; // Usa la imagen precargada
            mediaImageElement.alt = `Imagen de ${currentMedia.letra}`;
            mediaImageElement.style.display = 'block'; // Muestra la imagen
            mediaVideoElement.style.display = 'none'; // Oculta el video
        } else {
            mediaVideoElement.src = currentMedia.videoUrl; // Cambia la src para el video
            mediaVideoElement.alt = `Video de ${currentMedia.letra}`;
            mediaImageElement.style.display = 'none'; // Oculta la imagen
            mediaVideoElement.style.display = 'block'; // Muestra el video
        }

        // Actualiza el estado de los botones de navegación
        document.getElementById('prev').disabled = currentIndex === 0 && showingImage; // Deshabilita el botón anterior en el primer elemento
        document.getElementById('next').disabled = currentIndex === leccionData.length - 1 && !showingImage; // Deshabilita el botón siguiente en el último video
    }

    // Eventos para las flechas
    document.getElementById('prev').addEventListener('click', () => {
        if (showingImage) {
            document.querySelector('.media-contenedor').scrollIntoView({ behavior: 'smooth' });
            // Si estamos mostrando una imagen, volvemos a la letra anterior
            if (currentIndex > 0) {
                currentIndex--; // Retrocede al índice anterior
                showingImage = false; // Cambia a video
            }
        } else {
            document.querySelector('.media-contenedor').scrollIntoView({ behavior: 'smooth' });
            // Si estamos mostrando un video, primero volvemos a la imagen actual
            showingImage = true; // Cambia a imagen
            // No decrementamos currentIndex aquí, para que muestre la imagen correspondiente al video actual
        }
        updateMedia();
    });

    document.getElementById('next').addEventListener('click', () => {
        if (showingImage) {
            document.querySelector('.media-contenedor').scrollIntoView({ behavior: 'smooth' });
            // Si estamos mostrando una imagen, avanzamos al video de la letra actual
            showingImage = false; // Cambia a video
        } else {
            document.querySelector('.media-contenedor').scrollIntoView({ behavior: 'smooth' });
            // Si estamos mostrando un video, avanzamos a la siguiente letra
            if (currentIndex < leccionData.length - 1) {
                currentIndex++; // Incrementa el índice
                showingImage = true; // Cambia a imagen
            }
        }
        updateMedia();
    });

    // Inicializa la vista con el primer elemento (imagen de la letra A)
    preloadImages(); // Pre-cargamos las imágenes antes de inicializar
    updateMedia();
});
