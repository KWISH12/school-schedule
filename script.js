// --------- Конфиг дзвінків ---------
const schedule = [
  { lesson: 1, start: "08:00", end: "08:45" },
  { lesson: 2, start: "08:55", end: "09:40" },
  { lesson: 3, start: "09:50", end: "10:35" },
  { lesson: 4, start: "10:55", end: "11:40" },
  { lesson: 5, start: "12:00", end: "12:45" },
  { lesson: 6, start: "12:55", end: "13:40" },
  { lesson: 7, start: "13:45", end: "14:30" },
  { lesson: 8, start: "14:35", end: "15:20" }
];

function parseMinutes(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

// --------- Часы ---------
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const clock = document.getElementById("clock-time");
  if (clock) clock.textContent = `${hh}:${mm}`;
}

// --------- Статус урока ---------
function getLessonStatus() {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  let activeLesson = null;
  let nextLesson = null;

  for (let i = 0; i < schedule.length; i++) {
    const s = schedule[i];
    const start = parseMinutes(s.start);
    const end = parseMinutes(s.end);

    if (current >= start && current <= end) {
      activeLesson = s;
    } else if (current < start && !nextLesson) {
      nextLesson = s;
    }
  }

  return { activeLesson, nextLesson };
}

// --------- Обновление таблицы дзвінків ---------
function updateBellsTable() {
  const tbody = document.getElementById("lessons-body");
  if (!tbody) return;

  const rows = tbody.querySelectorAll("tr");
  rows.forEach(r => {
    r.classList.remove("active-lesson", "next-lesson");
    const statusCell = r.lastElementChild;
    if (statusCell) statusCell.textContent = "";
  });

  const { activeLesson, nextLesson } = getLessonStatus();
  const statusLabel = document.getElementById("lesson-status");
  const nextLabel = document.getElementById("next-lesson");

  if (statusLabel) statusLabel.textContent = "немає уроку";
  if (nextLabel) nextLabel.textContent = "-";

  const now = new Date();

  if (activeLesson) {
    const row = tbody.querySelector(`tr[data-lesson="${activeLesson.lesson}"]`);
    if (row) {
      row.classList.add("active-lesson");
      const statusCell = row.lastElementChild;
      const [eh, em] = activeLesson.end.split(":").map(Number);
      const end = new Date();
      end.setHours(eh, em, 0, 0);
      const diffMin = Math.max(0, Math.floor((end - now) / 60000));
      if (statusCell) {
        statusCell.textContent = `Йде урок • ще ${diffMin} хв`;
      }
      if (statusLabel) {
        statusLabel.textContent = `Урок №${activeLesson.lesson} • ще ${diffMin} хв`;
      }
    }
  }

  if (nextLesson) {
    const rowNext = tbody.querySelector(`tr[data-lesson="${nextLesson.lesson}"]`);
    if (rowNext) {
      rowNext.classList.add("next-lesson");
      const statusCell = rowNext.lastElementChild;
      if (statusCell && !statusCell.textContent) {
        statusCell.textContent = "⬅ Наступний";
      }
      if (nextLabel) {
        nextLabel.textContent = `№${nextLesson.lesson} (${nextLesson.start})`;
      }
    }
  }
}

