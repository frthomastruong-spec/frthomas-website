// Menu mobile + đếm ngược ngày khởi hành hành hương
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  var cd = document.getElementById('countdown-days');
  if (cd) {
    var target = new Date('2028-01-08T00:00:00');
    var now = new Date();
    var diff = Math.ceil((target - now) / 86400000);
    cd.textContent = diff > 0 ? diff : 0;
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
