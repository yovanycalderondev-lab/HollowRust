// Bestiario: cada entrada usa una tira horizontal de fotogramas (img/sprites/<id>.png)
const BESTIARIO = [
  { id: "caballero", tipo: "Jugador", nombre: "Caballero de Ascuas", w: 76, h: 148, n: 10, txt: "Reanimado entre chatarra. Carga una espada dentada demasiado pesada." },
  { id: "escupidor", tipo: "Enemigo", nombre: "Escupidor", w: 198, h: 162, n: 5, txt: "Lanza proyectiles. Devuélveselos con el tajo para dañarlo." },
  { id: "rompecoraza", tipo: "Enemigo", nombre: "Rompecoraza", w: 252, h: 144, n: 6, txt: "Patrulla el suelo sin descanso." },
  { id: "guardia", tipo: "Enemigo / Jefe", nombre: "Guardia de Engranaje", w: 90, h: 124, n: 4, txt: "Con escudo. Su versión mayor es el Verdugo." },
  { id: "espectro", tipo: "Enemigo", nombre: "Espectro", w: 84, h: 141, n: 7, txt: "Aparece y desaparece entre las tumbas." },
  { id: "esqueleto", tipo: "Enemigo", nombre: "Esqueleto", w: 96, h: 135, n: 8, txt: "Se levanta del suelo cuando te acercas." },
  { id: "calavera", tipo: "Enemigo", nombre: "Calavera de fuego", w: 178, h: 198, n: 8, txt: "Vuela envuelta en llamas." },
  { id: "demonio", tipo: "Enemigo", nombre: "Demonio volador", w: 156, h: 125, n: 6, txt: "Ataca desde el aire." },
  { id: "pesadilla", tipo: "Jefe final", nombre: "La Pesadilla", w: 200, h: 178, n: 4, txt: "Entra en una segunda fase al llegar a media vida." }
];

const cont = document.getElementById("bestiary");
BESTIARIO.forEach(b => {
  const el = document.createElement("article");
  el.className = "c beast rv";
  el.innerHTML = `<div class="stage"><div class="spr"></div></div><small>${b.tipo}</small><h3>${b.nombre}</h3><p>${b.txt}</p>`;
  const s = el.querySelector(".spr");
  s.style.cssText = `--w:${b.w}px;--n:${b.n};--d:${(b.n * 0.13).toFixed(2)}s;width:${b.w}px;height:${b.h}px;background-image:url(img/sprites/${b.id}.png)`;
  s.setAttribute("role", "img");
  s.setAttribute("aria-label", b.nombre);
  cont.appendChild(el);
});

// Menú móvil
const links = document.querySelector(".links");
const burger = document.getElementById("burger");
const setMenu = on => { links.classList.toggle("on", on); burger.setAttribute("aria-expanded", on); burger.textContent = on ? "✕" : "☰"; };
burger.addEventListener("click", () => setMenu(!links.classList.contains("on")));
links.addEventListener("click", () => setMenu(false));

// Galería con visor a pantalla completa
const lb = document.getElementById("lb");
const lbImg = lb.querySelector("img");
document.querySelectorAll(".gal button").forEach(btn =>
  btn.addEventListener("click", () => {
    lbImg.src = btn.dataset.full;
    lbImg.alt = btn.querySelector("img").alt;
    lb.classList.add("on");
    document.body.style.overflow = "hidden";
  })
);
const cerrar = () => { lb.classList.remove("on"); document.body.style.overflow = ""; };
lb.addEventListener("click", cerrar);
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); });

// Aparición al hacer scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".rv, section .c, .ev, ol.ch li").forEach(el => { el.classList.add("rv"); io.observe(el); });

// Descarga: aviso en móvil, compartir enlace y barra fija
const btn = document.getElementById("dl-btn");
const esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && innerWidth < 900);
if (esMovil) { document.getElementById("dl-note").hidden = false; btn.textContent = "Descargar (solo PC)"; }
document.getElementById("dl-share").addEventListener("click", async e => {
  const url = btn.href, b = e.currentTarget;
  try {
    if (navigator.share) await navigator.share({ title: "HollowRust", text: "Descarga HollowRust para PC", url });
    else { await navigator.clipboard.writeText(url); b.textContent = "¡Enlace copiado!"; setTimeout(() => (b.textContent = "Enviarme el enlace"), 2000); }
  } catch (_) { /* el usuario canceló */ }
});
const sticky = document.getElementById("sticky");
let enHero = true, enDl = false;
const actualizar = () => sticky.classList.toggle("off", enHero || enDl);
new IntersectionObserver(es => { enHero = es[0].isIntersecting; actualizar(); }, { threshold: 0.5 }).observe(document.getElementById("top"));
new IntersectionObserver(es => { enDl = es[0].isIntersecting; actualizar(); }, { threshold: 0.2 }).observe(document.getElementById("descargar"));