// --------- Текущий день и уроки на сегодня ---------
function updateTodayInfo() {
  const todayText = document.getElementById("today-text");
  const tbodyMy = document.querySelector("#table-my tbody");
  const todayLessonsBody = document.getElementById("today-lessons-body");
  const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  if (todayText) {
    const now = new Date();
    const dayName = days[now.getDay()];
    todayText.textContent = `Сьогодні: ${dayName}, ${
      String(now.getDate()).padStart(2, "0")
    }.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;
  }

  if (tbodyMy && todayLessonsBody) {
    todayLessonsBody.innerHTML = "";
    const now = new Date();
    const dayIndex = now.getDay(); // 0..6

    // Пн..Пт = 1..5
    if (dayIndex >= 1 && dayIndex <= 5) {
      const colIndex = dayIndex - 1;
      const rows = tbodyMy.querySelectorAll("tr");
      rows.forEach((row, i) => {
        const cell = row.children[colIndex];
        if (cell) {
          const text = cell.textContent.trim();
          if (text && text !== "-" && text !== "–") {
            const tr = document.createElement("tr");
            const td1 = document.createElement("td");
            const td2 = document.createElement("td");
            td1.textContent = i + 1;
            td2.textContent = text;
            tr.appendChild(td1);
            tr.appendChild(td2);
            todayLessonsBody.appendChild(tr);
          }
        }
      });
    } else {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 2;
      td.textContent = "Сьогодні немає уроків (вихідний)";
      tr.appendChild(td);
      todayLessonsBody.appendChild(tr);
    }
  }
}

// --------- Навигация по секциям ---------
function setupNavigation() {
  const buttons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");
  const pageTitle = document.getElementById("page-title");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.getAttribute("data-target");
      sections.forEach(sec => {
        sec.classList.toggle("active", sec.id === target);
      });

      if (pageTitle) {
        switch (target) {
          case "dashboard":
            pageTitle.textContent = "Головна панель";
            break;
          case "bells":
            pageTitle.textContent = "Розклад дзвінків";
            break;
          case "my-schedule":
            pageTitle.textContent = "Мій розклад";
            break;
          case "class-schedule":
            pageTitle.textContent = "Розклад 9 класу";
            break;
          case "homework":
            pageTitle.textContent = "Домашні завдання";
            break;
          case "notes":
            pageTitle.textContent = "Нотатки";
            break;
          case "settings":
            pageTitle.textContent = "Налаштування";
            break;
        }
      }
    });
  });
}

// --------- LocalStorage helper ---------
function setupLocalArea(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  const saved = localStorage.getItem(key);
  if (saved !== null) el.value = saved;
  el.addEventListener("input", () => {
    localStorage.setItem(key, el.value);
  });
}

function saveEditableTable(tableId, storageKey) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows = [...table.querySelectorAll("tbody tr")];
  const data = rows.map(row => [...row.children].map(td => td.textContent));
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadEditableTable(tableId, storageKey) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    const rows = table.querySelectorAll("tbody tr");
    data.forEach((rowData, i) => {
      if (!rows[i]) return;
      const cells = rows[i].children;
      rowData.forEach((text, j) => {
        if (cells[j]) cells[j].textContent = text;
      });
    });
  } catch (e) {
    console.error("Error parse table", e);
  }
}

// --------- SETTINGS ---------
function setupSettings() {
  const themeDefault = document.getElementById("theme-default");
  const themeSoft = document.getElementById("theme-soft");
  const clearBtn = document.getElementById("clear-data");

  if (themeDefault) {
    themeDefault.addEventListener("click", () => {
      document.body.classList.remove("theme-soft");
      localStorage.setItem("theme", "default");
    });
  }
  if (themeSoft) {
    themeSoft.addEventListener("click", () => {
      document.body.classList.add("theme-soft");
      localStorage.setItem("theme", "soft");
    });
  }

  // load theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "soft") {
    document.body.classList.add("theme-soft");
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!confirm("Точно очистити ВСІ локальні дані (домашка, нотатки, таблиці)?")) return;
      localStorage.removeItem("hw-text");
      localStorage.removeItem("notes-text");
      localStorage.removeItem("table-my");
      localStorage.removeItem("table-class");
      alert("Очищено. Перезавантаж сторінку.");
    });
  }
}

// --------- INIT ---------
document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 15000);

  updateBellsTable();
  setInterval(updateBellsTable, 10000);

  updateTodayInfo();
  setInterval(updateTodayInfo, 60000);

  setupNavigation();

  // LocalStorage binding
  setupLocalArea("hw-text", "hw-text");
  setupLocalArea("notes-text", "notes-text");
  setupLocalArea("dash-hw", "dash-hw");

  // Таблицы
  loadEditableTable("table-my", "table-my");
  loadEditableTable("table-class", "table-class");

  const tableMy = document.getElementById("table-my");
  const tableClass = document.getElementById("table-class");
  if (tableMy) {
    tableMy.addEventListener("input", () => saveEditableTable("table-my", "table-my"));
  }
  if (tableClass) {
    tableClass.addEventListener("input", () => saveEditableTable("table-class", "table-class"));
  }

  setupSettings();
});
