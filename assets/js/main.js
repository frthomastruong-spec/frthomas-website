// frthomas.com — menu mobile, năm footer, và tự giải mã ảnh
// (Ảnh trên server đang lưu dạng base64-text; JS tải về rồi dựng lại thành ảnh.)
(function () {
  document.documentElement.classList.add('js');

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Bóng đổ cho nav khi cuộn xuống
  var nav = document.querySelector('.site-nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function load(img) {
    var url = img.getAttribute('data-b64src');
    if (!url) return;
    fetch(url).then(function (r) { return r.text(); }).then(function (t) {
      img.src = 'data:image/jpeg;base64,' + t.trim();
      img.removeAttribute('data-b64src');
    }).catch(function () { /* giữ ảnh chờ */ });
  }
  var imgs = document.querySelectorAll('img[data-b64src]');
  for (var i = 0; i < imgs.length; i++) { load(imgs[i]); }

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
