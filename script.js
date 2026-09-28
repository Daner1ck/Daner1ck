const USERNAME = "Daner1ck";
const LINKEDIN_URL = "https://www.linkedin.com/in/erick-rodr%C3%ADguez-062911230?trk=contact-info";

const profileFromPdf = {
  summary:
    "Profesional de TI enfocado en continuidad operativa y gestión integral de servicios bajo estándares ITIL y atención multicanal con ServiceNow. Experiencia en administración de identidades en Active Directory, soporte a Microsoft 365 y conectividad en infraestructura corporativa.",
  experience: [
    "SDC México (Deloitte) — Analista de servicio técnico | ago 2024 - actual. Gestión de incidentes en ServiceNow, soporte multicanal, escalamiento estratégico y mejora de procesos.",
    "log-on — Cajero encargado | mar 2024 - ago 2024. Facturación, arqueos, supervisión de equipo, KPIs e inventarios cíclicos.",
    "BS Service Shop — Asistente técnico | ago 2023 - mar 2024. Diagnóstico y reparación de línea blanca, mantenimiento preventivo/correctivo y reportes técnicos."
  ],
  certifications: [
    "Soporte Técnico a Computadoras en Entornos Corporativos",
    "Power BI - Guía definitiva de DAX",
    "Analista de Help Desk",
    "Migración de Windows a macOS",
    "Fing IT Professional"
  ],
  education: [
    "Universidad Nacional Rosario Castellanos — Licenciatura en Tecnología de la Información y Comunicación (mar 2024 - sep 2027)"
  ],
  skills: [
    "Microsoft Power BI",
    "Expresiones de análisis de datos (DAX)",
    "Análisis de datos estadísticos",
    "ServiceNow",
    "Active Directory",
    "Microsoft 365",
    "Inglés (Elementary)"
  ]
};

const avatar = document.querySelector("#avatar");
const nameEl = document.querySelector("#name");
const careerTitleEl = document.querySelector("#career-title");
const bioEl = document.querySelector("#bio");
const githubLink = document.querySelector("#github-link");
const linkedinLink = document.querySelector("#linkedin-link");
const blogLink = document.querySelector("#blog-link");
const careerSummaryEl = document.querySelector("#career-summary");
const experienceList = document.querySelector("#experience-list");
const certificationsList = document.querySelector("#certifications-list");
const publicDataList = document.querySelector("#public-data-list");
const educationList = document.querySelector("#education-list");
const skillsList = document.querySelector("#skills-list");
const scoreEl = document.querySelector("#score");
const livesEl = document.querySelector("#lives");
const movesEl = document.querySelector("#moves");
const puzzleStatusEl = document.querySelector("#puzzle-status");
const brickCanvas = document.querySelector("#brick-game");
const puzzleCanvas = document.querySelector("#puzzle-game");
const startBricksButton = document.querySelector("#start-bricks");
const startPuzzleButton = document.querySelector("#start-puzzle");
const yearEl = document.querySelector("#year");

let avatarImage = null;
let bricksAnimationId = null;

const compact = new Intl.NumberFormat("es-ES", { notation: "compact" });

function translateGithubBio(text) {
  if (!text) return "";

  const exactTranslations = new Map([
    [
      "I'm a 22-year-old who loves programming and video games. I enjoy self-learning and staying up-to-date with technology.",
      "Tengo 22 años, me apasiona la programación y los videojuegos. Disfruto aprender por mi cuenta y mantenerme al día con la tecnología."
    ]
  ]);

  return exactTranslations.get(text.trim()) || `Perfil de GitHub: ${text}`;
}

function toList(element, values) {
  element.innerHTML = values.map((value) => `<li>${value}</li>`).join("");
}

