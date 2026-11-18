// Dibuja el sendero que une cada curso con su prerrequisito.
// Cada curso declara sus prerrequisitos en data-requires="id1 id2".
(function () {
  var NS = 'http://www.w3.org/2000/svg';

  function el(cls, d) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('class', cls);
    p.setAttribute('d', d);
    return p;
  }

  function draw(path) {
    var svg = path.querySelector('.am-links');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var box = path.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);

    var roads = [];
    path.querySelectorAll('[data-requires]').forEach(function (target) {
      var badge = target.querySelector('.am-badge').getBoundingClientRect();
      target.getAttribute('data-requires').split(/\s+/).forEach(function (id) {
        var source = document.getElementById(id);
        if (!source) return;
        var s = source.getBoundingClientRect();

        // Sale por debajo del curso previo y entra al centro de la estación siguiente
        var x1 = s.left + s.width / 2 - box.left;
        var y1 = s.bottom - box.top + 20;
        var x2 = badge.left + badge.width / 2 - box.left;
        var y2 = badge.top + badge.height / 2 - box.top;
        var dy = Math.max(20, (y2 - y1) * 0.55);

        roads.push('M' + x1 + ' ' + y1 +
          ' C' + x1 + ' ' + (y1 + dy) + ' ' + x2 + ' ' + (y2 - dy) + ' ' + x2 + ' ' + y2);
      });
    });

    // Primero todo el asfalto, después las líneas de carril encima
    // (el asfalto va en un grupo para que la transparencia no se duplique en las bifurcaciones)
    var asphalt = document.createElementNS(NS, 'g');
    asphalt.setAttribute('class', 'am-asphalt');
    roads.forEach(function (d) { asphalt.appendChild(el('am-road', d)); });
    svg.appendChild(asphalt);
    roads.forEach(function (d) { svg.appendChild(el('am-lane', d)); });
  }

  function drawAll() {
    document.querySelectorAll('.am-path').forEach(draw);
  }

  drawAll();
  window.addEventListener('load', drawAll);
  window.addEventListener('resize', drawAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawAll);
})();
