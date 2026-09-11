(function () {
  'use strict';

  var searchInput = document.getElementById('search');
  var areaSelect = document.getElementById('filter-area');
  var levelSelect = document.getElementById('filter-level');
  var noPrereqCheckbox = document.getElementById('filter-noprereq');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.course-card'));
  var resultCount = document.getElementById('result-count');
  var noResults = document.getElementById('no-results');
  var totalCourses = cards.length;

  function normalize(str) {
    return (str || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  function applyFilters() {
    var query = normalize(searchInput.value.trim());
    var area = areaSelect.value;
    var level = levelSelect.value;
    var onlyNoPrereq = noPrereqCheckbox.checked;
    var visibleCount = 0;

    cards.forEach(function (card) {
      var matchesQuery = !query || normalize(card.dataset.search).indexOf(query) !== -1;
      var matchesArea = !area || card.dataset.area === area;
      var matchesLevel = !level || card.dataset.level === level;
      var matchesPrereq = !onlyNoPrereq || card.dataset.prereq === 'none';
      var visible = matchesQuery && matchesArea && matchesLevel && matchesPrereq;

      card.hidden = !visible;
      if (visible) visibleCount++;
    });

    resultCount.textContent = 'Mostrando ' + visibleCount + ' de ' + totalCourses + ' cursos';
    noResults.hidden = visibleCount !== 0;
  }

  [searchInput, areaSelect, levelSelect, noPrereqCheckbox].forEach(function (el) {
    el.addEventListener('input', applyFilters);
  });

  applyFilters();
})();
