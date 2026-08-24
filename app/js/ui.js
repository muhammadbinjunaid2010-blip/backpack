/* ============================================================
   BACKPACK AIR — Custom UI Notifications
   ============================================================ */
window.BAUI = (function () {
  "use strict";
  function $(id) { return document.getElementById(id); }

  /* ---- TOAST (replaces alert) ---- */
  function toast(msg, duration) {
    var el = $("ba-toast");
    var msgEl = $("ba-toast-msg");
    if (!el || !msgEl) { window.alert(msg); return; }
    msgEl.textContent = msg;
    el.classList.add("ba-toast-show");
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.classList.remove("ba-toast-show"); }, duration || 2500);
  }

  /* ---- CONFIRM ---- */
  function confirm(msg, callback) {
    var el = $("ba-confirm-modal");
    var msgEl = $("ba-confirm-msg");
    if (!el || !msgEl) { var r = window.confirm(msg); if (callback) callback(r); return; }
    msgEl.textContent = msg;
    el.classList.add("ba-modal-open");
    function close(val) { el.classList.remove("ba-modal-open"); if (callback) callback(val); }
    $("ba-confirm-yes").onclick = function () { close(true); };
    $("ba-confirm-no").onclick = function () { close(false); };
    el.onclick = function (e) { if (e.target === el) close(false); };
  }

  /* ---- PROMPT ---- */
  function prompt(msg, defaultVal, callback) {
    var el = $("ba-prompt-modal");
    var msgEl = $("ba-prompt-msg");
    var inp = $("ba-prompt-input");
    if (!el || !msgEl || !inp) { var r = window.prompt(msg, defaultVal); if (callback) callback(r); return; }
    msgEl.textContent = msg;
    inp.value = defaultVal || "";
    el.classList.add("ba-modal-open");
    setTimeout(function () { inp.focus(); inp.select(); }, 100);
    function close(val) { el.classList.remove("ba-modal-open"); if (callback) callback(val); }
    $("ba-prompt-ok").onclick = function () { close(inp.value); };
    $("ba-prompt-cancel").onclick = function () { close(null); };
    el.onclick = function (e) { if (e.target === el) close(null); };
    inp.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); close(inp.value); } };
  }

  return { toast: toast, confirm: confirm, prompt: prompt };
})();