function renderProfileFromPdf(user, repos) {
  careerSummaryEl.textContent = profileFromPdf.summary;
  toList(experienceList, profileFromPdf.experience);
  toList(certificationsList, profileFromPdf.certifications);
  toList(educationList, profileFromPdf.education);
  toList(skillsList, profileFromPdf.skills);

  const publicDetails = [
    `Usuario de GitHub: ${user.login}`,
    user.location ? `Ubicación pública: ${user.location}` : "Ubicación pública: no especificada",
    `Repositorios públicos: ${compact.format(user.public_repos ?? repos.length)}`,
    `Correo de contacto: erickcorreo26@gmail.com`,
    `<a class=\"info-link\" href=\"${LINKEDIN_URL}\" target=\"_blank\" rel=\"noreferrer\">Ver perfil de LinkedIn</a>`
  ];

  publicDataList.innerHTML = publicDetails.map((item) => `<li>${item}</li>`).join("");
}

function showWaitingState() {
  const brickCtx = brickCanvas.getContext("2d");
  brickCtx.clearRect(0, 0, brickCanvas.width, brickCanvas.height);
  brickCtx.fillStyle = "rgba(17,23,29,0.92)";
  brickCtx.fillRect(0, 0, brickCanvas.width, brickCanvas.height);
  brickCtx.fillStyle = "#d67fff";
  brickCtx.font = "600 26px Inter, sans-serif";
  brickCtx.textAlign = "center";
  brickCtx.fillText("Presiona 'Jugar Break Bricks'", brickCanvas.width / 2, brickCanvas.height / 2);

  const puzzleCtx = puzzleCanvas.getContext("2d");
  puzzleCtx.clearRect(0, 0, puzzleCanvas.width, puzzleCanvas.height);
  puzzleCtx.fillStyle = "rgba(17,23,29,0.92)";
  puzzleCtx.fillRect(0, 0, puzzleCanvas.width, puzzleCanvas.height);
  puzzleCtx.fillStyle = "#d67fff";
  puzzleCtx.font = "600 24px Inter, sans-serif";
  puzzleCtx.textAlign = "center";
  puzzleCtx.fillText("Pulsa 'Iniciar Rompecabezas'", puzzleCanvas.width / 2, puzzleCanvas.height / 2);
}

