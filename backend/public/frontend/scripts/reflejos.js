class JuegoReflejos {
  constructor(contenedorPalabraReflejos, contenedorSenasNivel1, contenedorSenasNivel2, contenedorSenasNivel3, resultadoReflejos) {
    this.contenedorPalabra = document.getElementById(contenedorPalabraReflejos);
    this.contenedorSenasNivel1 = document.getElementById(contenedorSenasNivel1);
    this.contenedorSenasNivel2 = document.getElementById(contenedorSenasNivel2);
    this.contenedorSenasNivel3 = document.getElementById(contenedorSenasNivel3);
    this.resultadoElemento = document.getElementById(resultadoReflejos);
    this.botonReiniciarJuego = document.getElementById('reiniciarJuegoReflejos');
    this.botonReiniciarJuego.addEventListener('click', () => this.reiniciarJuego());
    this.botonSiguienteNivel = document.getElementById('boton-siguiente-nivel-reflejos');

    this.palabraCorrecta = "";
    this.tiempoMostrarPalabras = 300;
    this.aciertos = 0;
    this.palabrasAciertas = [];
    this.contadorAciertosPorPalabra = {};
    this.nivelActual = 1;
    this.totalPreguntasPorNivel = 3;

    // Propiedades de tiempo y repeticiones
    this.tiempoInicioReflejos = 0;
    this.tiempoTranscurridoReflejos = 0;
    this.tiempoIntervaloReflejos = null;
    this.repeticionesReflejos = 0;
    this.repitioReflejos = false;
    this.datosGuardados=false;
   

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
    if (!this.tiempoInicioReflejos) {
      this.tiempoInicioReflejos = Date.now();
      this.iniciarContadorReflejos();
    }

    const botonesSenas = Array.from(this.nivelActual === 1 ? this.contenedorSenasNivel1.children :
                                    this.nivelActual === 2 ? this.contenedorSenasNivel2.children :
                                    this.contenedorSenasNivel3.children);
    const palabras = botonesSenas.map(boton => boton.dataset.palabra);

    const palabrasFiltradas = palabras.filter(palabra => {
      if (this.nivelActual === 3) return true;
      return !this.contadorAciertosPorPalabra[palabra] || this.contadorAciertosPorPalabra[palabra] < 2;
    });

    let index = 0;
    const intervalo = setInterval(() => {
      this.contenedorPalabra.textContent = palabrasFiltradas[index];
      index++;
      if (index >= palabrasFiltradas.length) index = 0;
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
          this.contadorAciertosPorPalabra[palabraSeleccionada] = (this.contadorAciertosPorPalabra[palabraSeleccionada] || 0) + 1;

          if (!this.palabrasAciertas.includes(palabraSeleccionada)) {
            this.palabrasAciertas.push(palabraSeleccionada);
            this.aciertos++;
          }
          this.mostrarResultado("¡Correcto!", "green");

          if (this.aciertos === this.totalPreguntasPorNivel) {
            if (this.nivelActual === 3 && !this.datosGuardados) {
              this.detenerContadorReflejos();
              this.mostrarResultado(
                `¡Felicidades! Has completado todos los niveles. Lo repetiste ${this.repeticionesReflejos} veces en ${this.calcularTiempoReflejos()} segundos.`,
                "green");
              this.botonReiniciarJuego.style.display = 'block';
              this.botonSiguienteNivel.style.display = 'none';
              // Guardar los datos una sola vez
            registrarDatosJuego(2, this.repeticionesReflejos, this.tiempoTranscurridoReflejos, this.repitioReflejos);
            datosGuardados = true; // Marcar que ya se guardaron los datos
              return;
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
    console.log('Aciertos:', this.aciertos, 'Total preguntas por nivel:', this.totalPreguntasPorNivel);
    console.log('Nivel actual:', this.nivelActual);

   
  }

  mostrarBotonSiguienteNivel() {
    this.botonSiguienteNivel.style.display = 'block';
  }

  siguienteNivel() {
    this.aciertos = 0;
    this.palabrasAciertas = [];
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

  iniciarContadorReflejos() {
    if (!this.tiempoIntervaloReflejos) {
      this.tiempoIntervaloReflejos = setInterval(() => {
        this.tiempoTranscurridoReflejos++;
      }, 1000);
    }
  }

  detenerContadorReflejos() {
    clearInterval(this.tiempoIntervaloReflejos);
    this.tiempoIntervaloReflejos = null;
  }

  calcularTiempoReflejos() {
    return this.tiempoTranscurridoReflejos;
  }


  reiniciarJuego() {
    this.repeticionesReflejos++;
    this.aciertos = 0;
    this.palabrasAciertas = [];
    this.contadorAciertosPorPalabra = {};
    this.nivelActual = 1;
    this.tiempoInicioReflejos = 0;
    this.tiempoTranscurridoReflejos = 0;
    this.botonReiniciarJuego.style.display = 'none';
    this.mostrarNivel();
    this.cargarNuevaPalabra();
    this.limpiarResultado();
    console.log("Juego reiniciado");
  }
  
}


const juegoReflejos = new JuegoReflejos(
  'palabra-a-identificar-reflejos',
  'contenedor-senas-reflejos-nivel-1',
  'contenedor-senas-reflejos-nivel-2',
  'contenedor-senas-reflejos-nivel-3',
  'resultado-reflejos'
);
