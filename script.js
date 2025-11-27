// === MAIN SITE JAVASCRIPT ===

// Конфиг уроков
const lessonsConfig = [
  { num: 1, start: "08:00", end: "08:45" },
  { num: 2, start: "08:55", end: "09:40" },
  { num: 3, start: "09:50", end: "10:35" },
  { num: 4, start: "10:55", end: "11:40" },
  { num: 5, start: "12:00", end: "12:45" },
  { num: 6, start: "12:55", end: "13:40" },
  { num: 7, start: "13:45", end: "14:30" },
  { num: 8, start: "14:35", end: "15:20" }
];

// "08:00" → в минуты
function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// Часы + подсветка текущего урока
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  const clockTime = document.getElementById("clock-time");
  if (clockTime) {
    clockTime.textContent = `${hours}:${mins}`;
  }
  highlightCurrentLesson(now);
}

// Подсвечиваем текущий урок в таблице
function highlightCurrentLesson(now = new Date()) {
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const rows = document.querySelectorAll("#lessons-body tr");

  rows.forEach((row) => {
    row.classList.remove("current-lesson");
    const statusCell = row.querySelector("td:last-child");
    if (statusCell) statusCell.textContent = "";
  });

  let active = null;

  for (const lesson of lessonsConfig) {
    const start = parseTimeToMinutes(lesson.start);
    const end = parseTimeToMinutes(lesson.end);
    if (totalMinutes >= start && totalMinutes <= end) {
      active = lesson.num;
    }
  }

  if (active !== null) {
    const row = document.querySelector(
      `#lessons-body tr[data-lesson="${active}"]`
    );
    if (row) {
      row.classList.add("current-lesson");
      const statusCell = row.querySelector("td:last-child");
      if (statusCell) statusCell.textContent = "Зараз цей урок";
    }
  }
}

// Подсветка текущего дня недели в двух таблицах
function highlightCurrentDay() {
  const today = new Date();
  let day = today.getDay(); // 1..5 (пон–пт)
  if (day === 0 || day === 6) return; // вс / сб ничего не подсвечиваем

  const index = day; // понедельник = 1 → столбец 0

  document.querySelectorAll(".day-table").forEach((table) => {
    const rows = table.querySelectorAll("tr");
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("th, td");
      cells.forEach((cell, cellIndex) => {
        cell.classList.remove("current-day");
        if (cellIndex === index - 1 && rowIndex > 0) {
          cell.classList.add("current-day");
        }
      });
    });
  });
}

// Анимация появления карточек при скролле
function setupScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 15000);
  highlightCurrentDay();
  setupScrollAnimations();
});
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `rotateX(${-y / 20}deg) rotateY(${x / 20}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
});


