// ==== HELPERS ====
const $id = (id) => document.getElementById(id);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const setHref = (id, url) => {
  const el = $id(id);
  if (el) el.href = url;
};
const setText = (id, text) => {
  const el = $id(id);
  if (el) el.textContent = text;
};

// ==== CONFIG ====
const PHONE_E164 = "34611431885"; // +34 611 431 885 (sin + ni espacios)
const IG_URL = "https://instagram.com/karla.masajesybelleza";
const WA_TEXT = encodeURIComponent(
  "Hola Karla, me gustaría reservar una cita. ¿Qué disponibilidad tienes esta semana?"
);

const waLink = `https://wa.me/${PHONE_E164}?text=${WA_TEXT}`;

// Botones principales
setHref("btnWhats", waLink);
setHref("btnWhats2", waLink);
setHref("btnIg", IG_URL);

// WhatsApp por categoría
const waMasajes = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  "Hola Karla, quiero reservar un masaje o consultar los bonos personalizados. ¿Qué opciones tienes?"
)}`;
const waMadero = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  "Hola Karla, quiero información sobre el bono de 5 sesiones de maderoterapia y los bonos personalizados. ¿Qué me recomiendas?"
)}`;
const waDrenajeCorporal = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  "Hola Karla, quiero información sobre el drenaje linfático brasileño corporal y la promoción de este mes."
)}`;
const waDrenajeFacial = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  "Hola Karla, quiero información sobre el drenaje facial y el precio de lanzamiento para las primeras clientas."
)}`;
const waHolistico = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  "Hola Karla, quiero reservar un ritual holístico. ¿Qué disponibilidad tienes?"
)}`;
const waBelleza = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  "Hola Karla, quiero reservar un servicio de belleza (semipermanente / lifting). ¿Disponibilidad?"
)}`;

setHref("waMasajes", waMasajes);
setHref("waHolistico", waHolistico);
setHref("waMadero", waMadero);
setHref("waDrenajeCorporal", waDrenajeCorporal);
setHref("waDrenajeFacial", waDrenajeFacial);
setHref("waBelleza", waBelleza);

// Año en footer
setText("year", new Date().getFullYear());

// Maps
const MAPS_URL =
  "https://www.google.com/maps?q=" +
  encodeURIComponent("C/ Bidemokarte 1, Huarte, Peluquería Ilea");
setHref("btnMaps", MAPS_URL);

// ==== Intro de marca + tarjeta regalo destacada ====
const intro = $id("brandIntro");
const introSkip = $id("introSkip");
const offerTeaser = $id("offerTeaser");
const flashOffer = $id("flashOffer");
const offerDialog = $id("offerDialog");
const offerWhatsapp = $id("offerWhatsapp");
let lastOfferTrigger = null;
let teaserTimer = null;

const giftText = encodeURIComponent(
  "Hola Karla, quiero preparar una tarjeta regalo. Me gustaría elegir un servicio o un importe. ¿Me ayudas?"
);
if (offerWhatsapp) {
  offerWhatsapp.href = `https://wa.me/${PHONE_E164}?text=${giftText}`;
}
setHref("waGiftSection", `https://wa.me/${PHONE_E164}?text=${giftText}`);

const finishIntro = () => {
  if (!intro || intro.classList.contains("isLeaving")) return;
  intro.classList.add("isLeaving");
  document.body.classList.remove("introActive");
  window.setTimeout(() => {
    intro.hidden = true;
    showOfferTeaser();
  }, 850);
};

const collapseOfferTeaser = () => {
  if (!offerTeaser || offerTeaser.classList.contains("isCollapsing")) return;
  offerTeaser.classList.add("isCollapsing");
  window.setTimeout(() => {
    offerTeaser.hidden = true;
    flashOffer?.classList.add("isVisible");
  }, prefersReducedMotion ? 100 : 900);
};

const showOfferTeaser = () => {
  if (!offerTeaser) {
    flashOffer?.classList.add("isVisible");
    return;
  }
  offerTeaser.hidden = false;
  requestAnimationFrame(() => offerTeaser.classList.add("isVisible"));
  teaserTimer = window.setTimeout(collapseOfferTeaser, prefersReducedMotion ? 900 : 3000);
};

if (intro) {
  document.body.classList.add("introActive");
  const introDuration = prefersReducedMotion ? 700 : 3900;
  window.setTimeout(finishIntro, introDuration);
  introSkip?.addEventListener("click", finishIntro);
}

const openOffer = () => {
  if (!offerDialog) return;
  if (teaserTimer) window.clearTimeout(teaserTimer);
  if (offerTeaser && !offerTeaser.hidden) {
    offerTeaser.hidden = true;
    flashOffer?.classList.add("isVisible");
  }
  lastOfferTrigger = document.activeElement;
  offerDialog.hidden = false;
  document.body.classList.add("offerOpen");
  requestAnimationFrame(() => offerDialog.classList.add("isOpen"));
  offerDialog.querySelector(".offerClose")?.focus();
};

const closeOffer = () => {
  if (!offerDialog || offerDialog.hidden) return;
  offerDialog.classList.remove("isOpen");
  document.body.classList.remove("offerOpen");
  window.setTimeout(() => {
    offerDialog.hidden = true;
    lastOfferTrigger?.focus?.();
  }, 350);
};

flashOffer?.addEventListener("click", openOffer);
offerTeaser?.addEventListener("click", openOffer);
offerDialog?.querySelectorAll("[data-close-offer]").forEach((el) => {
  el.addEventListener("click", closeOffer);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeOffer();
});

