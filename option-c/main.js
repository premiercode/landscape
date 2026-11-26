/* Option C: Native Texas. Progressive enhancement only: every section works without this file. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll reveal (stamp press-in) ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      return; // no "js" hiding applied in this case, content stays visible
    }
    root.classList.add("js");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
    // Safety net: never leave content hidden.
    window.setTimeout(function () {
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) { el.classList.add("is-in"); }
      });
    }, 1200);
  }

  /* ---------- Before / after slider ---------- */
  function initSlider() {
    var frame = document.getElementById("ba-frame");
    var range = document.getElementById("ba-range");
    if (!frame || !range) { return; }
    frame.classList.add("is-live");
    range.hidden = false;
    var set = function () {
      frame.style.setProperty("--pos", range.value + "%");
      range.setAttribute("aria-valuetext", "Showing " + range.value + "% before, " + (100 - range.value) + "% after");
    };
    range.addEventListener("input", set);
    set();
  }

  /* ---------- Seasonal calendar: ARIA tabs ---------- */
  function currentSeason(date) {
    var m = date.getMonth(); // 0 = January
    if (m >= 8 && m <= 10) { return "fall"; }
    if (m === 11 || m <= 1) { return "winter"; }
    if (m >= 2 && m <= 4) { return "spring"; }
    return "summer";
  }

  function initCalendar() {
    var cal = document.querySelector("[data-cal]");
    if (!cal) { return; }
    var tablist = cal.querySelector("[role='tablist']");
    var tabs = Array.prototype.slice.call(cal.querySelectorAll("[role='tab']"));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });

    panels.forEach(function (p, i) {
      p.setAttribute("role", "tabpanel");
      p.setAttribute("aria-labelledby", tabs[i].id);
      p.setAttribute("tabindex", "0");
    });

    var months = Array.prototype.slice.call(cal.querySelectorAll(".cal-year .m"));

    function select(index, focus, animate) {
      var key = tabs[index].getAttribute("data-season");
      months.forEach(function (m) { m.classList.toggle("is-on", m.getAttribute("data-season") === key); });
      tabs.forEach(function (t, i) {
        var on = i === index;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
        panels[i].classList.remove("is-entering");
      });
      if (animate && !reduceMotion) {
        void panels[index].offsetWidth; // restart the animation
        panels[index].classList.add("is-entering");
      }
      if (focus) { tabs[index].focus(); }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i, false, true); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        switch (e.key) {
          case "ArrowRight": case "ArrowDown": next = (i + 1) % tabs.length; break;
          case "ArrowLeft": case "ArrowUp": next = (i - 1 + tabs.length) % tabs.length; break;
          case "Home": next = 0; break;
          case "End": next = tabs.length - 1; break;
        }
        if (next !== null) {
          e.preventDefault();
          select(next, true, true);
        }
      });
    });

    var today = new Date();
    var season = currentSeason(today);
    var start = 0;
    tabs.forEach(function (t, i) {
      if (t.getAttribute("data-season") === season) {
        start = i;
        var name = t.querySelector(".cal-tab-name").textContent;
        var range = t.querySelector(".cal-tab-months").textContent;
        t.setAttribute("aria-label", name + ", " + range + " (current season)");
      }
    });

    // 12-month strip (aria-hidden decoration; the ARIA tabs are the accessible control):
    // stamp "Now" on this month; on wider screens a mouse click on a month opens its season.
    var wide = window.matchMedia ? window.matchMedia("(min-width: 640px)") : { matches: true };
    months.forEach(function (m) {
      if (Number(m.getAttribute("data-month")) === today.getMonth()) {
        var stamp = document.createElement("span");
        stamp.className = "cal-now";
        stamp.textContent = "Now";
        m.appendChild(stamp);
      }
      m.addEventListener("click", function () {
        if (!wide.matches) { return; }
        var key = m.getAttribute("data-season");
        tabs.forEach(function (t, i) { if (t.getAttribute("data-season") === key) { select(i, false, true); } });
      });
    });

    tablist.hidden = false;
    cal.classList.add("is-tabs");
    select(start, false, false);
  }

  /* ---------- Preview form: never sends ---------- */
  function initForm() {
    var form = document.getElementById("consult-form");
    var btn = document.getElementById("send-btn");
    var status = document.getElementById("form-status");
    if (!form || !btn || !status) { return; }
    function handle(e) {
      if (e) { e.preventDefault(); }
      if (!form.reportValidity()) { return; }
      status.textContent = "";
      window.setTimeout(function () { status.textContent = "Preview only. Nothing was sent."; }, 50);
    }
    btn.addEventListener("click", handle);
    form.addEventListener("submit", handle);
  }

  function boot() {
    try { initSlider(); } catch (e) { /* slider falls back to two labeled images */ }
    try { initCalendar(); } catch (e) { /* calendar falls back to the four-season grid */ }
    try { initForm(); } catch (e) { /* button is type="button": nothing can send */ }
    try { initReveal(); } catch (e) { root.classList.remove("js"); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
