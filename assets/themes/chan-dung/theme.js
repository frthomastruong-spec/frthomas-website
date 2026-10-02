/* Chân Dung — hiệu ứng hiện dần khi cuộn */
(function () {
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('#app .rv').forEach(function (el) { io.observe(el); });
})();
