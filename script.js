const USERNAME = "Daner1ck";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/erick-rodr%C3%ADguez-062911230?utm_source=share_via&utm_content=profile&utm_medium=member_android";

const avatar = document.querySelector("#avatar");
const nameEl = document.querySelector("#name");
const careerTitleEl = document.querySelector("#career-title");
const bioEl = document.querySelector("#bio");
const githubLink = document.querySelector("#github-link");
const linkedinLink = document.querySelector("#linkedin-link");
const blogLink = document.querySelector("#blog-link");
const experienceList = document.querySelector("#experience-list");
const certificationsList = document.querySelector("#certifications-list");
const publicDataList = document.querySelector("#public-data-list");
const scoreEl = document.querySelector("#score");
const livesEl = document.querySelector("#lives");
const canvas = document.querySelector("#brick-game");

let avatarImage = null;

function translateGithubBio(text) {
  if (!text) return "";

  const exactTranslations = new Map([
    [
      "I'm a 22-year-old who loves programming and video games. I enjoy self-learning and staying up-to-date with technology.",
      "Tengo 22 años, me apasiona la programación y los videojuegos. Disfruto aprender por mi cuenta y mantenerme al día con la tecnología."
    ]
  ]);

  if (exactTranslations.has(text.trim())) {
    return exactTranslations.get(text.trim());
  }

  return `Perfil de GitHub: ${text}`;
}

function renderProfessionalProfile(user, repos) {
  const repoCount = repos.length;

  const experience = [
    "Desarrollador enfocado en aprendizaje continuo y proyectos personales de software.",
    `Actividad pública en GitHub con ${repoCount} repositorios disponibles.`,
    "Perfil profesional complementado con presencia pública en LinkedIn."
  ];

  const certifications = [
    "No se detectaron certificaciones públicas accesibles automáticamente en esta ejecución.",
    "Comparte tus certificaciones y se integran aquí en formato profesional."
  ];

  const publicDetails = [
    `Usuario de GitHub: ${user.login}`,
    user.location ? `Ubicación pública: ${user.location}` : "Ubicación pública: no especificada",
    user.company ? `${user.company}` : "Sin organización pública visible",
    `<a class=\"info-link\" href=\"${LINKEDIN_URL}\" target=\"_blank\" rel=\"noreferrer\">LinkedIn</a>`
  ];

  experienceList.innerHTML = experience.map((item) => `<li>${item}</li>`).join("");
  certificationsList.innerHTML = certifications.map((item) => `<li>${item}</li>`).join("");
  publicDataList.innerHTML = publicDetails.map((item) => `<li>${item}</li>`).join("");
}

function initBreakBricks() {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const gameWidth = canvas.width;
  const gameHeight = canvas.height;

  const paddle = {
    width: 130,
    height: 12,
    x: gameWidth / 2 - 65,
    speed: 8,
    dx: 0
  };

  const ball = {
    x: gameWidth / 2,
    y: gameHeight - 45,
    radius: 11,
    dx: 3,
    dy: -3
  };

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
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
      ctx.restore();
    } else {
      ctx.fillStyle = "#bb4dff";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }

  function drawBricks() {
    for (let r = 0; r < brickRows; r += 1) {
      for (let c = 0; c < brickCols; c += 1) {
        const brick = bricks[r][c];
        if (brick.status === 1) {
          ctx.fillStyle = r % 2 ? "#b769ff" : "#8f42ff";
          ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
        }
      }
    }
  }

  function drawTextOverlay() {
    if (!gameOver && !gameWon) return;

    ctx.fillStyle = "rgba(15, 18, 27, 0.82)";
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    ctx.textAlign = "center";
    ctx.fillStyle = "#f3f4f7";
    ctx.font = "700 32px Inter, sans-serif";
    ctx.fillText(gameWon ? "¡Ganaste!" : "Game Over", gameWidth / 2, gameHeight / 2 - 10);
    ctx.font = "500 18px Inter, sans-serif";
    ctx.fillText("Recarga la página para jugar de nuevo", gameWidth / 2, gameHeight / 2 + 28);
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

          if (score === brickRows * brickCols * 10) {
            gameWon = true;
          }
        }
      }
    }
  }

  function update() {
    if (gameOver || gameWon) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > gameWidth || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
    }

    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }

    const paddleY = gameHeight - paddle.height - 12;
    if (
      ball.y + ball.radius >= paddleY &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width &&
      ball.dy > 0
    ) {
      ball.dy = -ball.dy;
      const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      ball.dx = 4 * hitPoint;
    }

    if (ball.y + ball.radius > gameHeight) {
      lives -= 1;
      livesEl.textContent = String(lives);
      if (lives <= 0) {
        gameOver = true;
      } else {
        resetBall();
      }
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
    drawTextOverlay();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") paddle.dx = paddle.speed;
    if (event.key === "ArrowLeft") paddle.dx = -paddle.speed;
  });

  window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") paddle.dx = 0;
  });

  canvas.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const relativeX = touch.clientX - rect.left;
    const scaleX = gameWidth / rect.width;
    paddle.x = relativeX * scaleX - paddle.width / 2;
    event.preventDefault();
  });

  loop();
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
    careerTitleEl.textContent = "Ingeniería en Sistemas • Desarrollo de Software";
    bioEl.textContent =
      translateGithubBio(user.bio) ||
      "Programador apasionado por construir cosas útiles, aprender rápido y mejorar en cada proyecto.";

    githubLink.href = user.html_url;
    linkedinLink.href = LINKEDIN_URL;

    if (user.blog) {
      const normalized = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
      blogLink.href = normalized;
    } else {
      blogLink.style.display = "none";
    }

    renderProfessionalProfile(user, repos);

    avatarImage = new Image();
    avatarImage.src = user.avatar_url;
    avatarImage.crossOrigin = "anonymous";

    initBreakBricks();
  } catch (error) {
    nameEl.textContent = "Portafolio de GitHub";
    bioEl.textContent = "Hubo un problema cargando los datos de GitHub.";
    experienceList.innerHTML = "<li>No fue posible cargar la experiencia en este momento.</li>";
    certificationsList.innerHTML = "<li>No fue posible cargar certificaciones en este momento.</li>";
    publicDataList.innerHTML = `<li><a class=\"info-link\" href=\"${LINKEDIN_URL}\" target=\"_blank\" rel=\"noreferrer\">LinkedIn</a></li>`;
    initBreakBricks();
  }
}

loadPortfolio();
