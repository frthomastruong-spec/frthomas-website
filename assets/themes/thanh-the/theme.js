(function(){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('on');
        io.unobserve(entry.target);
      }
    });
  },{
    threshold:.12
  });
  document
    .querySelectorAll('#app .rv')
    .forEach(function(el){
      io.observe(el);
    });
})();

// Hidden admin gesture: triple-tap the footer copyright → admin sign-in
(function(){
  var taps = 0, timer = null;
  document.addEventListener('click', function(e){
    var el = e.target && e.target.closest ? e.target.closest('.tt-footer small') : null;
    if(!el) return;
    taps++;
    clearTimeout(timer);
    if(taps >= 3){
      taps = 0;
      window.location.href = '/admin/';
      return;
    }
    timer = setTimeout(function(){ taps = 0; }, 1200);
  });
  var c = document.querySelector('.tt-footer small');
  if(c){ c.style.userSelect = 'none'; c.style.webkitUserSelect = 'none'; }
})();
