/* ============================================================
   GameVerse — main.js
   Vanilla JavaScript only (no frameworks)
   Features: navbar, smooth scroll, reveal, filters,
   stars, counters, forms, modal, back-to-top
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Navbar background on scroll ---------- */
  const nav = document.getElementById("mainNav");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Auto-close mobile navbar after click ---------- */
  const navLinks = document.querySelectorAll("#navMenu .nav-link, #navMenu .btn");
  const navMenu = document.getElementById("navMenu");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu && navMenu.classList.contains("show")) {
        // Use Bootstrap Collapse API if available
        if (window.bootstrap) {
          bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
        } else {
          navMenu.classList.remove("show");
        }
      }
    });
  });

  /* ---------- 3. Smooth scrolling with fixed-header offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    });
  });

  /* ---------- 4. Back to top ---------- */
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 5. Scroll reveal animations (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- 6. Render rating stars (data-rating="1..5") ---------- */
  document.querySelectorAll(".stars").forEach((el) => {
    const rating = parseInt(el.dataset.rating || "5", 10);
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += i <= rating
        ? '<i class="bi bi-star-fill"></i>'
        : '<i class="bi bi-star"></i>';
    }
    el.innerHTML = html;
    el.setAttribute("aria-label", rating + " out of 5 stars");
  });

  /* ---------- 7. Popular games filter ---------- */
  const filterBtns = document.querySelectorAll(".btn-filter");
  const gameItems = document.querySelectorAll(".game-item");
  const noResults = document.getElementById("noResults");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      let visible = 0;

      gameItems.forEach((item) => {
        const cats = (item.dataset.category || "").split(" ");
        const show = filter === "all" || cats.includes(filter);
        item.classList.toggle("hide", !show);
        if (show) visible++;
      });

      if (noResults) noResults.classList.toggle("d-none", visible > 0);
    });
  });

  /* ---------- 8. Animated counters (hero stats) ---------- */
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count || "0", 10);
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(target * p);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- 9. Toast helper (Bootstrap) ---------- */
  function showToast(message) {
    const toastEl = document.getElementById("siteToast");
    const toastMsg = document.getElementById("toastMsg");
    if (!toastEl) return;
    if (toastMsg) toastMsg.textContent = message;
    if (window.bootstrap) {
      bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 }).show();
    } else {
      alert(message);
    }
  }

  /* ---------- 10. Contact form (front-end only validation) ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showToast("Please fill in all required fields.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email address.");
        return;
      }
      showToast("Thanks " + name + "! Your message has been sent. 🎮");
      contactForm.reset();
    });
  }

  /* ---------- 11. Newsletter form ---------- */
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletterEmail").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email to subscribe.");
        return;
      }
      showToast("Subscribed! Welcome to the GameVerse newsletter.");
      newsletterForm.reset();
    });
  }

  /* ---------- 12. Game details modal (sample data) ---------- */
  const gameData = {
    "Cyberpunk 2077": {
      genre: "Open-World RPG",
      desc: "Explore Night City as V, a mercenary chasing immortality. Includes the Phantom Liberty spy-thriller expansion with new district Dogtown.",
      meta: "Developer: CD Projekt Red • Release: 2020 • 9.2/10"
    },
    "GTA VI": {
      genre: "Open-World Action",
      desc: "Return to Vice City with Lucia and Jason in Rockstar's most ambitious story yet. Expected 2026 on PS5 and Xbox Series X|S.",
      meta: "Developer: Rockstar Games • Release: 2026 • 9.8/10 (hype)"
    },
    "Elden Ring": {
      genre: "Action RPG",
      desc: "The Game of the Year winner by FromSoftware and George R.R. Martin. Conquer the Lands Between and the Shadow of the Erdtree realm.",
      meta: "Developer: FromSoftware • Release: 2022 • 9.6/10"
    }
  };

  const modalTitle = document.getElementById("gameModalTitle");
  const modalBody = document.getElementById("gameModalBody");

  document.querySelectorAll(".btn-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.game || "Featured Game";
      const info = gameData[name] || { genre: "Featured", desc: "More details coming soon.", meta: "" };
      if (modalTitle) modalTitle.textContent = name;
      if (modalBody) {
        modalBody.innerHTML =
          "<p><span class='badge bg-info text-dark'>" + info.genre + "</span></p>" +
          "<p>" + info.desc + "</p>" +
          "<small class='text-muted'>" + info.meta + "</small>";
      }
      const modalEl = document.getElementById("gameModal");
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
      }
    });
  });

  /* ---------- 13. Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
