class JuegoReflejos {
  constructor(contenedorPalabraReflejos, contenedorSenasNivel1, contenedorSenasNivel2, contenedorSenasNivel3, resultadoReflejos) {
    this.contenedorPalabra = document.getElementById(contenedorPalabraReflejos);
    this.contenedorSenasNivel1 = document.getElementById(contenedorSenasNivel1);
    this.contenedorSenasNivel2 = document.getElementById(contenedorSenasNivel2);
    this.contenedorSenasNivel3 = document.getElementById(contenedorSenasNivel3);
    this.resultadoElemento = document.getElementById(resultadoReflejos);
    this.botonSiguienteNivel = document.getElementById('boton-siguiente-nivel-reflejos');
    
    this.palabraCorrecta = "";
    this.tiempoMostrarPalabras = 300; // Tiempo en milisegundos para mostrar cada palabra
    this.aciertos = 0; // Contador de respuestas correctas
    this.palabrasAciertas = []; // Array para almacenar palabras acertadas
    this.contadorAciertosPorPalabra = {}; // Objeto para contar aciertos por palabra
    this.nivelActual = 1; // Inicializar nivel
    this.totalPreguntasPorNivel = 3; // Total de preguntas por nivel
    this.cargarNuevaPalabra(); // Cargar la primera palabra
    
    // Evento para el botón de siguiente nivel
    this.botonSiguienteNivel.style.display = 'none'; // Ocultarlo inicialmente
    this.botonSiguienteNivel.addEventListener('click', () => this.siguienteNivel());

    // Inicializa el juego mostrando solo el nivel 1
    this.mostrarNivel();
  }

  mostrarNivel() {
    this.contenedorSenasNivel1.style.display = this.nivelActual === 1 ? 'flex' : 'none';
    this.contenedorSenasNivel2.style.display = this.nivelActual === 2 ? 'flex' : 'none';
    this.contenedorSenasNivel3.style.display = this.nivelActual === 3 ? 'flex' : 'none';
  }

  cargarNuevaPalabra() {
    const botonesSenas = Array.from(this.nivelActual === 1 ? this.contenedorSenasNivel1.children :
                                    this.nivelActual === 2 ? this.contenedorSenasNivel2.children :
                                    this.contenedorSenasNivel3.children);
    const palabras = botonesSenas.map(boton => boton.dataset.palabra);
    
    // Filtrar palabras que ya han sido acertadas más de dos veces
    const palabrasFiltradas = palabras.filter(palabra => {
      return !this.contadorAciertosPorPalabra[palabra] || this.contadorAciertosPorPalabra[palabra] < 2;
    });

    // Mostrar palabras aleatoriamente
    let index = 0;
    const intervalo = setInterval(() => {
      this.contenedorPalabra.textContent = palabrasFiltradas[index];
      index++;
      if (index >= palabrasFiltradas.length) {
        index = 0;
      }
    }, this.tiempoMostrarPalabras);

    // Seleccionar una nueva palabra después de un tiempo
    setTimeout(() => {
      clearInterval(intervalo); // Detener el intervalo
      const indiceAleatorio = Math.floor(Math.random() * palabrasFiltradas.length);
      this.palabraCorrecta = palabrasFiltradas[indiceAleatorio];
      this.contenedorPalabra.textContent = this.palabraCorrecta;

      // Agregar eventos a los botones
      this.agregarEventos(botonesSenas);
    }, this.tiempoMostrarPalabras * palabrasFiltradas.length + 500); // Tiempo total antes de elegir la palabra correcta
  }

  agregarEventos(botonesSenas) {
    // Eliminar los event listeners anteriores
    botonesSenas.forEach(boton => {
      boton.removeEventListener('click', this.verificarRespuesta);
    });

    botonesSenas.forEach(boton => {
      boton.addEventListener("click", (evento) => {
        const palabraSeleccionada = evento.currentTarget.dataset.palabra;

        // Verificar si la palabra seleccionada es la correcta
        if (palabraSeleccionada === this.palabraCorrecta) {
          // Aumentar el contador de aciertos para esta palabra
          if (!this.contadorAciertosPorPalabra[palabraSeleccionada]) {
            this.contadorAciertosPorPalabra[palabraSeleccionada] = 0;
          }
          this.contadorAciertosPorPalabra[palabraSeleccionada]++; // Incrementar el acierto para esta palabra

          // Agregar palabra a las acertadas si no está ya en el array
          if (!this.palabrasAciertas.includes(palabraSeleccionada)) {
            this.palabrasAciertas.push(palabraSeleccionada); // Aumentar contador de aciertos
            this.aciertos++; // Aumentar el contador de aciertos
          }
          this.mostrarResultado("¡Correcto!", "green");

          // Verificar si se han acertado todas las palabras
          const totalPalabras = this.nivelActual === 1 || this.nivelActual === 2 ? 3 : 3; // Cambia el total de palabras según el nivel
          if (this.aciertos === totalPalabras) {
            this.mostrarBotonSiguienteNivel(); // Mostrar el botón de siguiente nivel
          }
        } else {
          this.mostrarResultado("Incorrecto, intenta de nuevo.", "red");
        }

        // Después de 1.5 segundos, cargar una nueva palabra
        setTimeout(() => {
          this.cargarNuevaPalabra();
          this.limpiarResultado();
        }, 1500);
      });
    });
  }

  mostrarBotonSiguienteNivel() {
    this.botonSiguienteNivel.style.display = 'block';
  }

  siguienteNivel() {
    this.aciertos = 0; // Reiniciar el contador de aciertos
    this.palabrasAciertas = []; // Reiniciar el array de palabras acertadas

    // Verificar si el jugador ha completado el último nivel
    if (this.nivelActual === 3) {
      this.mostrarResultado("¡Felicidades, completaste todos los niveles!", "blue");
      this.botonSiguienteNivel.style.display = 'none'; // Eliminar el botón de siguiente nivel
      return; // Salir de la función, ya no se cargan más niveles
    }

    this.botonSiguienteNivel.style.display = 'none'; // Ocultar el botón
    this.nivelActual++; // Aumentar el nivel actual
    this.mostrarNivel(); // Mostrar el contenedor del nuevo nivel
    this.cargarNuevaPalabra(); // Cargar una nueva palabra para el nuevo nivel
  }

  mostrarResultado(mensaje, color) {
    this.resultadoElemento.textContent = mensaje;
    this.resultadoElemento.style.color = color;
  }

  limpiarResultado() {
    this.resultadoElemento.textContent = "";
  }
}

// Crear una nueva instancia del juego
const juegoReflejos = new JuegoReflejos(
  'palabra-a-identificar-reflejos',
  'contenedor-senas-reflejos-nivel-1',
  'contenedor-senas-reflejos-nivel-2',
  'contenedor-senas-reflejos-nivel-3',
  'resultado-reflejos'
);
