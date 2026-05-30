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

function createFormFeedback() {
  const root = document.createElement("div");
  root.className = "form-feedback";
  root.hidden = true;
  root.innerHTML = `
    <div class="form-feedback__backdrop" data-form-feedback-close></div>
    <div
      class="form-feedback__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-feedback-title"
    >
      <button
        class="form-feedback__close"
        type="button"
        aria-label="Cerrar mensaje"
        data-form-feedback-close
      >
        &times;
      </button>
      <p class="form-feedback__icon" aria-hidden="true"></p>
      <h2 class="form-feedback__title" id="form-feedback-title"></h2>
      <p class="form-feedback__message text-p4"></p>
      <button class="button btn-primary text-p4 form-feedback__action" type="button" data-form-feedback-close>
        Entendido
      </button>
    </div>
  `;
  document.body.appendChild(root);

  const icon = root.querySelector(".form-feedback__icon");
  const title = root.querySelector(".form-feedback__title");
  const message = root.querySelector(".form-feedback__message");
  let hideTimer = null;

  const hide = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    root.classList.remove("is-visible");
    document.body.classList.remove("form-feedback-open");

    window.setTimeout(() => {
      if (!root.classList.contains("is-visible")) {
        root.hidden = true;
      }
    }, 280);
  };

  const show = ({ type, titleText, messageText, autoHideMs = 5500 }) => {
    root.classList.remove("form-feedback--success", "form-feedback--error");
    root.classList.add(type === "success" ? "form-feedback--success" : "form-feedback--error");

    icon.textContent = type === "success" ? "✓" : "!";
    title.textContent = titleText;
    message.textContent = messageText;

    root.hidden = false;
    requestAnimationFrame(() => {
      root.classList.add("is-visible");
    });
    document.body.classList.add("form-feedback-open");

    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    if (autoHideMs > 0) {
      hideTimer = window.setTimeout(hide, autoHideMs);
    }
  };

  root.querySelectorAll("[data-form-feedback-close]").forEach((element) => {
    element.addEventListener("click", hide);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.classList.contains("is-visible")) {
      hide();
    }
  });

  return { show, hide };
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  const emailConfig = window.EMAILJS_CONFIG;
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const formFeedback = createFormFeedback();

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!emailConfig || typeof emailjs === "undefined") {
      formFeedback.show({
        type: "error",
        titleText: "Envío no disponible",
        messageText: "El envío por correo no está configurado. Intenta más tarde.",
        autoHideMs: 7000,
      });
      return;
    }

    const originalText = submitBtn?.textContent;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";
    }

    emailjs
      .sendForm(emailConfig.serviceId, emailConfig.templateId, contactForm)
      .then(() => {
        contactForm.reset();
        formFeedback.show({
          type: "success",
          titleText: "Consulta enviada",
          messageText:
            "¡Gracias! Tu consulta fue enviada. Te responderemos pronto.",
          autoHideMs: 3500,
        });
      })
      .catch((err) => {
        console.error(err);
        formFeedback.show({
          type: "error",
          titleText: "No se pudo enviar",
          messageText:
            "No pudimos enviar el mensaje. Intenta de nuevo o escríbenos directamente.",
          autoHideMs: 4000,
        });
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText || "Enviar consulta";
        }
      });
  });
}
