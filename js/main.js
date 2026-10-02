// Madhayam Samajik Sanstha: shared site script (2026 rebuild)
// The mobile drawer below fades in and out (the animation itself lives in
// the stylesheet). Everything else is a lighter, site-owned version of the
// corvance-it motion family: a cursor glow, magnetic buttons, drifting
// background shapes, scroll reveal, a progress bar, number counters, and a
// back-to-top button.

document.addEventListener("DOMContentLoaded", function () {
  var body = document.body;

  // ---------- Mobile drawer ----------
  var menuToggle = document.getElementById("menu-toggle");
  var sideNav = document.getElementById("side-nav");
  var sideClose = document.getElementById("side-close");
  var navOverlay = document.getElementById("nav-overlay");

  function openDrawer() {
    body.classList.add("nav-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
    if (sideNav) sideNav.setAttribute("aria-hidden", "false");
    if (sideClose) sideClose.focus();
  }

  function closeDrawer() {
    body.classList.remove("nav-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    if (sideNav) sideNav.setAttribute("aria-hidden", "true");
    if (menuToggle) menuToggle.focus();
  }

  if (menuToggle) menuToggle.addEventListener("click", openDrawer);
  if (sideClose) sideClose.addEventListener("click", closeDrawer);
  if (navOverlay) navOverlay.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.classList.contains("nav-open")) closeDrawer();
  });

  // ---------- Online donations (Razorpay Standard Checkout) ----------
  // To switch online payments on, paste your Razorpay Key ID between the
  // quotes below. It starts with "rzp_test_" while you are testing and
  // "rzp_live_" once your account is live. Only the Key ID belongs here:
  // the Key Secret must never appear anywhere on the website.
  // Until a Key ID is added, the donate button shows a friendly message
  // pointing visitors to the bank transfer details instead.
  var RAZORPAY_KEY_ID = "";

  var payForm = document.getElementById("pay-form");
  if (payForm) {
    var payStatus = document.getElementById("pay-status");
    var payAmount = document.getElementById("pay-amount");
    var payPurpose = document.getElementById("pay-purpose");
    var payField = payAmount.closest(".form-field");
    var payErr = payField.querySelector(".field-err");

    var setPayStatus = function (msg, kind) {
      payStatus.textContent = msg;
      payStatus.className = "pay-status" + (kind ? " is-" + kind : "");
    };

    var setAmountError = function (msg) {
      payField.classList.remove("is-invalid");
      if (msg) {
        void payField.offsetWidth;
        payField.classList.add("is-invalid");
      }
      payErr.textContent = msg || "";
    };

    payAmount.addEventListener("input", function () {
      setAmountError("");
    });

    payForm.addEventListener("submit", function (e) {
      e.preventDefault();
      setPayStatus("");

      // Razorpay works in paise (1 rupee = 100 paise)
      var paise = Math.round(Number(payAmount.value) * 100);
      if (!paise || paise < 100) {
        setAmountError("Please enter an amount of at least 1 rupee.");
        return;
      }
      setAmountError("");

      if (!RAZORPAY_KEY_ID) {
        setPayStatus(
          "Online payment is being set up. Please use the bank transfer details below for now.",
          "error"
        );
        return;
      }

      if (typeof Razorpay === "undefined") {
        setPayStatus(
          "The payment window could not load. Please check your connection and try again, or use the bank transfer details below.",
          "error"
        );
        return;
      }

      var purpose = payPurpose.value;
      var options = {
        key: RAZORPAY_KEY_ID,
        amount: paise,
        currency: "INR",
        name: "Madhayam Samajik Sanstha",
        description: "Donation: " + purpose,
        image: new URL("assets/logo-mark.jpg", window.location.href).href,
        notes: { purpose: purpose },
        theme: { color: "#6b1f28" },
        handler: function (response) {
          setPayStatus(
            "Thank you for your generous gift. Your payment ID is " +
              response.razorpay_payment_id +
              ". Please keep it for your records.",
            "success"
          );
          payForm.reset();
        },
        modal: {
          ondismiss: function () {
            if (!payStatus.classList.contains("is-success")) {
              setPayStatus("The payment window was closed. You can try again whenever you are ready.");
            }
          },
        },
      };

      try {
        var rzp = new Razorpay(options);
        rzp.on("payment.failed", function () {
          setPayStatus(
            "The payment could not be completed. Please try again, or use the bank transfer details below.",
            "error"
          );
        });
        rzp.open();
      } catch (err) {
        setPayStatus(
          "Something went wrong opening the payment window. Please try again, or use the bank transfer details below.",
          "error"
        );
      }
    });
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Typed line (hero) ----------
  var reduceMotionEarly =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var typedEl = document.getElementById("typed");
  if (typedEl) {
    var words = [
      "women's empowerment.",
      "education and literacy.",
      "vocational training.",
      "health and nutrition.",
      "micro-finance and self-help groups.",
      "agriculture and rural development.",
      "advocacy and human rights.",
      "environment and sanitation.",
    ];
    if (reduceMotionEarly) {
      typedEl.textContent = words[0];
    } else {
      (function () {
        var w = 0, c = 0, deleting = false;
        function tick() {
          var word = words[w];
          c += deleting ? -1 : 1;
          typedEl.textContent = word.slice(0, c);
          var delay = deleting ? 30 : 62;
          if (!deleting && c === word.length) {
            deleting = true;
            delay = 1600;
          } else if (deleting && c === 0) {
            deleting = false;
            w = (w + 1) % words.length;
            delay = 350;
          }
          setTimeout(tick, delay);
        }
        tick();
      })();
    }
  }

  // ---------- Copy to clipboard (phone and email in contact cards) ----------
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-copy]") : null;
    if (!btn) return;
    var text = btn.getAttribute("data-copy");
    if (!navigator.clipboard) return;
    navigator.clipboard
      .writeText(text)
      .then(function () {
        var hint = btn.querySelector(".copy-hint");
        if (!hint) return;
        var prev = hint.textContent;
        hint.textContent = "Copied!";
        setTimeout(function () {
          hint.textContent = prev;
        }, 1600);
      })
      .catch(function () {});
  });

  // ---------- Contact-style forms: validation, then a mailto fallback ----------
  // No backend is connected yet for either form on this site. Until one is,
  // a valid submission opens the visitor's email app with the message
  // pre-filled, addressed to the organisation's email above.
  function wireForm(formId, recipient, fieldMap, subjectFn) {
    var form = document.getElementById(formId);
    if (!form) return;

    function fieldWrap(id) {
      var el = document.getElementById(id);
      return el ? el.closest(".form-field") : null;
    }

    function markBad(id, msg) {
      var wrap = fieldWrap(id);
      if (!wrap) return;
      wrap.classList.remove("is-invalid");
      void wrap.offsetWidth;
      wrap.classList.add("is-invalid");
      var err = wrap.querySelector(".field-err");
      if (err) err.textContent = msg;
    }

    function markOk(id) {
      var wrap = fieldWrap(id);
      if (!wrap) return;
      wrap.classList.remove("is-invalid");
      var err = wrap.querySelector(".field-err");
      if (err) err.textContent = "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var values = {};
      var good = true;

      fieldMap.required.forEach(function (id) {
        var el = document.getElementById(id);
        var val = el ? el.value.trim() : "";
        values[id] = val;
        if (!val) {
          markBad(id, "This field is required.");
          good = false;
        } else if (id === fieldMap.email && !/^\S+@\S+\.\S+$/.test(val)) {
          markBad(id, "Please enter a valid email address.");
          good = false;
        } else {
          markOk(id);
        }
      });

      (fieldMap.optional || []).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) values[id] = el.value.trim();
      });

      if (!good) return;

      var subject = encodeURIComponent(subjectFn(values));
      var bodyLines = fieldMap.bodyOrder
        .map(function (id) {
          return fieldMap.labels[id] + ": " + (values[id] || "");
        })
        .filter(Boolean);
      var body = encodeURIComponent(bodyLines.join("\n"));

      window.location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;

      var card = form.closest(".contact-form") || form.parentElement;
      var firstName = (values[fieldMap.name] || "").split(" ")[0] || "there";
      card.innerHTML =
        '<div class="form-done"><svg viewBox="0 0 100 100" aria-hidden="true">' +
        '<circle cx="50" cy="50" r="30"/><path d="M38 51l9 9 17-19"/></svg>' +
        "<h3>Thank you, " + firstName + ".</h3>" +
        "<p>Your email app should now open with this message ready to send. " +
        "If it does not open automatically, please email us directly at " +
        recipient + ".</p></div>";
    });
  }

  wireForm(
    "contact-form",
    "hemamadhyam@gmail.com",
    {
      required: ["cf-name", "cf-email", "cf-message"],
      optional: ["cf-phone", "cf-reason"],
      email: "cf-email",
      name: "cf-name",
      bodyOrder: ["cf-name", "cf-email", "cf-phone", "cf-reason", "cf-message"],
      labels: {
        "cf-name": "Name",
        "cf-email": "Email",
        "cf-phone": "Phone",
        "cf-reason": "This message is about",
        "cf-message": "Message",
      },
    },
    function (v) {
      return "Website enquiry from " + v["cf-name"];
    }
  );

  wireForm(
    "csr-form",
    "hemamadhyam@gmail.com",
    {
      required: ["csr-company", "csr-contact", "csr-message"],
      optional: ["csr-focus"],
      email: null,
      name: "csr-contact",
      bodyOrder: ["csr-company", "csr-contact", "csr-focus", "csr-message"],
      labels: {
        "csr-company": "Company name",
        "csr-contact": "Contact person",
        "csr-focus": "Proposed focus area",
        "csr-message": "Message",
      },
    },
    function (v) {
      return "CSR proposal request from " + v["csr-company"];
    }
  );

  // ==========================================================================
  // Motion layer
  // ==========================================================================

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer =
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---------- Scroll progress bar ----------
  var progress = document.createElement("div");
  progress.className = "progress-bar";
  progress.setAttribute("aria-hidden", "true");
  body.prepend(progress);

  // ---------- Cursor glow ----------
  var cursorGlow = null;
  if (!reduceMotion && finePointer) {
    cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    cursorGlow.setAttribute("aria-hidden", "true");
    body.appendChild(cursorGlow);
  }

  // ---------- Drifting background shapes ----------
  // Two soft leaf-like blobs (the site's own shape, not a copy of a plain
  // circle) placed in the hero or page-head banner.
  // The homepage hero uses a local, CSS-only animated background, so the decorative
  // drift shapes remain limited to page-head bands on interior pages.
  var driftHost = document.querySelector(".page-head");
  if (driftHost && !reduceMotion) {
    var shapeSvg =
      '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M100 20c44 0 80 36 80 80s-36 80-80 80-80-36-80-80 20-100 80-80z" fill="#fff"/>' +
      "</svg>";

    var shapeA = document.createElement("div");
    shapeA.className = "drift-shape";
    shapeA.style.cssText = "width:260px;height:260px;right:-70px;top:-60px;";
    shapeA.setAttribute("data-speed", "0.08");
    shapeA.setAttribute("aria-hidden", "true");
    shapeA.innerHTML = shapeSvg;

    var shapeB = document.createElement("div");
    shapeB.className = "drift-shape";
    shapeB.style.cssText = "width:180px;height:180px;left:-40px;bottom:-50px;opacity:0.35;";
    shapeB.setAttribute("data-speed", "0.14");
    shapeB.setAttribute("aria-hidden", "true");
    shapeB.innerHTML = shapeSvg;

    driftHost.prepend(shapeB);
    driftHost.prepend(shapeA);
  }

  // ---------- Back to top ----------
  var topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "top-btn";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  body.appendChild(topBtn);
  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // ---------- Magnetic buttons ----------
  document.querySelectorAll(".btn-donate, .btn-primary, .cta-band .btn").forEach(function (el) {
    el.classList.add("mag");
  });

  if (!reduceMotion && finePointer) {
    document.addEventListener("pointermove", function (e) {
      if (cursorGlow) {
        cursorGlow.style.opacity = "1";
        cursorGlow.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
      }
      var mag = e.target.closest ? e.target.closest(".mag") : null;
      if (mag) {
        var r = mag.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) * 0.2;
        var my = (e.clientY - r.top - r.height / 2) * 0.3;
        mag.style.transform = "translate(" + mx.toFixed(1) + "px," + my.toFixed(1) + "px)";
      }
    });

    document.addEventListener("pointerout", function (e) {
      var mag = e.target.closest ? e.target.closest(".mag") : null;
      if (mag && (!e.relatedTarget || !mag.contains(e.relatedTarget))) mag.style.transform = "";
    });

    document.documentElement.addEventListener("mouseleave", function () {
      if (cursorGlow) cursorGlow.style.opacity = "0";
    });
  }

  // ---------- Number counters ----------
  // Any .stat-value or .stat-num whose text is a plain integer (optionally
  // followed by a "+") counts up from zero the first time it is revealed.
  function countUp(root) {
    if (!root || !root.querySelectorAll) return;
    var candidates = [];
    if (root.classList && (root.classList.contains("stat-value") || root.classList.contains("stat-num"))) {
      candidates.push(root);
    }
    candidates = candidates.concat(
      Array.prototype.slice.call(root.querySelectorAll(".stat-value, .stat-num"))
    );

    candidates.forEach(function (el) {
      if (el.dataset.counted === "true") return;
      var raw = (el.textContent || "").trim();
      var m = raw.match(/^([\d,]+)(\+?)$/);
      if (!m) return;
      var target = parseInt(m[1].replace(/,/g, ""), 10);
      var suffix = m[2] || "";
      el.dataset.counted = "true";

      // Reduced-motion users still get the real final value immediately.
      if (reduceMotion) {
        el.textContent = target.toLocaleString("en-IN") + suffix;
        return;
      }

      var start = performance.now();
      var duration = 900;
      (function step(now) {
        var p = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString("en-IN") + suffix;
        }
      })(start);
    });
  }

  // ---------- Scroll reveal ----------
  var animSelector = [
    ".hero-eyebrow", ".hero-title", ".hero-sub", ".hero-actions", ".hero-stat-card",
    ".hero-figure",
    ".intro-block > *",
    ".timeline-item",
    ".vm-panel",
    ".focus-item",
    ".stat-hero", ".impact-cell", ".quote-panel",
    ".way-card", ".tier-card",
    ".process-step", ".reason-list li",
    ".contact-info-list li", ".contact-form",
    ".cta-band h2", ".cta-band p", ".cta-actions",
    ".page-head .wrap > *"
  ].join(", ");

  var animItems = Array.prototype.slice.call(document.querySelectorAll(animSelector));

  animItems.forEach(function (el) {
    if (el.hasAttribute("data-anim")) return;
    el.setAttribute("data-anim", "rise");
    var parent = el.parentElement;
    var siblingIndex = 0;
    if (parent) {
      siblingIndex = Array.prototype.filter
        .call(parent.children, function (c) { return c.hasAttribute && c.hasAttribute("data-anim"); })
        .indexOf(el);
    }
    el.style.setProperty("--i", Math.min(Math.max(siblingIndex, 0), 6));
  });

  if ("IntersectionObserver" in window && animItems.length) {
    var animObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            countUp(entry.target);
            animObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    animItems.forEach(function (el) { animObserver.observe(el); });
  } else {
    animItems.forEach(function (el) {
      el.classList.add("in");
      countUp(el);
    });
  }

  // ---------- Header state, progress, drift parallax, back-to-top ----------
  var header = document.querySelector(".site-header");
  var scheduled = false;

  function onScroll() {
    scheduled = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("is-scrolled", y > 12);
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    topBtn.classList.toggle("show", y > 600);

    if (!reduceMotion) {
      document.querySelectorAll(".drift-shape").forEach(function (o) {
        var speed = parseFloat(o.getAttribute("data-speed")) || 0.1;
        o.style.setProperty("--py", (y * speed).toFixed(1) + "px");
      });
    }
  }

  onScroll();
  window.addEventListener(
    "scroll",
    function () {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", onScroll);
});

/* Connected image placeholders
   Every editable image slot uses the same reliable load state. This handles
   cached images as well as images that finish loading after the page renders. */
(function initConnectedImages() {
  const selectors = '.img-ph img, .gallery-photo img, .gallery-inline-image img';
  const images = document.querySelectorAll(selectors);

  images.forEach((img) => {
    const markLoaded = () => {
      if (img.naturalWidth > 0) {
        img.classList.add('is-loaded');
        const slot = img.closest('.img-ph, .gallery-photo, .gallery-inline-image');
        if (slot) slot.classList.add('has-loaded-image');
      }
    };

    img.addEventListener('load', markLoaded, { once: true });
    if (img.complete) markLoaded();
  });
})();
