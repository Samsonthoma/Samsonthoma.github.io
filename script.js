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

// Email Handler with Device-Aware Options
const contactForm = document.querySelector(".contact-form");
const emailModal = document.getElementById("email-modal");
const closeModalBtn = document.getElementById("close-modal");

let currentEmailData = { mailto: "", gmailWeb: "", outlookWeb: "" };

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userMessage = document.querySelector("#contact-message").value.trim();
  const recipient = "samsonthomasminithomas@gmail.com";
  
  // Explicit subject and origin signature to identify portfolio leads
  const subject = "[Portfolio Inquiry] Message from Samson Thomas Website";
  const body = `Hello Samson,\n\n${userMessage}\n\n-------------------------------\nSent from Portfolio Website (samsonthoma.github.io)`;

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  // Generate Email URLs
  currentEmailData.mailto = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
  currentEmailData.gmailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodedSubject}&body=${encodedBody}`;
  currentEmailData.outlookWeb = `https://outlook.live.com/mail/0/deeplink/compose?to=${recipient}&subject=${encodedSubject}&body=${encodedBody}`;

  // Check device screen width
  const isMobileOrTablet = window.innerWidth <= 768;

  if (isMobileOrTablet) {
    // Mobile/Tablet: Direct mailto triggers native OS app prompt (Gmail, Outlook, Mail app)
    window.location.href = currentEmailData.mailto;
  } else {
    // Desktop/Laptop: Show modal choice (Gmail Web, Outlook/Desktop App)
    emailModal.classList.add("active");
  }
});

// Modal Actions
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
