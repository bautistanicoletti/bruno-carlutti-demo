/* Bruno Carlutti — interacciones del sitio */
(function () {
  "use strict";

  /* ---------- Medición ----------
     Envía el evento a Meta Pixel y GA4 si están cargados (ver <head>).
     Sin IDs configurados, no hace nada. */
  function track(evento, datos) {
    datos = datos || {};
    if (typeof window.fbq === "function") window.fbq("track", evento, datos);
    if (typeof window.gtag === "function") {
      var mapa = { ViewContent: "view_item", InitiateCheckout: "begin_checkout", Purchase: "purchase", Lead: "generate_lead" };
      window.gtag("event", mapa[evento] || evento, datos);
    }
  }
  window.bcTrack = track;

  var PRODUCTO = { content_name: "Guía Universitaria", value: 17000, currency: "ARS" };

  document.querySelectorAll("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () { track(el.getAttribute("data-track"), PRODUCTO); });
  });

  /* ---------- Animación de entrada ---------- */
  var reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var bloques = document.querySelectorAll(".aparece");
  if (!reducir && "IntersectionObserver" in window && bloques.length) {
    document.documentElement.classList.add("js");
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    bloques.forEach(function (b) { io.observe(b); });
    // Red de seguridad: si algo no se observó, se muestra igual.
    setTimeout(function () { bloques.forEach(function (b) { if (b.getBoundingClientRect().top < window.innerHeight) b.classList.add("visto"); }); }, 1200);
  }

  /* ---------- Barra con borde al scrollear ---------- */
  var barra = document.querySelector(".barra");
  var oferta = document.getElementById("oferta");
  var ctaFijo = document.querySelector(".cta-fijo");
  var hero = document.querySelector(".hero");
  var ofertaVisible = false;
  var vioOferta = false;

  if (oferta && "IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      ofertaVisible = e[0].isIntersecting;
      if (ofertaVisible && !vioOferta) { vioOferta = true; track("ViewContent", PRODUCTO); }
      actualizar();
    }, { threshold: 0 }).observe(oferta);
  }

  function actualizar() {
    var y = window.scrollY;
    if (barra) barra.classList.toggle("con-borde", y > 8);
    if (ctaFijo && hero) {
      var pasoHero = y > hero.offsetTop + hero.offsetHeight - 80;
      ctaFijo.classList.toggle("visible", pasoHero && !ofertaVisible);
    }
  }
  window.addEventListener("scroll", actualizar, { passive: true });
  actualizar();

  /* ---------- Cuenta regresiva de la preventa ---------- */
  var cuenta = document.querySelector("[data-cierre]");
  if (cuenta) {
    var cierre = new Date(cuenta.getAttribute("data-cierre")).getTime();
    var campos = {
      d: cuenta.querySelector("[data-d]"), h: cuenta.querySelector("[data-h]"),
      m: cuenta.querySelector("[data-m]"), s: cuenta.querySelector("[data-s]")
    };
    var dos = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () {
      var resto = Math.max(0, cierre - Date.now());
      var seg = Math.floor(resto / 1000);
      campos.d.textContent = dos(Math.floor(seg / 86400));
      campos.h.textContent = dos(Math.floor(seg % 86400 / 3600));
      campos.m.textContent = dos(Math.floor(seg % 3600 / 60));
      campos.s.textContent = dos(seg % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- FAQ: una pregunta abierta a la vez ---------- */
  var preguntas = document.querySelectorAll(".faq details");
  preguntas.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) preguntas.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Año en el footer ---------- */
  document.querySelectorAll("[data-anio]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
