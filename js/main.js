const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");

if (menuToggle && header) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const revealTargets = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("in"));
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const subject = formData.get("servicio") || "Consulta ArqiFeng";
    const body = [
      `Nombre: ${formData.get("nombre") || ""}`,
      `Telefono: ${formData.get("telefono") || ""}`,
      `Email: ${formData.get("email") || ""}`,
      `Ciudad o comuna: ${formData.get("ciudad") || ""}`,
      `Tipo de espacio: ${formData.get("tipo") || ""}`,
      `Servicio de interes: ${formData.get("servicio") || ""}`,
      "",
      formData.get("mensaje") || "",
    ].join("\n");

    window.location.href = `mailto:arqifeng@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    const status = contactForm.querySelector(".form-status");
    if (status) {
      status.textContent = "Se abrira tu cliente de correo para enviar la consulta.";
    }
  });
}
