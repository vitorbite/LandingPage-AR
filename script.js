function Home() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
function Scroll(area) {
  const myElement = document.getElementById(area);
  myElement.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

const icone = document.getElementById("icone");
const menu = document.getElementById("menu2");

let op = false;
document.addEventListener("click", (e) => {
  let el = e.target;
  if (el.className != "menu2" || el.tagName == "LI") {
    menu.style.display = "none";
  }
  if (el.id == "icone") {
    mudaMenu(!op);
  }
});
function mudaMenu(x) {
  op = x;
  x ? (menu.style.display = "block") : (menu.style.display = "none");
}

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carrossel-slide");
  const inner = document.createElement("div");
  inner.className = "carrossel-inner";
  slides.forEach((slide) => inner.appendChild(slide));
  const container = document.querySelector(".carrossel-container");
  container.insertBefore(inner, container.querySelector(".carrossel-prev"));

  const n = slides.length;
  const angle = 360 / n;
  let current = 0;
  let totalRot = 0; // Acumula a rotação total

  // Posiciona os slides em círculo
  slides.forEach((slide, i) => {
    slide.style.transform = `rotateY(${i * angle}deg) translateZ(400px)`;
  });

  function updateActive() {
    slides.forEach((slide, i) => {
      slide.classList.toggle("ativo", i === ((current % n) + n) % n);
    });
  }

  function rotateCarousel() {
    inner.style.transition = "transform 0.8s";
    inner.style.transform = `rotateY(${-totalRot}deg)`;
    updateActive();
  }

  function goToNext() {
    current++;
    totalRot += angle;
    rotateCarousel();
  }

  function goToPrev() {
    current--;
    totalRot -= angle;
    rotateCarousel();
  }

  document.querySelector(".carrossel-prev").onclick = goToPrev;
  document.querySelector(".carrossel-next").onclick = goToNext;

  // Auto slide (opcional)
  let timer = setInterval(goToNext, 15000);

  // Reinicia o timer ao interagir
  document.querySelector(".carrossel-prev").addEventListener("click", () => {
    clearInterval(timer);
    timer = setInterval(goToNext, 15000);
  });
  document.querySelector(".carrossel-next").addEventListener("click", () => {
    clearInterval(timer);
    timer = setInterval(goToNext, 15000);
  });

  rotateCarousel();
});
