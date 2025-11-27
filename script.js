/* Часы */
function updateClock() {
  const t = new Date();
  let h = t.getHours().toString().padStart(2, '0');
  let m = t.getMinutes().toString().padStart(2, '0');
  document.getElementById("clock-time").textContent = `${h}:${m}`;
}
setInterval(updateClock, 1000);
updateClock();

/* Генерация звёзд */
const stars = document.querySelector('.stars');
for (let i = 0; i < 200; i++) {
  let s = document.createElement("span");
  s.style.top = Math.random() * 100 + "%";
  s.style.left = Math.random() * 100 + "%";
  s.style.animationDuration = (Math.random() * 2 + 1) + "s";
  stars.appendChild(s);
}
