/* =========  НАСТРОЙКА РАСПИСАНИЯ УРОКОВ  ========= */

const schedule = [
    { lesson: 1, start: "08:00", end: "08:45" },
    { lesson: 2, start: "08:55", end: "09:40" },
    { lesson: 3, start: "09:50", end: "10:35" },
    { lesson: 4, start: "10:55", end: "11:40" },
    { lesson: 5, start: "12:00", end: "12:45" },
    { lesson: 6, start: "12:55", end: "13:40" },
    { lesson: 7, start: "13:45", end: "14:30" },
    { lesson: 8, start: "14:35", end: "15:20" },
];

/* =========  ПОКАЗ ВРЕМЕНИ  ========= */

function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    document.getElementById("clock-time").textContent = `${hh}:${mm}`;
}
setInterval(updateClock, 1000);
updateClock();

/* =========  ОПРЕДЕЛЕНИЕ ТЕКУЩЕГО УРОКА  ========= */

function getLessonStatus() {
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();

    let activeLesson = null;
    let nextLesson = null;

    for (let i = 0; i < schedule.length; i++) {
        const s = schedule[i];
        const [sh, sm] = s.start.split(":").map(Number);
        const [eh, em] = s.end.split(":").map(Number);

        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;

        if (current >= startMin && current <= endMin) {
            activeLesson = s;
        } else if (current < startMin && nextLesson === null) {
            nextLesson = s;
        }
    }

    return { activeLesson, nextLesson };
}

/* =========  АВТО-ПОДСВЕТКА СТРОКИ В ТАБЛИЦЕ  ========= */

function updateTable() {
    const rows = document.querySelectorAll("#lessons-body tr");

    rows.forEach(row => {
        row.classList.remove("active-lesson");
        row.classList.remove("next-lesson");
        row.lastElementChild.textContent = "";
    });

    const { activeLesson, nextLesson } = getLessonStatus();

    if (activeLesson) {
        const row = document.querySelector(`tr[data-lesson="${activeLesson.lesson}"]`);
        if (row) {
            row.classList.add("active-lesson");

            const endTime = activeLesson.end.split(":");
            const now = new Date();
            const end = new Date();
            end.setHours(endTime[0], endTime[1], 0);

            const diff = Math.floor((end - now) / 60000);
            row.lastElementChild.textContent = `Йде урок • ще ${diff} хв`;
        }
    }

    if (nextLesson) {
        const row = document.querySelector(`tr[data-lesson="${nextLesson.lesson}"]`);
        if (row) {
            row.classList.add("next-lesson");
            row.lastElementChild.textContent = "⬅ Наступний";
        }
    }
}

setInterval(updateTable, 5000);
updateTable();
