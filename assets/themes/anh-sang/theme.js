(function(){
  /* Hạt sáng bay */
  var cv = document.getElementById('m13stars');
  if (cv) {
    var ctx = cv.getContext('2d'), ps = [], W, H;
    function size(){ var r = cv.parentElement.getBoundingClientRect(); W = cv.width = r.width; H = cv.height = r.height; }
    size(); window.addEventListener('resize', size);
    for (var i = 0; i < 70; i++) ps.push({ x: Math.random(), y: Math.random(), r: Math.random()*2.2+.6, s: Math.random()*.0009+.0003, o: Math.random()*.7+.15, tw: Math.random()*6.28 });
    (function loop(t){
      ctx.clearRect(0,0,W,H);
      for (var j = 0; j < ps.length; j++) {
        var p = ps[j]; p.y -= p.s; if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        var a = p.o * (0.6 + 0.4 * Math.sin(t/900 + p.tw));
        ctx.beginPath(); ctx.arc(p.x*W, p.y*H, p.r, 0, 6.283);
        ctx.fillStyle = 'rgba(232,200,119,' + a.toFixed(2) + ')'; ctx.fill();
      }
      requestAnimationFrame(loop);
    })(0);
  }
  /* Chữ hero hiện từng chữ */
  var t = document.getElementById('m13title');
  if (t) {
    var txt = t.textContent; t.textContent = '';
    for (var k = 0; k < txt.length; k++) {
      var s = document.createElement('span'); s.textContent = txt[k] === ' ' ? '\u00a0' : txt[k];
      s.style.animationDelay = (k * 0.06) + 's'; t.appendChild(s);
    }
  }
  /* Nến */
  var row = document.getElementById('m13candles'), count = document.getElementById('m13count'), lit = 0;
  if (row) {
    for (var c = 0; c < 5; c++) {
      var b = document.createElement('button');
      b.className = 'm13-candle'; b.setAttribute('aria-label', 'Thắp nến');
      b.innerHTML = '<span class="glow"></span><span class="flame"></span><span class="wick"></span><span class="wax"></span>';
      b.addEventListener('click', function(){
        this.classList.toggle('lit');
        lit = row.querySelectorAll('.lit').length;
        count.textContent = lit;
      });
      row.appendChild(b);
    }
  }
  /* Hiện dần khi cuộn */
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }); }, { threshold: 0.15 });
  document.querySelectorAll('.m13 .rv').forEach(function(el){ io.observe(el); });
  /* Câu Kinh Thánh tự đổi */
  var verses = [
    ['“Anh em hãy đi khắp tứ phương thiên hạ, loan báo Tin Mừng cho mọi loài thụ tạo.”', 'Mc 16,15'],
    ['“Thầy ở cùng anh em mọi ngày cho đến tận thế.”', 'Mt 28,20'],
    ['“Bình an của Thầy, Thầy ban cho anh em.”', 'Ga 14,27']
  ];
  var vi = 0, vel = document.getElementById('m13verse'), dots = document.getElementById('m13dots');
  function showV(n){
    vi = n;
    vel.classList.add('fade');
    setTimeout(function(){
      vel.innerHTML = verses[vi][0] + '<small>— ' + verses[vi][1] + '</small>';
      vel.classList.remove('fade');
      var ds = dots.children;
      for (var d = 0; d < ds.length; d++) ds[d].className = d === vi ? 'on' : '';
    }, 350);
  }
  if (vel && dots) {
    for (var v = 0; v < verses.length; v++) { var i = document.createElement('i'); dots.appendChild(i); }
    vel.innerHTML = verses[0][0] + '<small>— ' + verses[0][1] + '</small>'; dots.children[0].className = 'on';
    setInterval(function(){ showV((vi + 1) % verses.length); }, 5000);
  }
  /* Thẻ nghiêng 3D */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.m13-card').forEach(function(card){
      card.addEventListener('pointermove', function(e){
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateY(' + (x*10).toFixed(1) + 'deg) rotateX(' + (-y*10).toFixed(1) + 'deg) translateZ(6px)';
        card.style.boxShadow = '0 18px 44px rgba(232,200,119,.18)';
      });
      card.addEventListener('pointerleave', function(){ card.style.transform = ''; card.style.boxShadow = ''; });
    });
  }
})();