// ==== Reveal ====
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  // Fallback: si el navegador no soporta IO, muéstralo todo
  reveals.forEach((el) => el.classList.add("on"));
}

// ==== Smooth scroll ====
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (ev) => {
    const hash = a.getAttribute("href");
    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);
    if (!target) return;

    ev.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ==== Tabs ====
const data = {
  bienestar: {
    title: "Bienestar",
    img: "img/bienestar-karla.jpeg",
    alt: "Cabina de masajes y bienestar de Karla Castañeda en Huarte",
    items: [
      "Masaje relajante con aceites esenciales",
      "Masaje facial japonés",
      "Masaje cráneo-facial",
      "Masaje descontracturante",
      "Masaje para piernas cansadas",
      "Masaje con piedras calientes",
      "Masaje de pies",
    ],
    note: "Perfecto si buscas soltar tensión, desconectar y recuperar energía.",
  },
  reductores: {
    title: "Reductores",
    img: "img/reductores.jpg",
    alt: "Tratamientos reductores y maderoterapia",
    items: [
      "Drenaje linfático brasileño corporal",
      "Drenaje facial",
      "Maderoterapia moldeadora",
    ],
    note: "Enfoque en circulación, textura y definición. Ideal con plan de sesiones.",
  },
  belleza: {
    title: "Belleza",
    img: "img/belleza.jpg",
    alt: "Tratamientos de belleza",
    items: [
      "Lifting y tinte de pestañas",
      "Extensión de pestañas pelo a pelo",
      "Depilación de cejas con pinza",
      "Diseño de cejas con henna",
      "Manicura",
      "Esmaltado semipermanente",
      "Uñas de gel / polygel",
    ],
    note: "Acabados finos y naturales, cuidando siempre la salud de pestañas y uñas.",
  },
  depilacion: {
    title: "Depilación",
    img: "img/depilacion.jpg",
    alt: "Depilación facial y corporal",
    items: [
      "Depilación facial con cera caliente (labio y mentón)",
      "Depilación corporal con cera templada",
    ],
    note: "Piel más suave y limpia. Te indico cuidados post-tratamiento para evitar irritación.",
  },
};

const tabs = document.querySelectorAll(".tab");
const content = $id("tabContent");
const tabImage = $id("tabImage");

function renderTab(key) {
  const d = data[key];
  if (!d || !content || !tabImage) return;

  content.innerHTML = `
    <h3>${d.title}</h3>
    <ul class="bullets">
      ${d.items.map((i) => `<li>${i}</li>`).join("")}
    </ul>
    <div class="hint">
      <b>Recomendación:</b> ${d.note}
    </div>
    <div class="heroCTA" style="margin-top:14px;">
      <a class="btn btn-primary" href="${waLink}">Reservar por WhatsApp →</a>
      <a class="btn" href="#mi-trabajo">Conocer más ↑</a>
    </div>
  `;

  tabImage.src = d.img;
  tabImage.alt = d.alt;
  content.setAttribute("aria-labelledby", `tab-${key}`);
}

tabs.forEach((t) => {
  t.id = `tab-${t.dataset.tab}`;
  t.addEventListener("click", () => {
    tabs.forEach((x) => {
      x.classList.remove("active");
      x.setAttribute("aria-selected", "false");
    });
    t.classList.add("active");
    t.setAttribute("aria-selected", "true");
    renderTab(t.dataset.tab);
  });

  t.addEventListener("keydown", (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabList = [...tabs];
    const currentIndex = tabList.indexOf(t);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabList.length - 1
        : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabList.length) % tabList.length;
    tabList[nextIndex].focus();
    tabList[nextIndex].click();
  });
});

// Inicial
renderTab("bienestar");

// Profundidad 3D sutil en dispositivos con puntero preciso.
const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches
  && !prefersReducedMotion;

if (canTilt) {
  document.querySelectorAll(".tilt3d").forEach((element) => {
    const strength = Number(element.dataset.tilt || 5);

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - .5) * strength * 2;
      const rotateX = (.5 - y) * strength * 2;

      element.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
      element.style.setProperty("--light-x", `${(x * 100).toFixed(1)}%`);
      element.style.setProperty("--light-y", `${(y * 100).toFixed(1)}%`);
    });

    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
      element.style.setProperty("--light-x", "50%");
      element.style.setProperty("--light-y", "50%");
    });
  });
}

// En móvil, la profundidad responde al scroll en lugar de depender del cursor.
if (!canTilt && !prefersReducedMotion) {
  const mobileTiltElements = [...document.querySelectorAll(".tilt3d")];
  let tiltFrame = null;

  const updateMobileDepth = () => {
    const viewportCenter = window.innerHeight / 2;

    mobileTiltElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.max(-1, Math.min(1, (elementCenter - viewportCenter) / viewportCenter));

      element.style.setProperty("--tilt-x", `${(-distance * 7).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${(distance * 2.4).toFixed(2)}deg`);
      element.style.setProperty("--mobile-lift", `${(Math.abs(distance) * -7).toFixed(1)}px`);
      element.style.setProperty("--light-x", `${(50 + distance * 18).toFixed(1)}%`);
      element.style.setProperty("--light-y", `${(50 - distance * 22).toFixed(1)}%`);
    });

    tiltFrame = null;
  };

  const requestMobileDepth = () => {
    if (!tiltFrame) tiltFrame = requestAnimationFrame(updateMobileDepth);
  };

  window.addEventListener("scroll", requestMobileDepth, { passive: true });
  window.addEventListener("resize", requestMobileDepth);
  updateMobileDepth();
}
