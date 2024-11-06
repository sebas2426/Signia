class JuegoReflejos {
  constructor(contenedorPalabraReflejos, contenedorSenasNivel1, contenedorSenasNivel2, contenedorSenasNivel3, resultadoReflejos) {
    this.contenedorPalabra = document.getElementById(contenedorPalabraReflejos);
    this.contenedorSenasNivel1 = document.getElementById(contenedorSenasNivel1);
    this.contenedorSenasNivel2 = document.getElementById(contenedorSenasNivel2);
    this.contenedorSenasNivel3 = document.getElementById(contenedorSenasNivel3);
    this.resultadoElemento = document.getElementById(resultadoReflejos);
    this.botonSiguienteNivel = document.getElementById('boton-siguiente-nivel-reflejos');

    this.palabraCorrecta = "";
    this.tiempoMostrarPalabras = 300;
    this.aciertos = 0;
    this.palabrasAciertas = [];
    this.contadorAciertosPorPalabra = {};
    this.nivelActual = 1;
    this.totalPreguntasPorNivel = 3;
    this.cargarNuevaPalabra();

    this.botonSiguienteNivel.style.display = 'none';
    this.botonSiguienteNivel.addEventListener('click', () => this.siguienteNivel());

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

    const palabrasFiltradas = palabras.filter(palabra => {
      // Si estamos en el nivel 3, no limitamos la cantidad de veces que puede aparecer una palabra
      if (this.nivelActual === 3) {
        return true;  // No filtramos por cantidad de aciertos, dejamos todas las palabras disponibles
      }
    
      // En niveles anteriores, limitamos a 2 veces
      return !this.contadorAciertosPorPalabra[palabra] || this.contadorAciertosPorPalabra[palabra] < 2;
    });
    

    let index = 0;
    const intervalo = setInterval(() => {
      this.contenedorPalabra.textContent = palabrasFiltradas[index];
      index++;
      if (index >= palabrasFiltradas.length) {
        index = 0;
      }
    }, this.tiempoMostrarPalabras);

    setTimeout(() => {
      clearInterval(intervalo);
      const indiceAleatorio = Math.floor(Math.random() * palabrasFiltradas.length);
      this.palabraCorrecta = palabrasFiltradas[indiceAleatorio];
      this.contenedorPalabra.textContent = this.palabraCorrecta;

      this.agregarEventos(botonesSenas);
    }, this.tiempoMostrarPalabras * palabrasFiltradas.length + 500);
  }

  agregarEventos(botonesSenas) {
    botonesSenas.forEach(boton => {
      boton.removeEventListener('click', this.verificarRespuesta);
    });

    botonesSenas.forEach(boton => {
      boton.addEventListener("click", (evento) => {
        const palabraSeleccionada = evento.currentTarget.dataset.palabra;

        if (palabraSeleccionada === this.palabraCorrecta) {
          if (!this.contadorAciertosPorPalabra[palabraSeleccionada]) {
            this.contadorAciertosPorPalabra[palabraSeleccionada] = 0;
          }
          this.contadorAciertosPorPalabra[palabraSeleccionada]++;

          if (!this.palabrasAciertas.includes(palabraSeleccionada)) {
            this.palabrasAciertas.push(palabraSeleccionada);
            this.aciertos++;
          }
          this.mostrarResultado("¡Correcto!", "green");

          if (this.aciertos === 3) {
            if (this.nivelActual === 3) {
              // Mostrar el mensaje de victoria y agregar la clase exclusiva
              this.mostrarResultado("¡Felicidades, completaste todos los niveles!");
          
              // Añadir la clase 'mensaje-victoria' y la clase 'aparecer' para activar la transición
              this.resultadoElemento.classList.add("mensaje-victoria", "aparecer");
              
              this.botonSiguienteNivel.style.display = 'none';
              return;  // Evitamos limpiar el mensaje final de victoria
            } else {
              this.mostrarBotonSiguienteNivel();
            }
          }
          
          
        } else {
          this.mostrarResultado("Incorrecto, intenta de nuevo.", "red");
        }

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
    this.aciertos = 0;
    this.palabrasAciertas = [];

    if (this.nivelActual === 3) {
      return;
    }

    this.botonSiguienteNivel.style.display = 'none';
    this.nivelActual++;
    this.mostrarNivel();
    this.cargarNuevaPalabra();
  }

  mostrarResultado(mensaje, color) {
    this.resultadoElemento.textContent = mensaje;
    this.resultadoElemento.style.color = color;
  }

  limpiarResultado() {
    this.resultadoElemento.textContent = "";
  }
}

const juegoReflejos = new JuegoReflejos(
  'palabra-a-identificar-reflejos',
  'contenedor-senas-reflejos-nivel-1',
  'contenedor-senas-reflejos-nivel-2',
  'contenedor-senas-reflejos-nivel-3',
  'resultado-reflejos'
);
