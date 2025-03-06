let walls = [];
let particle;
let sounds = [];
let soundIndex = 0;
let showSimulation = false; // Variable para controlar si se muestra la simulación
let futuristicFont; // Variable para almacenar la fuente
let backgroundSound; // Sonido de fondo en bucle

function preload() {
  for (let i = 1; i <= 9; i++) {
    sounds.push(loadSound(`sound${i}.wav`));
  }
 
  futuristicFont = loadFont('MADE Soulmaze Outline PERSONAL USE.otf');
  buttonFont = loadFont('MADE Soulmaze PERSONAL USE.otf');
  backgroundSound = loadSound('522160__robdanet__kickthebass.wav'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Pantalla completa
  createRings();
  particle = new Particle();
  noCursor(); // Ocultar el cursor por defecto
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Redimensionar al cambiar el tamaño de la ventana
  walls = []; // Reiniciar las paredes
  createRings(); // Recrear los anillos centrados
}

function createRings() {
  let centerX = width / 2;
  let centerY = height / 2;
  let rings = 18; // Número de círculos concéntricos
  let radiusStep = 18;

  for (let i = 1; i <= rings; i++) {
    let radius = i * radiusStep;
    let points = 9; // Número de puntos en el círculo

    for (let j = 0; j < points; j++) {
      let angle1 = TWO_PI / points * j;
      let angle2 = TWO_PI / points * (j + 1);

      let x1 = centerX + cos(angle1) * radius;
      let y1 = centerY + sin(angle1) * radius;
      let x2 = centerX + cos(angle2) * radius;
      let y2 = centerY + sin(angle2) * radius;

      let boundary = new Boundary(x1, y1, x2, y2);
      walls.push(boundary);
    }
  }

  // Límites de la pantalla
  walls.push(new Boundary(0, 0, width, 0));
  walls.push(new Boundary(width, 0, width, height));
  walls.push(new Boundary(width, height, 0, height));
  walls.push(new Boundary(0, height, 0, 0));
}

function draw() {
  background(0);

  if (!showSimulation) {
    // Pantalla inicial
    drawInitialScreen();
    drawCustomCursor(); // Dibujar el cursor personalizado
  } else {
    // Simulación principal
    for (let wall of walls) {
      wall.show();
    }
    particle.update(mouseX, mouseY);
    particle.show();
    particle.look(walls);

    // Botón "back" en la esquina superior izquierda
    drawBackButton();
    drawCustomCursor(); // Dibujar el cursor personalizado
  }
}

function drawInitialScreen() {
  // Fondo de la pantalla inicial
  background(0);

  // Texto de bienvenida
  textFont(buttonFont); // Usar la fuente futurista
  fill(255, 0, 0); // Color rojo
  textSize(50);
  textAlign(CENTER, CENTER);
  text("sound recreation", width / 2, height / 2 - 80);

  // Botón para iniciar
  let buttonSize = 100; // Tamaño del botón redondo
  let buttonX = width / 2;
  let buttonY = height / 2 + 50;

  // Cambiar el color del borde si el cursor está sobre el botón
  let isHovering =
    dist(mouseX, mouseY, buttonX, buttonY) < buttonSize / 2;

  // Estilo del botón: fondo negro con borde rojo o azul
  noFill();
  stroke(isHovering ? color(0, 0, 255) : color(255, 0, 0)); // Borde rojo o azul
  strokeWeight(2);
  ellipse(buttonX, buttonY, buttonSize, buttonSize);

  // Texto del botón (centrado correctamente)
  fill(isHovering ? color(0, 0, 255) : color(255, 0, 0)); // Texto rojo o azul
  noStroke();
  textSize(40);
  textAlign(CENTER, CENTER);
  text("go!", buttonX - 2, buttonY - 5); // Ajuste fino para centrar verticalmente
}

function drawBackButton() {
  // Botón "back" en la esquina superior izquierda
  let buttonSize = 60; // Tamaño del botón redondo
  let buttonX = 50; // Posición X
  let buttonY = 50; // Posición Y

  // Cambiar el color del borde si el cursor está sobre el botón
  let isHovering =
    dist(mouseX, mouseY, buttonX, buttonY) < buttonSize / 2;

  // Estilo del botón: fondo negro con borde rojo o azul
  noFill();
  stroke(isHovering ? color(0, 0, 255) : color(255, 0, 0)); // Borde rojo o azul
  strokeWeight(2);
  ellipse(buttonX, buttonY, buttonSize, buttonSize);

  // Texto del botón (centrado correctamente)
  fill(isHovering ? color(0, 0, 255) : color(255, 0, 0)); // Texto rojo o azul
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text("back", buttonX - 7, buttonY + 5); // Ajuste fino para centrar verticalmente
}

function drawCustomCursor() {
  // Verificar si el cursor está sobre algún botón
  let isHovering = false;

  if (!showSimulation) {
    // Botón "go!"
    let buttonSize = 100;
    let buttonX = width / 2;
    let buttonY = height / 2 + 50;
    isHovering = dist(mouseX, mouseY, buttonX, buttonY) < buttonSize / 2;
  } else {
    // Botón "back"
    let buttonSize = 60;
    let buttonX = 50;
    let buttonY = 50;
    isHovering = dist(mouseX, mouseY, buttonX, buttonY) < buttonSize / 2;
  }

  // Dibujar el cursor personalizado
  noFill();
  stroke(isHovering ? color(0, 0, 255) : color(255, 0, 0)); // Borde rojo o azul
  strokeWeight(2);
  ellipse(mouseX, mouseY, 20, 20); // Círculo de 20px de diámetro
}

function mousePressed() {
  if (!showSimulation) {
    // Verificar si se hizo clic en el botón "go!"
    let buttonSize = 100;
    let buttonX = width / 2;
    let buttonY = height / 2 + 50;

    if (dist(mouseX, mouseY, buttonX, buttonY) < buttonSize / 2) {
      showSimulation = true; // Mostrar la simulación
      noCursor(); // Ocultar el cursor al iniciar la simulación
      backgroundSound.loop(); // Reproducir el sonido de fondo en bucle
    }
  } else {
    // Verificar si se hizo clic en el botón "back"
    let buttonSize = 60;
    let buttonX = 50;
    let buttonY = 50;

    if (dist(mouseX, mouseY, buttonX, buttonY) < buttonSize / 2) {
      showSimulation = false; // Volver a la pantalla de inicio
      backgroundSound.stop(); // Detener el sonido de fondo
    }
  }
}

class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
    this.touched = false;
    this.lastTouchedTime = null;
  }

  show() {
    stroke(this.touched ? [255, 0, 0] : [0, 0, 255]);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }

  toggleTouched() {
    if (!this.touched) {
      this.touched = true;
      this.lastTouchedTime = millis();
      if (sounds[soundIndex]) {
        sounds[soundIndex].play();
        soundIndex = (soundIndex + 1) % sounds.length;
      }
    }
  }

  update() {
    if (this.touched && millis() - this.lastTouchedTime > 2000) {
      this.touched = false;
    }
  }
}

class Particle {
  constructor() {
    this.pos = createVector(width / 3, height / 3);
    this.rays = [];
    for (let a = 0; a < 360; a += 3) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
  }

  update(x, y) {
    this.pos.set(x, y);
  }

  look(walls) {
    for (let ray of this.rays) {
      let closest = null;
      let record = Infinity;
      let touchedWall = null;
      for (let wall of walls) {
        wall.update();
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record) {
            record = d;
            closest = pt;
            touchedWall = wall;
          }
        }
      }

      if (closest) {
        if (touchedWall) touchedWall.toggleTouched();
        stroke(255, 0, 0, 100);
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
    }
  }

  show() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 8);
    for (let ray of this.rays) {
      ray.show();
    }
  }
}

class Ray {
  constructor(pos, angle) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
  }

  lookAt(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  show() {
    stroke(0);
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * 3, this.dir.y * 3);
    pop();
  }

  cast(wall) {
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;
    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (den === 0) return;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      return createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    }
  }
}