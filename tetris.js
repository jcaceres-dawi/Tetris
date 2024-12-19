// Variables
const canvas = document.getElementById("tetris");
const lienzo = canvas.getContext("2d");

const miniCanvas = document.getElementById("miniTetris");
const miniLienzo = miniCanvas.getContext("2d");

const filas = 20;
const columnas = 10;
const tamanoCelda = 30;

const piezas = [
  {
    nombre: "C",
    forma: [
      [1, 1, 1],
      [1, 0, 1],
    ],
    probabilidad: 0.2,
    color: "red",
  },
  {
    nombre: "O",
    forma: [
      [1, 1],
      [1, 1],
    ],
    probabilidad: 0.18,
    color: "yellow",
  },
  {
    nombre: "S",
    forma: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    probabilidad: 0.12,
    color: "green",
  },
  {
    nombre: "T",
    forma: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    probabilidad: 0.14,
    color: "blueviolet",
  },
  {
    nombre: "Z",
    forma: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    probabilidad: 0.08,
    color: "red",
  },
  {
    nombre: "L",
    forma: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    probabilidad: 0.1,
    color: "orange",
  },
  {
    nombre: "J",
    forma: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    probabilidad: 0.08,
    color: "blue",
  },
  {
    nombre: "I",
    forma: [[1, 1, 1, 1]],
    probabilidad: 0.1,
    color: "aqua",
  },
];

let intervalo;
let velocidad;

let puntuacion = 0;

let tablero = [];

// Relleno el tablero con ceros
for (let i = 0; i < filas; i++) {
  let fila = [];
  for (let j = 0; j < columnas; j++) {
    fila.push(0);
  }
  tablero.push(fila);
}

//Dibujo el tablero visualmente
function dibujarTablero() {
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      if (tablero[i][j] == 1) {
        lienzo.fillStyle = "grey";
        lienzo.fillRect(
          j * tamanoCelda,
          i * tamanoCelda,
          tamanoCelda,
          tamanoCelda
        );
      } else {
        lienzo.fillStyle = "black";
        lienzo.fillRect(
          j * tamanoCelda,
          i * tamanoCelda,
          tamanoCelda,
          tamanoCelda
        );
      }

      lienzo.strokeStyle = "grey";
      lienzo.strokeRect(
        j * tamanoCelda,
        i * tamanoCelda,
        tamanoCelda,
        tamanoCelda
      );
    }
  }
}

//Dibujo la pieza en el tablero
function dibujarPieza(pieza, x, y) {
  for (let i = 0; i < pieza.forma.length; i++) {
    for (let j = 0; j < pieza.forma[i].length; j++) {
      if (pieza.forma[i][j] == 1) {
        lienzo.fillStyle = pieza.color;
        lienzo.fillRect(
          (x + j) * tamanoCelda,
          (y + i) * tamanoCelda,
          tamanoCelda,
          tamanoCelda
        );

        lienzo.strokeStyle = "grey";
        lienzo.strokeRect(
          (x + j) * tamanoCelda,
          (y + i) * tamanoCelda,
          tamanoCelda,
          tamanoCelda
        );
      }
    }
  }
}

//Genero una pieza aleatoria
function generarPieza() {
  const probabilidades = [];
  let sumaProbabilidad = 0;

  for (let i = 0; i < piezas.length; i++) {
    sumaProbabilidad += piezas[i].probabilidad;
    probabilidades.push(sumaProbabilidad.toFixed(2));
  }

  const aleatorio = Math.random().toFixed(2);

  for (let i = 0; i < probabilidades.length; i++) {
    if (aleatorio < probabilidades[i]) {
      return piezas[i];
    }
  }
}

//Chequeo si la pieza colisiona
function chequearColisiones(pieza, x, y) {
  for (let i = 0; i < pieza.forma.length; i++) {
    for (let j = 0; j < pieza.forma[i].length; j++) {
      if (pieza.forma[i][j] === 1) {
        const tableroX = x + j;
        const tableroY = y + i;

        if (
          tableroX < 0 ||
          tableroX >= tablero[0].length ||
          tableroY < 0 ||
          tableroY >= tablero.length
        ) {
          return true;
        }

        if (tablero[tableroY][tableroX] === 1) {
          return true;
        }
      }
    }
  }
  return false;
}

//Posiciono la pieza en el tablero
function posicionarPieza(pieza, x, y) {
  for (let i = 0; i < pieza.forma.length; i++) {
    for (let j = 0; j < pieza.forma[i].length; j++) {
      if (pieza.forma[i][j] == 1) {
        tablero[y + i][x + j] = 1;
      }
    }
  }
  puntuacion += 10;
  actualizarPuntuacion();
}

//Elimino la línea si está completa
function eliminarLinea() {
  for (let i = 0; i < filas; i++) {
    let borrar = true;
    for (let j = 0; j < columnas; j++) {
      if (tablero[i][j] === 0) {
        borrar = false;
        break;
      }
    }

    if (borrar) {
      tablero.splice(i, 1);
      tablero.unshift(new Array(columnas).fill(0));
      puntuacion += 100;
      actualizarPuntuacion();
      i--; //Para que compruebe la línea que se ha movido
    }
  }

  dibujarTablero();
}

