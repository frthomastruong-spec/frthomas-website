/* Dem Sang — den ban goc phai, cham day cong tac de bat/tat man dem */
(function () {
  /* Dam bao trang duoc phep ve tran vung tai tho (phong khi Safari giu ban HTML cu trong cache) */
  try {
    var vm = document.querySelector('meta[name="viewport"]');
    if (vm && vm.content.indexOf('viewport-fit') === -1) vm.content += ', viewport-fit=cover';
  } catch (e) {}
  /* Hieu ung hien dan khi cuon (ke thua theme Chan Dung) */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('#app .rv').forEach(function (el) { io.observe(el); });

  /* Den ban man dem */
  var lamp = document.getElementById('nightLamp');
  var cord = document.getElementById('nightCord');
  var hint = document.getElementById('nightHint');
  /* Man dem phu kin man hinh nho viewport-fit=cover + inset:0 (khong can JS) */
  if (!lamp) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function isDay() { return document.body.classList.contains('is-day'); }
  function setDay(day) {
    document.body.classList.toggle('is-day', day);
    lamp.setAttribute('aria-label', day ? 'Cham de tat den' : 'Cham de mo den');
    if (hint) hint.style.opacity = day ? '0' : '';
  }
  function pull() {
    if (reduce) { setDay(!isDay()); return; }
    if (cord) {
      cord.classList.add('pulled');
      setTimeout(function () { cord.classList.remove('pulled'); }, 300);
    }
    setTimeout(function () { setDay(!isDay()); }, 150);
  }
  lamp.addEventListener('click', pull);
  lamp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pull(); }
  });
})();