function startBreakBricks() {
  if (bricksAnimationId) {
    cancelAnimationFrame(bricksAnimationId);
    bricksAnimationId = null;
  }

  const canvas = brickCanvas;
  const ctx = canvas.getContext("2d");
  const gameWidth = canvas.width;
  const gameHeight = canvas.height;

  const paddle = { width: 130, height: 12, x: gameWidth / 2 - 65, speed: 8, dx: 0 };
  const ball = { x: gameWidth / 2, y: gameHeight - 45, radius: 11, dx: 3, dy: -3 };

  const brickRows = 5;
  const brickCols = 9;
  const brickWidth = 72;
  const brickHeight = 20;
  const brickPadding = 9;
  const brickOffsetTop = 64;
  const brickOffsetLeft = 30;

  const bricks = Array.from({ length: brickRows }, (_, row) =>
    Array.from({ length: brickCols }, (_, col) => ({
      x: brickOffsetLeft + col * (brickWidth + brickPadding),
      y: brickOffsetTop + row * (brickHeight + brickPadding),
      status: 1
    }))
  );

  let score = 0;
  let lives = 3;
  let gameOver = false;
  let gameWon = false;

  scoreEl.textContent = "0";
  livesEl.textContent = "3";

  function resetBall() {
    ball.x = gameWidth / 2;
    ball.y = gameHeight - 45;
    ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -3;
    paddle.x = gameWidth / 2 - paddle.width / 2;
  }

  function drawPaddle() {
    ctx.fillStyle = "#d67fff";
    ctx.fillRect(paddle.x, gameHeight - paddle.height - 12, paddle.width, paddle.height);
  }

  function drawBall() {
    if (avatarImage && avatarImage.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
      ctx.restore();
      return;
    }

    ctx.fillStyle = "#bb4dff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBricks() {
    for (let r = 0; r < brickRows; r += 1) {
      for (let c = 0; c < brickCols; c += 1) {
        const brick = bricks[r][c];
        if (brick.status !== 1) continue;
        ctx.fillStyle = r % 2 ? "#b769ff" : "#8f42ff";
        ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
      }
    }
  }

  function drawOverlay() {
    if (!gameOver && !gameWon) return;
    ctx.fillStyle = "rgba(15, 18, 27, 0.82)";
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = "#f3f4f7";
    ctx.textAlign = "center";
    ctx.font = "700 32px Inter, sans-serif";
    ctx.fillText(gameWon ? "¡Ganaste!" : "Game Over", gameWidth / 2, gameHeight / 2 - 10);
    ctx.font = "500 18px Inter, sans-serif";
    ctx.fillText("Pulsa el botón para jugar otra vez", gameWidth / 2, gameHeight / 2 + 28);
  }

  function collisionDetection() {
    for (let r = 0; r < brickRows; r += 1) {
      for (let c = 0; c < brickCols; c += 1) {
        const brick = bricks[r][c];
        if (
          brick.status === 1 &&
          ball.x > brick.x &&
          ball.x < brick.x + brickWidth &&
          ball.y > brick.y &&
          ball.y < brick.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score += 10;
          scoreEl.textContent = String(score);
          if (score === brickRows * brickCols * 10) gameWon = true;
        }
      }
    }
  }

  function update() {
    if (gameOver || gameWon) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > gameWidth || ball.x - ball.radius < 0) ball.dx = -ball.dx;
    if (ball.y - ball.radius < 0) ball.dy = -ball.dy;

    const paddleY = gameHeight - paddle.height - 12;
    if (ball.y + ball.radius >= paddleY && ball.x >= paddle.x && ball.x <= paddle.x + paddle.width && ball.dy > 0) {
      ball.dy = -ball.dy;
      const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      ball.dx = 4 * hitPoint;
    }

    if (ball.y + ball.radius > gameHeight) {
      lives -= 1;
      livesEl.textContent = String(lives);
      if (lives <= 0) gameOver = true;
      else resetBall();
    }

    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > gameWidth) paddle.x = gameWidth - paddle.width;

    collisionDetection();
  }

  function draw() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    drawBricks();
    drawPaddle();
    drawBall();
    drawOverlay();
  }

  function loop() {
    update();
    draw();
    bricksAnimationId = requestAnimationFrame(loop);
  }

  window.onkeydown = (event) => {
    if (event.key === "ArrowRight") paddle.dx = paddle.speed;
    if (event.key === "ArrowLeft") paddle.dx = -paddle.speed;
  };

  window.onkeyup = (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") paddle.dx = 0;
  };

  canvas.ontouchmove = (event) => {
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const relativeX = touch.clientX - rect.left;
    paddle.x = (relativeX * canvas.width) / rect.width - paddle.width / 2;
    event.preventDefault();
  };

  loop();
}

