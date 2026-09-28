const USERNAME = "Daner1ck";

const avatar = document.querySelector("#avatar");
const nameEl = document.querySelector("#name");
const bioEl = document.querySelector("#bio");
const githubLink = document.querySelector("#github-link");
const blogLink = document.querySelector("#blog-link");
const statsEl = document.querySelector("#stats");
const repoGrid = document.querySelector("#repo-grid");
const languageTags = document.querySelector("#language-tags");
const repoTemplate = document.querySelector("#repo-template");

const compact = new Intl.NumberFormat("es-ES", { notation: "compact" });

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
      user.bio ||
      "Programador apasionado por construir cosas útiles, aprender rápido y mejorar en cada proyecto.";

    githubLink.href = user.html_url;

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
  } catch (error) {
    nameEl.textContent = "Portafolio de GitHub";
    bioEl.textContent = "Hubo un problema cargando los datos de GitHub.";
    renderError(error.message);
  }
}

loadPortfolio();