//Roto la pieza
function rotarPieza(pieza) {
  const nuevaForma = [];
  const filas = pieza.forma.length;
  const columnas = pieza.forma[0].length;

  for (let j = 0; j < columnas; j++) {
    const nuevaFila = [];
    for (let i = filas - 1; i >= 0; i--) {
      nuevaFila.push(pieza.forma[i][j]);
    }
    nuevaForma.push(nuevaFila);
  }

  return {
    nombre: pieza.nombre,
    forma: nuevaForma,
    probabilidad: pieza.probabilidad,
    color: pieza.color,
  };
}

//Actualizo la puntuación
function actualizarPuntuacion() {
  const puntuacionElemento = document.getElementById("puntuacion");
  puntuacionElemento.textContent = `Puntuación: ${puntuacion}`;
}

//Dibujo la próxima pieza en el mini canvas
function dibujarPiezaEnMiniCanvas(pieza) {
  //Borro el mini canvas
  miniLienzo.clearRect(0, 0, miniCanvas.width, miniCanvas.height);

  //Dibujo el mini canvas
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      miniLienzo.strokeStyle = "grey";
      miniLienzo.strokeRect(j * 37.5, i * 37.5, 37.5, 37.5);
    }
  }

  //Dibujo la pieza en el mini canvas
  for (let i = 0; i < pieza.forma.length; i++) {
    for (let j = 0; j < pieza.forma[i].length; j++) {
      if (pieza.forma[i][j] === 1) {
        miniLienzo.fillStyle = pieza.color;
        miniLienzo.fillRect(j * 37.5, (i + 1) * 37.5, 37.5, 37.5); // i + 1 para que baje una fila
        miniLienzo.strokeStyle = "grey";
        miniLienzo.strokeRect(j * 37.5, (i + 1) * 37.5, 37.5, 37.5); // i + 1 para que baje una fila
      }
    }
  }
}

//Cambio la pieza actual por la próxima pieza
function actualizarPieza() {
  pieza = proximaPieza;
  //Posiciono la pieza en el centro (más o menos)
  x = 4;
  y = 0;

  proximaPieza = generarPieza();

  dibujarPiezaEnMiniCanvas(proximaPieza);
}

//Establezco la velocidad del juego en función de la dificultad elegida
function establecerDificultad(dificultad) {
  if (dificultad === "facil") {
    velocidad = 1000;
  } else if (dificultad === "normal") {
    velocidad = 500;
  } else if (dificultad === "dificil") {
    velocidad = 200;
  }

  //Hago que no se vea el menú de dificultad
  document.getElementById("dificultad").style.display = "none";
  //Inicio el juego
  intervalo = setInterval(jugar, velocidad);
}

//Función que llama a la mayoría de funciones del juego
function actualizar() {
  if (chequearColisiones(pieza, x, y)) {
    posicionarPieza(pieza, x, y - 1);
    eliminarLinea();
    actualizarPieza();
    if (chequearColisiones(pieza, x, y)) {
      //Borro el intervalo para que no se siga ejecutando
      clearInterval(intervalo);
      alert(
        "FIN DE LA PARTIDA, este juego ha sido desarrollado por Jesús Cáceres Francés"
      );
    }
  }
}

//Función que se ejecuta cada vez según la velocidad establecida
function jugar() {
  actualizar();
  dibujarTablero();
  dibujarPieza(pieza, x, y++);
}

//Eventos de teclado
document.addEventListener("keydown", (event) => {
  if (event.key === "a") {
    const nuevaX = x - 1;
    if (!chequearColisiones(pieza, nuevaX, y)) {
      x = nuevaX;
      dibujarTablero();
      dibujarPieza(pieza, x, y);
    }
  }

  if (event.key === "d") {
    const nuevaX = x + 1;
    if (!chequearColisiones(pieza, nuevaX, y)) {
      x = nuevaX;
      dibujarTablero();
      dibujarPieza(pieza, x, y);
    }
  }

  if (event.key === "s") {
    const nuevaY = y + 1;
    if (!chequearColisiones(pieza, x, nuevaY)) {
      y = nuevaY;
      dibujarTablero();
      dibujarPieza(pieza, x, y);
    }
  }

  if (event.key === "w") {
    const piezaRotada = rotarPieza(pieza);
    if (!chequearColisiones(piezaRotada, x, y)) {
      pieza = piezaRotada;
      dibujarTablero();
      dibujarPieza(pieza, x, y);
    }
  }
});

//Inicializo las variables para empezar el juego
let pieza = generarPieza();
let proximaPieza = generarPieza();
//Dibujo la próxima pieza en el mini canvas para que se vea desde el principio
dibujarPiezaEnMiniCanvas(proximaPieza);
//Posiciono inicialmente la pieza en el centro (más o menos)
let x = 4;
let y = 0;
