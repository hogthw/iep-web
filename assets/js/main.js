/* IEPVN – main.js (không phụ thuộc thư viện ngoài) */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");

  /* Ảnh chưa tải về local -> tạm lấy từ site WordPress cũ (data-fallback) */
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    function useFallback() {
      if (img.dataset.fellBack) return;
      img.dataset.fellBack = "1";
      img.src = img.dataset.fallback;
    }
    img.addEventListener("error", useFallback);
    if (img.complete && img.naturalWidth === 0) useFallback();
  });

  /* Menu mobile */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
  document.querySelectorAll(".sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest(".has-sub");
      var open = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* Hero slider */
  var slides = document.querySelectorAll(".hero-slide");
  var dotsWrap = document.querySelector(".hero-dots");
  if (slides.length > 1 && dotsWrap) {
    var cur = 0, timer;
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Slide " + (i + 1));
      b.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll("button");
    function go(i) {
      slides[cur].classList.remove("active"); dots[cur].classList.remove("active");
      cur = i;
      slides[cur].classList.add("active"); dots[cur].classList.add("active");
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go((cur + 1) % slides.length); }, 6000); }
    dots[0].classList.add("active");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) restart();
  }

  /* Tabs What We Do */
  document.querySelectorAll(".tabs").forEach(function (tabs) {
    var btns = tabs.querySelectorAll('[role="tab"]');
    btns.forEach(function (btn, idx) {
      btn.addEventListener("click", function () { select(btn); });
      btn.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = btns[(idx + 1) % btns.length];
        if (e.key === "ArrowLeft") n = btns[(idx - 1 + btns.length) % btns.length];
        if (n) { n.focus(); select(n); }
      });
    });
    function select(btn) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
        document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
      });
    }
    /* mở đúng tab khi vào từ menu, ví dụ #developers */
    function fromHash() {
      var t = tabs.querySelector('[role="tab"][data-hash="' + location.hash.slice(1) + '"]');
      if (t) select(t);
    }
    window.addEventListener("hashchange", fromHash);
    fromHash();
  });

  /* Số liệu: HTML đã có số thật (không còn lỗi hiện "0"), JS chỉ thêm hiệu ứng đếm */
  var counters = document.querySelectorAll("[data-count]");
  function animate(el) {
    var target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", start = null;
    function fmt(v) { return Math.round(v).toLocaleString("en-US") + suffix; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1600, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Reveal + counters khi cuộn tới */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        if (en.target.dataset.count && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) animate(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal, [data-count]").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* Video YouTube: chỉ nạp iframe khi bấm (nhẹ trang, không lỗi giao diện) */
  document.querySelectorAll(".video-wrap button[data-yt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + btn.dataset.yt + "?autoplay=1&rel=0";
      f.title = btn.getAttribute("aria-label") || "Video";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      btn.replaceWith(f);
    });
  });

  /* Nút lên đầu trang */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function () { toTop.classList.toggle("show", window.scrollY > 600); }, { passive: true });
  }

  /* Form liên hệ -> Cloudflare Pages Function /api/contact */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var btn = form.querySelector('button[type="submit"]');
      status.className = "form-status"; status.textContent = "Sending…";
      btn.disabled = true;
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok) {
            status.className = "form-status ok";
            status.textContent = "Thank you! Your message has been sent. Our team will contact you shortly.";
            form.reset();
          } else {
            status.className = "form-status err";
            status.textContent = (res.j && res.j.error) || "Sorry, something went wrong. Please email us directly.";
          }
        })
        .catch(function () {
          status.className = "form-status err";
          status.textContent = "Network error. Please try again.";
        })
        .finally(function () {
          btn.disabled = false;
          if (window.turnstile) try { window.turnstile.reset(); } catch (_) {}
        });
    });
  }

  /* Newsletter ở footer */
  document.querySelectorAll("form[data-newsletter]").forEach(function (nl) {
    nl.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = nl.querySelector("button");
      btn.disabled = true;
      fetch(nl.action, { method: "POST", body: new FormData(nl), headers: { Accept: "application/json" } })
        .then(function (r) { btn.textContent = r.ok ? "Thanks!" : "Error"; if (r.ok) nl.reset(); })
        .catch(function () { btn.textContent = "Error"; })
        .finally(function () { setTimeout(function () { btn.disabled = false; btn.textContent = "Join"; }, 3000); });
    });
  });

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
