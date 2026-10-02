(function(){
/* ---- M14: gợn sóng + marquee + reveal ---- */
  var hero14 = document.getElementById('m14hero');
  if (hero14) {
    hero14.addEventListener('pointerdown', function(e){
      var r = hero14.getBoundingClientRect();
      var s = document.createElement('span');
      s.className = 'm14-ripple';
      s.style.left = (e.clientX - r.left) + 'px';
      s.style.top = (e.clientY - r.top) + 'px';
      hero14.appendChild(s);
      setTimeout(function(){ s.remove(); }, 1400);
    });
  }
  var track = document.getElementById('m14track');
  if (track) {
    var items = 'Mc 16,15 &nbsp;✦&nbsp; Hãy đi loan báo Tin Mừng &nbsp;✦&nbsp; Tạ Ơn Hồng Ân Linh Mục &nbsp;✦&nbsp; Hành Hương Việt Nam 2028 &nbsp;✦&nbsp; ';
    track.innerHTML = '<span>' + items + '</span><span>' + items + '</span>';
  }
  var io14 = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('on'); io14.unobserve(e.target); } }); }, { threshold: 0.12 });
  document.querySelectorAll('.m14 .rv14').forEach(function(el){ io14.observe(el); });
})();
