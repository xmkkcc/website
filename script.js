// Mobile nav toggle + set year in footer + homepage clock
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[id^="year"]').forEach(el => el.textContent = new Date().getFullYear());

  function startClock() {
    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    if (!timeEl || !dateEl) return;

    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = `${h}:${m}:${s}`;

      const dayName = days[now.getDay()];
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      dateEl.textContent = `${dayName}, ngày ${day}/${month}/${year}`;
    };

    update();
    setInterval(update, 1000);
  }

  startClock();

  ['navToggle','navToggle2','navToggle3','navToggle4'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const nav = document.getElementById('main' + id.replace('navToggle','Nav'));
    btn.addEventListener('click', () => {
      if (nav) nav.classList.toggle('open');
    });
  });
});