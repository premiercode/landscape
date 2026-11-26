/* Prairie Ember Landscape Co. | Option B: Garden journal
   Progressive enhancement only: every section is readable without this file. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduceMotion = reduceMotionQuery.matches;

  /* ---------------------------------------------------------------
     Hero video: autoplay only when motion is allowed, visible toggle
     --------------------------------------------------------------- */
  var video = document.querySelector(".hero__video");
  var toggle = document.querySelector("[data-video-toggle]");
  var userPaused = reduceMotion; // reduced motion starts paused; the user can press play

  function setToggleState(paused) {
    if (!toggle) return;
    toggle.classList.toggle("is-paused", paused);
    toggle.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
  }

  function playVideo() {
    if (!video) return;
    if (video.preload === "none") video.preload = "auto";
    var p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () { setToggleState(true); });
    }
    setToggleState(false);
  }

  function pauseVideo() {
    if (!video) return;
    video.pause();
    setToggleState(true);
  }

  if (video && toggle) {
    setToggleState(true);
    if (!reduceMotion) playVideo();

    toggle.addEventListener("click", function () {
      if (video.paused) {
        userPaused = false;
        playVideo();
      } else {
        userPaused = true;
        pauseVideo();
      }
    });

    // Pause while off screen to save battery; resume only if the user had it playing.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!userPaused && video.paused) playVideo();
          } else if (!video.paused) {
            video.pause();
          }
        });
      }, { threshold: 0.15 }).observe(video);
    }

    reduceMotionQuery.addEventListener && reduceMotionQuery.addEventListener("change", function (e) {
      if (e.matches) { userPaused = true; pauseVideo(); }
    });
  }

  /* ---------------------------------------------------------------
     "Watch the full clip" dialog: video element exists only while open
     --------------------------------------------------------------- */
  var dialog = document.getElementById("clip-dialog");
  var openBtn = document.querySelector("[data-clip-open]");
  var closeBtn = document.querySelector("[data-clip-close]");
  var slot = document.querySelector("[data-clip-slot]");
  var heroWasPlaying = false;

  function openClip() {
    if (!dialog || typeof dialog.showModal !== "function") return;
    var v = document.createElement("video");
    v.controls = true;
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.poster = "../assets/video/backyard-pan-poster-1920.webp";
    v.setAttribute("aria-label", "A slow pan across a lawn and covered patio (stock footage, no sound)");
    v.width = 1280;
    v.height = 720;
    var s = document.createElement("source");
    s.src = "../assets/video/backyard-pan-1280.mp4";
    s.type = "video/mp4";
    v.appendChild(s);
    slot.appendChild(v);

    heroWasPlaying = video && !video.paused;
    if (heroWasPlaying) video.pause();

    dialog.showModal();
    if (closeBtn) closeBtn.focus();
    if (!reduceMotion) {
      var p = v.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    }
  }

  function onClipClosed() {
    var v = slot && slot.querySelector("video");
    if (v) {
      v.pause();
      v.removeAttribute("src");
      while (v.firstChild) v.removeChild(v.firstChild);
      v.load();
      v.remove();
    }
    if (heroWasPlaying && !userPaused) playVideo();
    if (openBtn) openBtn.focus();
  }

  if (dialog && openBtn) {
    openBtn.addEventListener("click", openClip);
    if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("close", onClipClosed); // fires for Esc too
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close(); // click on the backdrop
    });
  }

  /* ---------------------------------------------------------------
     Before / after slider (native range input drives a CSS variable)
     --------------------------------------------------------------- */
  document.querySelectorAll("[data-ba]").forEach(function (ba) {
    var stage = ba.querySelector(".ba__stage");
    var range = ba.querySelector("[data-ba-range]");
    if (!stage || !range) return;
    function update() {
      var v = Number(range.value);
      stage.style.setProperty("--pos", v + "%");
      range.setAttribute("aria-valuetext", v + "% before, " + (100 - v) + "% after");
    }
    range.addEventListener("input", update);
    update();
  });

  /* ---------------------------------------------------------------
     Botanical line drawing + gentle reveal on scroll
     --------------------------------------------------------------- */
  var drawTargets = document.querySelectorAll("[data-draw], .reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    drawTargets.forEach(function (el) { el.classList.add("is-drawn", "is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-drawn", "is-in");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    drawTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------
     Preview form: never sends anything
     --------------------------------------------------------------- */
  var form = document.getElementById("consult-form");
  var sendBtn = document.querySelector("[data-form-send]");
  var status = document.querySelector("[data-form-status]");

  function previewSubmit() {
    if (!form) return;
    if (!form.reportValidity()) return;
    if (status) {
      status.textContent = "";
      window.setTimeout(function () { status.textContent = "Preview only. Nothing was sent."; }, 50);
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      previewSubmit();
    });
  }
  if (sendBtn) sendBtn.addEventListener("click", previewSubmit);
})();
