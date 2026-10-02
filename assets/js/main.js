// frthomas.com — menu mobile, năm footer
function buildFloatingMenu(base) {
  var items = [
    ['Trang chủ', base, ''],
    ['Hành hương', base + 'hanh-huong/', 'hanh-huong'],
    ['Bài giảng', base + 'bai-giang/', 'bai-giang'],
    ['Học Kinh Thánh', base + 'hoc-kinh-thanh/', 'hoc-kinh-thanh'],
    ['Sách', base + 'sach/', 'sach']
  ];
  var path = window.location.pathname.replace(/\/$/, '');
  var btn = document.createElement('button');
  btn.className = 'fm-btn';
  btn.setAttribute('aria-label', 'Mở menu');
  btn.innerHTML = '☰';
  var ov = document.createElement('div');
  ov.className = 'fm-ov';
  var links = items.map(function (it) {
    var on = (it[2] === '' && (path === '' || path === '/')) || (it[2] && path.indexOf('/' + it[2]) === 0);
    return '<a href="' + it[1] + '"' + (on ? ' class="on"' : '') + '><span>' + it[0] + '</span><span class="arr">→</span></a>';
  }).join('');
  ov.innerHTML = '<div class="fm-panel" role="dialog" aria-label="Menu điều hướng">' +
    '<button class="fm-x" aria-label="Đóng menu">×</button>' +
    '<div class="fm-brand"><div class="x">✝</div><b>Fr. Thomas</b><small>Catholic Priest</small></div>' +
    '<div class="fm-links">' + links + '</div></div>';
  document.body.appendChild(btn);
  document.body.appendChild(ov);
  function open() { ov.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { ov.classList.remove('open'); document.body.style.overflow = ''; }
  btn.addEventListener('click', open);
  ov.querySelector('.fm-x').addEventListener('click', close);
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
}

(function () {
  document.documentElement.classList.add('js');

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Nút menu nổi (floating menu) — dùng cho các trang phụ, base '../'
  buildFloatingMenu('../');

  // Hiệu ứng hiện dần khi cuộn tới (scroll reveal)
  var revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    for (var j = 0; j < revealEls.length; j++) { io.observe(revealEls[j]); }
  } else {
    for (var k = 0; k < revealEls.length; k++) { revealEls[k].classList.add('visible'); }
  }
})();
