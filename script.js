const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");

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

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#contact-message").value.trim();
  window.location.href = `mailto:hello@samsonthomas.dev?subject=${encodeURIComponent("Portfolio enquiry")}&body=${encodeURIComponent(message)}`;
});
