/* Daily Spark – theme toggle and placeholder form handling (Milestone 1).
   Loaded in <head> so the saved theme is applied before the page paints. */
(function () {
  var KEY = 'ds-theme';
  var root = document.documentElement;

  function readSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* storage unavailable: ignore */ }
  }

  // Light is the default; only switch to dark if the visitor chose it before.
  root.setAttribute('data-theme', readSaved() === 'dark' ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');

    function syncButton() {
      var dark = root.getAttribute('data-theme') === 'dark';
      if (btn) {
        btn.textContent = dark ? 'Light mode' : 'Dark mode';
        btn.setAttribute('aria-pressed', String(dark));
      }
    }

    if (btn) {
      btn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        save(next);
        syncButton();
      });
    }
    syncButton();

    // Milestone 1: forms are visual only. Block the real submit and show a note instead.
    var forms = document.querySelectorAll('form[data-placeholder]');
    Array.prototype.forEach.call(forms, function (form) {
      var pw = form.querySelector('[name="password"]');
      var confirm = form.querySelector('[name="confirm"]');
      if (pw && confirm) {
        var check = function () {
          confirm.setCustomValidity(pw.value !== confirm.value ? 'Passwords do not match.' : '');
        };
        pw.addEventListener('input', check);
        confirm.addEventListener('input', check);
      }
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var note = form.querySelector('.form-note');
        if (note) { note.hidden = false; }
      });
    });
  });
})();