function startPuzzleGame() {
  const ctx = puzzleCanvas.getContext("2d");
  const boardSize = 3;
  const tileSize = puzzleCanvas.width / boardSize;
  const solved = Array.from({ length: boardSize * boardSize }, (_, i) => i);
  let tiles = [...solved];
  let selected = null;
  let moves = 0;

  movesEl.textContent = "0";
  puzzleStatusEl.textContent = "Jugando";

  function shuffleTiles() {
    for (let i = 0; i < 120; i += 1) {
      const a = Math.floor(Math.random() * tiles.length);
      const b = Math.floor(Math.random() * tiles.length);
      [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
    }
    if (tiles.every((v, i) => v === solved[i])) shuffleTiles();
  }

  function drawTile(value, drawIndex) {
    const sx = (value % boardSize) * tileSize;
    const sy = Math.floor(value / boardSize) * tileSize;
    const dx = (drawIndex % boardSize) * tileSize;
    const dy = Math.floor(drawIndex / boardSize) * tileSize;

    if (avatarImage && avatarImage.complete) {
      ctx.drawImage(avatarImage, sx, sy, tileSize, tileSize, dx, dy, tileSize, tileSize);
    } else {
      ctx.fillStyle = "#8f42ff";
      ctx.fillRect(dx, dy, tileSize, tileSize);
      ctx.fillStyle = "#fff";
      ctx.font = "700 28px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(value + 1), dx + tileSize / 2, dy + tileSize / 2 + 10);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.strokeRect(dx, dy, tileSize, tileSize);

    if (selected === drawIndex) {
      ctx.strokeStyle = "#d67fff";
      ctx.lineWidth = 4;
      ctx.strokeRect(dx + 2, dy + 2, tileSize - 4, tileSize - 4);
      ctx.lineWidth = 1;
    }
  }

  function drawBoard() {
    ctx.clearRect(0, 0, puzzleCanvas.width, puzzleCanvas.height);
    tiles.forEach((value, idx) => drawTile(value, idx));
  }

  function checkWin() {
    if (!tiles.every((v, i) => v === solved[i])) return;
    puzzleStatusEl.textContent = "Completado";
  }

  function onCanvasSelect(event) {
    if (puzzleStatusEl.textContent === "Completado") return;

    const rect = puzzleCanvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const x = ((clientX - rect.left) * puzzleCanvas.width) / rect.width;
    const y = ((clientY - rect.top) * puzzleCanvas.height) / rect.height;
    const col = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);
    const index = row * boardSize + col;

    if (selected === null) {
      selected = index;
    } else if (selected !== index) {
      [tiles[selected], tiles[index]] = [tiles[index], tiles[selected]];
      moves += 1;
      movesEl.textContent = String(moves);
      selected = null;
      checkWin();
    } else {
      selected = null;
    }

    drawBoard();
    if (event.touches) event.preventDefault();
  }

  shuffleTiles();
  drawBoard();
  puzzleCanvas.onclick = onCanvasSelect;
  puzzleCanvas.ontouchstart = onCanvasSelect;
}

function initRevealAnimation() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

async function loadPortfolio() {
  try {
    const [userResponse, repoResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100&type=owner`)
    ]);

    if (!userResponse.ok || !repoResponse.ok) {
      throw new Error("No se pudo cargar la información de GitHub en este momento.");
    }

    const [user, repos] = await Promise.all([userResponse.json(), repoResponse.json()]);

    avatar.src = user.avatar_url;
    avatar.alt = `Avatar de ${user.login}`;
    nameEl.textContent = user.name || user.login;
    careerTitleEl.textContent = "Lic. en Tecnologías de la Información y Comunicación";
    bioEl.textContent =
      translateGithubBio(user.bio) ||
      "Profesional de TI orientado a soporte, continuidad operativa y mejora continua.";

    githubLink.href = user.html_url;
    linkedinLink.href = LINKEDIN_URL;

    if (user.blog) {
      const normalized = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
      blogLink.href = normalized;
    } else {
      blogLink.style.display = "none";
    }

    renderProfileFromPdf(user, repos);

    avatarImage = new Image();
    avatarImage.crossOrigin = "anonymous";
    avatarImage.src = user.avatar_url;
    avatarImage.onload = () => {
      showWaitingState();
    };
  } catch (error) {
    nameEl.textContent = "Portafolio de GitHub";
    bioEl.textContent = "Hubo un problema cargando los datos de GitHub.";
    careerSummaryEl.textContent =
      "No se pudo cargar el perfil en este momento, pero puedes revisar la experiencia y certificaciones en el PDF compartido.";

    toList(experienceList, profileFromPdf.experience);
    toList(certificationsList, profileFromPdf.certifications);
    toList(educationList, profileFromPdf.education);
    toList(skillsList, profileFromPdf.skills);
    publicDataList.innerHTML = `<li><a class=\"info-link\" href=\"${LINKEDIN_URL}\" target=\"_blank\" rel=\"noreferrer\">Ver perfil de LinkedIn</a></li>`;
  }
}

startBricksButton.addEventListener("click", startBreakBricks);
startPuzzleButton.addEventListener("click", startPuzzleGame);
yearEl.textContent = String(new Date().getFullYear());
initRevealAnimation();
showWaitingState();
loadPortfolio();
