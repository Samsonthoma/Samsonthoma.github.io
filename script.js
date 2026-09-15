const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

const yearNode = document.querySelector("#year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

// Email Handler with Device-Aware Options
const contactForm = document.querySelector(".contact-form");
const emailModal = document.getElementById("email-modal");
const closeModalBtn = document.getElementById("close-modal");

let currentEmailData = { mailto: "", gmailWeb: "", outlookWeb: "" };

if (contactForm && emailModal && closeModalBtn) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const userMessage = document.querySelector("#contact-message").value.trim();
    const recipient = "samsonthomasminithomas@gmail.com";
    const subject = "[Portfolio Inquiry] Message from Samson Thomas Website";
    const body = `Hello Samson,\n\n${userMessage}\n\n-------------------------------\nSent from Portfolio Website (samsonthoma.github.io)`;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    currentEmailData.mailto = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
    currentEmailData.gmailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodedSubject}&body=${encodedBody}`;
    currentEmailData.outlookWeb = `https://outlook.live.com/mail/0/deeplink/compose?to=${recipient}&subject=${encodedSubject}&body=${encodedBody}`;

    const isMobileOrTablet = window.innerWidth <= 768;

    if (isMobileOrTablet) {
      window.location.href = currentEmailData.mailto;
    } else {
      emailModal.classList.add("active");
    }
  });

  document.getElementById("opt-gmail").addEventListener("click", () => {
    window.open(currentEmailData.gmailWeb, "_blank");
    emailModal.classList.remove("active");
  });

  document.getElementById("opt-default").addEventListener("click", () => {
    window.location.href = currentEmailData.mailto;
    emailModal.classList.remove("active");
  });

  document.getElementById("opt-outlook").addEventListener("click", () => {
    window.open(currentEmailData.outlookWeb, "_blank");
    emailModal.classList.remove("active");
  });

  closeModalBtn.addEventListener("click", () => {
    emailModal.classList.remove("active");
  });
}

const filterPills = document.querySelectorAll(".filter-pill");
const projectCards = document.querySelectorAll(".project-card");
const projectPills = document.querySelectorAll(".project-pill");

function applyProjectFilter(filter) {
  projectCards.forEach((card) => {
    const tags = card.dataset.tags || "";
    const visible = filter === "all" || tags.includes(filter);
    card.classList.toggle("hidden", !visible);
  });

  filterPills.forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.filter === filter);
  });
}

filterPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    applyProjectFilter(pill.dataset.filter || "all");
  });
});

projectPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    applyProjectFilter(pill.dataset.filter || "all");
    const projectsSection = document.querySelector("#my-works");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const copyPromptBtn = document.getElementById("copy-prompt");
const copyStatus = document.getElementById("copy-status");
const promptSnippet = document.getElementById("prompt-snippet");

if (copyPromptBtn && copyStatus && promptSnippet) {
  copyPromptBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(promptSnippet.textContent.trim());
      copyStatus.textContent = "Prompt copied.";
    } catch (error) {
      copyStatus.textContent = "Could not copy automatically. Select and copy manually.";
    }
  });
}

async function fetchGitHubStats() {
  const username = "Samsonthoma";
  const repoStatNode = document.getElementById("stat-repos");
  const commitStatNode = document.getElementById("stat-commits");
  const prStatNode = document.getElementById("stat-prs");
  const followerStatNode = document.getElementById("stat-followers");
  const languageListNode = document.getElementById("language-list");

  if (!repoStatNode || !commitStatNode || !prStatNode || !followerStatNode || !languageListNode) {
    return;
  }

  try {
    const [userRes, eventsRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    ]);

    if (!userRes.ok || !eventsRes.ok || !reposRes.ok) {
      throw new Error("GitHub API unavailable");
    }

    const user = await userRes.json();
    const events = await eventsRes.json();
    const repos = await reposRes.json();

    const commitCount = events.filter((event) => event.type === "PushEvent").reduce((sum, event) => {
      const commitTotal = event.payload && Array.isArray(event.payload.commits) ? event.payload.commits.length : 0;
      return sum + commitTotal;
    }, 0);

    const prCount = events.filter((event) => event.type === "PullRequestEvent").length;

    repoStatNode.textContent = user.public_repos ?? "0";
    commitStatNode.textContent = String(commitCount);
    prStatNode.textContent = String(prCount);
    followerStatNode.textContent = user.followers ?? "0";

    const topRepos = repos.slice(0, 10);
    const languageTotals = {};

    await Promise.all(
      topRepos.map(async (repo) => {
        if (!repo.languages_url) {
          return;
        }
        const languageRes = await fetch(repo.languages_url);
        if (!languageRes.ok) {
          return;
        }
        const languageData = await languageRes.json();
        Object.entries(languageData).forEach(([language, value]) => {
          languageTotals[language] = (languageTotals[language] || 0) + Number(value);
        });
      })
    );

    const sortedLanguages = Object.entries(languageTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (!sortedLanguages.length) {
      languageListNode.innerHTML = "<li>No language data available right now.</li>";
      return;
    }

    languageListNode.innerHTML = sortedLanguages
      .map(([language, value]) => `<li>${language}: ${value.toLocaleString()} bytes</li>`)
      .join("");
  } catch (error) {
    repoStatNode.textContent = "N/A";
    commitStatNode.textContent = "N/A";
    prStatNode.textContent = "N/A";
    followerStatNode.textContent = "N/A";
    languageListNode.innerHTML = "<li>GitHub stats are temporarily unavailable.</li>";
  }
}

fetchGitHubStats();
