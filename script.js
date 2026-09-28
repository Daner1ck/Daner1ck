const USERNAME = "Daner1ck";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/erick-rodr%C3%ADguez-062911230?utm_source=share_via&utm_content=profile&utm_medium=member_android";

const avatar = document.querySelector("#avatar");
const nameEl = document.querySelector("#name");
const bioEl = document.querySelector("#bio");
const githubLink = document.querySelector("#github-link");
const linkedinLink = document.querySelector("#linkedin-link");
const blogLink = document.querySelector("#blog-link");
const statsEl = document.querySelector("#stats");
const repoGrid = document.querySelector("#repo-grid");
const languageTags = document.querySelector("#language-tags");
const experienceList = document.querySelector("#experience-list");
const certificationsList = document.querySelector("#certifications-list");
const publicDataList = document.querySelector("#public-data-list");
const repoTemplate = document.querySelector("#repo-template");

const compact = new Intl.NumberFormat("es-ES", { notation: "compact" });

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
  const recentRepos = [...repos]
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 3)
    .map((repo) => repo.name);

  const experience = [
    "Desarrollador enfocado en aprendizaje continuo y proyectos personales de software.",
    recentRepos.length
      ? `Trabajo activo en proyectos públicos como: ${recentRepos.join(", ")}.`
      : "Actividad constante construyendo y mejorando repositorios públicos.",
    "Perfil profesional complementado con presencia pública en LinkedIn."
  ];

  const certifications = [
    "No se detectaron certificaciones públicas accesibles automáticamente en esta ejecución.",
    "Puedes añadir tus certificaciones de LinkedIn para mostrarlas aquí con más detalle."
  ];

  const publicDetails = [
    `Usuario de GitHub: ${user.login}`,
    user.location ? `Ubicación pública: ${user.location}` : "Ubicación pública: no especificada",
    user.company ? `Organización: ${user.company}` : "Organización: no especificada",
    `LinkedIn: ${LINKEDIN_URL}`
  ];

  experienceList.innerHTML = experience.map((item) => `<li>${item}</li>`).join("");
  certificationsList.innerHTML = certifications.map((item) => `<li>${item}</li>`).join("");
  publicDataList.innerHTML = publicDetails.map((item) => `<li>${item}</li>`).join("");
}

function setStats(user) {
  const stats = [
    ["Seguidores", user.followers],
    ["Siguiendo", user.following],
    ["Repos públicos", user.public_repos],
    ["Gists", user.public_gists]
  ];

  statsEl.innerHTML = stats
    .map(
      ([label, value]) =>
        `<div class="stat"><strong>${compact.format(value)}</strong><span>${label}</span></div>`
    )
    .join("");
}

function renderRepos(repos) {
  if (!repos.length) {
    repoGrid.innerHTML = '<p class="empty">No hay repositorios para mostrar.</p>';
    return;
  }

  const cards = repos.slice(0, 6).map((repo) => {
    const fragment = repoTemplate.content.cloneNode(true);
    fragment.querySelector(".repo-name").textContent = repo.name;
    fragment.querySelector(".repo-stars").textContent = `★ ${compact.format(repo.stargazers_count)}`;
    fragment.querySelector(".repo-desc").textContent = repo.description || "Sin descripción pública.";
    fragment.querySelector(".repo-lang").textContent = repo.language || "N/A";

    const link = fragment.querySelector(".repo-link");
    link.href = repo.html_url;
    return fragment;
  });

  repoGrid.innerHTML = "";
  repoGrid.append(...cards);
}

function renderLanguages(repos) {
  const count = repos.reduce((acc, repo) => {
    if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
    return acc;
  }, {});

  const languages = Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (!languages.length) {
    languageTags.innerHTML = '<p class="empty">No hay tecnologías detectadas aún.</p>';
    return;
  }

  languageTags.innerHTML = languages
    .map(([lang, total]) => `<span class="tag">${lang} · ${total}</span>`)
    .join("");
}

function renderError(message) {
  repoGrid.innerHTML = `<p class="error">${message}</p>`;
  languageTags.innerHTML = "";
  statsEl.innerHTML = "";
}

async function loadPortfolio() {
  try {
    const [userResponse, repoResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(
        `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100&type=owner`
      )
    ]);

    if (!userResponse.ok || !repoResponse.ok) {
      throw new Error("No se pudo cargar la información de GitHub en este momento.");
    }

    const [user, repos] = await Promise.all([userResponse.json(), repoResponse.json()]);

    avatar.src = user.avatar_url;
    avatar.alt = `Avatar de ${user.login}`;
    nameEl.textContent = user.name || user.login;
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

    setStats(user);

    const notableRepos = [...repos].sort(
      (a, b) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count
    );

    renderRepos(notableRepos);
    renderLanguages(repos);
    renderProfessionalProfile(user, repos);
  } catch (error) {
    nameEl.textContent = "Portafolio de GitHub";
    bioEl.textContent = "Hubo un problema cargando los datos de GitHub.";
    renderError(error.message);
    experienceList.innerHTML = "<li>No fue posible cargar la experiencia en este momento.</li>";
    certificationsList.innerHTML = "<li>No fue posible cargar certificaciones en este momento.</li>";
    publicDataList.innerHTML = `<li>LinkedIn: ${LINKEDIN_URL}</li>`;
  }
}

loadPortfolio();
