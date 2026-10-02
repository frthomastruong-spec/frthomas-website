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
