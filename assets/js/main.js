document.addEventListener("DOMContentLoaded", function () {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  var header = document.querySelector(".site-header");
  var headerHeight = header ? header.offsetHeight : 0;
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));

  function setActive(hash) {
    navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === hash); });
  }

  function scrollToHash(hash) {
    try {
      var target = document.querySelector(hash);
      if (!target) return;
      var targetTop = target.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 8);
      window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
      setActive(hash);
    } catch (e) { /* no-op */ }
  }

  // Click handlers for in-page nav
  navLinks.forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#') {
        ev.preventDefault();
        scrollToHash(href);
        history.replaceState(null, '', href);
      }
    });
  });

  // Intersection observer to highlight current section
  var sections = ['#home', '#features', '#contact']
    .map(function (id) { return document.querySelector(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive('#' + entry.target.id);
        }
      });
    }, { rootMargin: '-' + (headerHeight + 10) + 'px 0px -60% 0px', threshold: [0.3, 0.6] });

    sections.forEach(function (sec) { observer.observe(sec); });
  } else {
    // Fallback: update on scroll
    window.addEventListener('scroll', function () {
      var scrollPos = window.pageYOffset + headerHeight + 20;
      var current = sections[0] ? '#' + sections[0].id : '';
      sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollPos) current = '#' + sec.id;
      });
      setActive(current);
    });
  }

  // If page loads with a hash, align to it with offset
  if (location.hash) {
    setTimeout(function () { scrollToHash(location.hash); }, 0);
  }
});


