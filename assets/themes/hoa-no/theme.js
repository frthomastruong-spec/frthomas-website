(function(){
/* ---- M16: cánh hoa rơi + vườn nở hoa ---- */
  var cv16 = document.getElementById('m16petals');
  if (cv16) {
    var px = cv16.getContext('2d'), petals = [], W16, H16;
    var cols = ['#f3b8c8','#f7d3dd','#e8a0b4','#fbe3ea'];
    function size16(){ var r = cv16.parentElement.getBoundingClientRect(); W16 = cv16.width = r.width; H16 = cv16.height = r.height; }
    size16(); window.addEventListener('resize', size16);
    for (var p = 0; p < 26; p++) petals.push({ x: Math.random(), y: Math.random(), s: Math.random()*7+5, vy: Math.random()*.0009+.0004, ph: Math.random()*6.28, rot: Math.random()*6.28, vr: (Math.random()-.5)*.02, c: cols[p%4] });
    (function loop16(t){
      px.clearRect(0,0,W16,H16);
      for (var k = 0; k < petals.length; k++) {
        var pt = petals[k]; pt.y += pt.vy; pt.rot += pt.vr;
        if (pt.y > 1.03) { pt.y = -0.03; pt.x = Math.random(); }
        var sx = pt.x*W16 + Math.sin(t/1400 + pt.ph)*22;
        px.save(); px.translate(sx, pt.y*H16); px.rotate(pt.rot);
        px.fillStyle = pt.c; px.globalAlpha = .85;
        px.beginPath(); px.ellipse(0, 0, pt.s, pt.s*0.62, 0, 0, 6.283); px.fill();
        px.restore();
      }
      requestAnimationFrame(loop16);
    })(0);
  }
  var garden = document.getElementById('m16garden'), gc = document.getElementById('m16count'), blooms = 0;
  var fls = ['🌸','🌼','🌷','🌺','💮','🏵️'];
  if (garden) {
    garden.addEventListener('pointerdown', function(e){
      if (e.target.closest('.m16-bloom')) return;
      var r = garden.getBoundingClientRect();
      var b = document.createElement('div');
      b.className = 'm16-bloom';
      b.style.left = (e.clientX - r.left) + 'px';
      b.style.top = (e.clientY - r.top) + 'px';
      b.innerHTML = '<span class="fl">' + fls[Math.floor(Math.random()*fls.length)] + '</span><span class="stem"></span>';
      garden.appendChild(b);
      blooms++; if (gc) gc.textContent = blooms;
      var hint = garden.querySelector('.ghint'); if (hint && blooms >= 3) hint.style.display = 'none';
    });
  }
})();
