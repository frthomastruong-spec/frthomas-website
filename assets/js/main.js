// frthomas.com — menu mobile, năm footer, và tự giải mã ảnh
// (Ảnh trên server đang lưu dạng base64-text; JS tải về rồi dựng lại thành ảnh.)
(function () {
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
})();
