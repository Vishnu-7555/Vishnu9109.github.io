// ---------- Start lights intro ----------
const intro = document.getElementById("intro");
const introText = document.getElementById("introText");
const cols = document.querySelectorAll(".light-col");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function startSite() {
  intro.classList.add("hide");
  runHero();
}

if (reduce || sessionStorage.getItem("introSeen")) {
  intro.style.display = "none";
  runHero();
} else {
  cols.forEach((col, i) => setTimeout(() => col.classList.add("on"), 500 + i * 600));
  setTimeout(() => (introText.textContent = "READY..."), 3300);
  setTimeout(() => {
    cols.forEach((c) => { c.classList.remove("on"); c.classList.add("go"); });
    introText.classList.add("go");
    introText.textContent = "GREEN FLAG! AWAY WE GO";
  }, 4200);
  setTimeout(() => {
    try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
    startSite();
  }, 5600);
  // click to skip
  intro.addEventListener("click", () => {
    try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
    startSite();
  });
}

// ---------- Hero speedometer ----------
let heroStarted = false;
function runHero() {
  if (heroStarted) return;
  heroStarted = true;
  const ring = document.getElementById("heroRing");
  const num = document.getElementById("speedoNum");
  const target = 100;
  ring.style.strokeDashoffset = 528 * (1 - target / 100);
  const start = performance.now();
  const dur = 2200;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    num.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

// ---------- Scroll reveal, gauges, counters ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("show");

      if (el.classList.contains("gauge")) {
        el.querySelector(".bar i").style.width = el.dataset.val + "%";
      }
      el.querySelectorAll("[data-count]").forEach(animateCount);
      io.unobserve(el);
    });
  },
  { threshold: 0.2 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

function animateCount(el) {
  const target = +el.dataset.count;
  const dur = 1400;
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * p);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
