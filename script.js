// ==========================
// Navigation + Smooth Scroll + Active-on-Scroll (Unified)
// ==========================

// Utility: get all nav anchor elements and their inner buttons
const navAnchors = Array.from(document.querySelectorAll('.nav a'));
const navButtons = navAnchors.map(a => a.querySelector('button'));

// Helper to clear active state from all visible buttons
function clearActiveButtons() {
  navButtons.forEach(b => {
    if (b) b.classList.remove('active');
  });
}

// Smooth scroll + click behavior: ensure inner button gets active class
navAnchors.forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }

    // Update visual active state on inner button
    clearActiveButtons();
    const innerBtn = anchor.querySelector('button');
    if (innerBtn) innerBtn.classList.add('active');
  });
});

// Also keep existing direct button click behavior (in case user clicks button directly)
document.querySelectorAll('.nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    clearActiveButtons();
    btn.classList.add('active');
  });
});


// ==========================
// Fade-up animation for scroll and page load
// ==========================
const fadeElements = document.querySelectorAll('.fade-up');

const elementInView = (el, offset = 100) => {
  const top = el.getBoundingClientRect().top;
  return top <= (window.innerHeight - offset);
};

const displayElement = (el) => {
  el.classList.add('show');
};

const handleFadeOnScroll = () => {
  fadeElements.forEach((el, index) => {
    if (elementInView(el, 100)) {
      setTimeout(() => displayElement(el), index * 150);
    }
  });
};

window.addEventListener('scroll', handleFadeOnScroll);
window.addEventListener('load', () => {
  fadeElements.forEach((el, index) => {
    setTimeout(() => displayElement(el), index * 100);
  });
});


// ==========================
// Popup after EmailJS form submit
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact-form");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");

  // Your EmailJS IDs (replace these with your actual values)
  const SERVICE_ID = "service_5vlo606";
  const TEMPLATE_ID = "template_ejrvnbf";

  if (form && popup && closePopup) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
        .then(() => {
          popup.style.display = "flex";
          form.reset();
        })
        .catch(error => {
          console.error("EmailJS Error:", error);
          alert("Oops! Something went wrong. Please try again later.");
        });
    });

    closePopup.addEventListener('click', function () {
      popup.style.display = "none";
    });

    window.addEventListener('click', function (e) {
      if (e.target === popup) popup.style.display = "none";
    });
  }
});



// ==========================
// Active Tab Highlight on Scroll (works with .nav a > button structure)
// ==========================

const sections = Array.from(document.querySelectorAll('section[id]'));

// Determine which section is "active" based on viewport center (more robust)
function updateActiveOnScroll() {
  // A point a bit below top (use 1/3 viewport) to determine which section is "current"
  const viewportPoint = window.innerHeight * 0.25;

  let currentId = null;
  for (const sec of sections) {
    const rect = sec.getBoundingClientRect();
    // If the viewportPoint falls within the section's bounding box, consider it active
    if (rect.top <= viewportPoint && rect.bottom > viewportPoint) {
      currentId = sec.id;
      break;
    }
  }

  if (!currentId) {
    // Fallback: if scrolled to top, select the first section
    if (window.scrollY === 0 && sections.length) currentId = sections[0].id;
  }

  // Apply active to the inner button corresponding to that anchor href
  clearActiveButtons();
  if (currentId) {
    const matchingAnchor = navAnchors.find(a => a.getAttribute('href') === `#${currentId}`);
    if (matchingAnchor) {
      const btn = matchingAnchor.querySelector('button');
      if (btn) btn.classList.add('active');
    }
  }
}

// Run on scroll and on load/resizing (resizing can change bounding boxes)
window.addEventListener('scroll', updateActiveOnScroll);
window.addEventListener('load', updateActiveOnScroll);
window.addEventListener('resize', updateActiveOnScroll);

// Run an initial check in case page opens mid-document
setTimeout(updateActiveOnScroll, 100);


