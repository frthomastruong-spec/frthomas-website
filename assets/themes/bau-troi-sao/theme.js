(function(){
/* ---- M15: bầu trời sao ---- */
  var cv15 = document.getElementById('m15sky');
  if (cv15) {
    var cx = cv15.getContext('2d'), stars = [], meteors = [], W15, H15;
    function size15(){ var r = cv15.parentElement.getBoundingClientRect(); W15 = cv15.width = r.width; H15 = cv15.height = r.height; }
    size15(); window.addEventListener('resize', size15);
    for (var i = 0; i < 130; i++) stars.push({ x: Math.random(), y: Math.random(), r: Math.random()*1.6+.4, tw: Math.random()*6.28, sp: Math.random()*1.5+.5 });
    function meteor(x, y){
      var a = Math.PI * (0.72 + Math.random()*0.1);
      meteors.push({ x: x, y: y, vx: Math.cos(a)*9, vy: -Math.sin(a)*9, life: 1 });
    }
    setInterval(function(){ if (document.visibilityState === 'visible') meteor(Math.random()*W15*0.7 + W15*0.3, Math.random()*H15*0.35); }, 7000);
    cv15.parentElement.addEventListener('pointerdown', function(e){
      var r = cv15.getBoundingClientRect();
      meteor(e.clientX - r.left, e.clientY - r.top);
    });
    /* parallax nhẹ */
    var inner15 = document.getElementById('m15in');
    if (window.matchMedia('(hover: hover)').matches && inner15) {
      cv15.parentElement.addEventListener('pointermove', function(e){
        var r = cv15.getBoundingClientRect();
        var x = (e.clientX - r.left)/r.width - .5, y = (e.clientY - r.top)/r.height - .5;
        inner15.style.transform = 'translate(' + (x*18).toFixed(1) + 'px,' + (y*14).toFixed(1) + 'px)';
      });
      cv15.parentElement.addEventListener('pointerleave', function(){ inner15.style.transform = ''; });
    }
    (function loop15(t){
      cx.clearRect(0,0,W15,H15);
      var g = cx.createLinearGradient(0,0,0,H15);
      g.addColorStop(0,'#05070f'); g.addColorStop(1,'#0b1230');
      cx.fillStyle = g; cx.fillRect(0,0,W15,H15);
      for (var s = 0; s < stars.length; s++) {
        var st = stars[s], a = .35 + .65*Math.abs(Math.sin(t/1000*st.sp + st.tw));
        cx.beginPath(); cx.arc(st.x*W15, st.y*H15, st.r, 0, 6.283);
        cx.fillStyle = 'rgba(220,232,255,' + a.toFixed(2) + ')'; cx.fill();
      }
      for (var m = meteors.length-1; m >= 0; m--) {
        var mt = meteors[m]; mt.x += mt.vx; mt.y += mt.vy; mt.life -= .016;
        if (mt.life <= 0 || mt.x < -80 || mt.y < -80) { meteors.splice(m,1); continue; }
        var tx = mt.x - mt.vx*9, ty = mt.y - mt.vy*9;
        var lg = cx.createLinearGradient(mt.x, mt.y, tx, ty);
        lg.addColorStop(0, 'rgba(255,255,255,' + (mt.life*.95).toFixed(2) + ')');
        lg.addColorStop(1, 'rgba(160,190,255,0)');
        cx.strokeStyle = lg; cx.lineWidth = 2.4; cx.beginPath();
        cx.moveTo(mt.x, mt.y); cx.lineTo(tx, ty); cx.stroke();
      }
      requestAnimationFrame(loop15);
    })(0);
  }
  /* đếm ngược hành hương 8/1/2028 */
  var target = new Date('2028-01-08T00:00:00').getTime();
  function tick(){
    var d = target - Date.now(); if (d < 0) d = 0;
    var days = Math.floor(d/864e5), h = Math.floor(d/36e5)%24, m = Math.floor(d/6e4)%60, s = Math.floor(d/1e3)%60;
    var set = function(id,v){ var el = document.getElementById(id); if (el) el.textContent = v; };
    set('m15d', days); set('m15h', String(h).padStart(2,'0')); set('m15m', String(m).padStart(2,'0')); set('m15s', String(s).padStart(2,'0'));
  }
  tick(); setInterval(tick, 1000);
  /* gõ chữ câu Kinh Thánh */
  var verses15 = [
    '“Anh em hãy đi khắp tứ phương thiên hạ, loan báo Tin Mừng cho mọi loài thụ tạo.” — Mc 16,15',
    '“Thầy ở cùng anh em mọi ngày cho đến tận thế.” — Mt 28,20',
    '“Bình an của Thầy, Thầy ban cho anh em.” — Ga 14,27'
  ];
  var vEl = document.getElementById('m15verse'), vi15 = 0, ci = 0;
  function type15(){
    if (!vEl) return;
    var txt = verses15[vi15];
    if (ci <= txt.length) {
      vEl.innerHTML = txt.slice(0, ci) + '<span class="cur"></span>';
      ci++; setTimeout(type15, 42);
    } else {
      setTimeout(function(){ ci = 0; vi15 = (vi15+1)%verses15.length; type15(); }, 4200);
    }
  }
  type15();
})();
