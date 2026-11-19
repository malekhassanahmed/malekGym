/* =========================================================
   POWER ZONE FITNESS CLUB - MAIN JAVASCRIPT
   Mandatory features:
   1. Highlights slider (previous / next buttons)
   2. Program cards generated from a JavaScript array
   3. Contact form validation
   Optional enhancements:
   - Mobile navigation menu
   - Sticky header & active navigation link
   - Back to top button
   - Gallery lightbox
   - Automatic slider rotation
   - Reveal-on-scroll animation
   ========================================================= */


/* ---------------------------------------------------------
   FEATURE 2: PROGRAMS DATA (array of objects)
   Each icon is a small inline SVG drawing.
   --------------------------------------------------------- */
const programs = [
  {
    id: 1,
    title: "Strength Training",
    description: "Build muscle and power with structured lifting sessions using free weights, barbells and machines.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12"/></svg>'
  },
  {
    id: 2,
    title: "Cardio Fitness",
    description: "Improve your stamina and heart health with energetic running, cycling and interval workouts.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>'
  },
  {
    id: 3,
    title: "Group Training",
    description: "Stay motivated in high-energy group sessions where everyone trains together and pushes each other.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c2.8 0 5 2.2 5 5"/></svg>'
  },
  {
    id: 4,
    title: "Beginner Fitness",
    description: "New to the gym? Learn the basics, correct technique and healthy habits at a comfortable pace.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>'
  }
];

// Creates one program card element from a program object
function createProgramCard(program) {
  const card = document.createElement("article");
  card.className = "program-card reveal";

  card.innerHTML = `
    <span class="program-number">0${program.id}</span>
    <div class="program-icon">${program.icon}</div>
    <h3 class="program-title">${program.title}</h3>
    <p class="program-text">${program.description}</p>
  `;

  return card;
}

// Loops through the programs array and adds every card to the page
function renderPrograms() {
  const programsGrid = document.getElementById("programsGrid");

  programs.forEach(function (program) {
    const card = createProgramCard(program);
    programsGrid.appendChild(card);
  });
}


/* ---------------------------------------------------------
   FEATURE 1: HIGHLIGHTS SLIDER
   --------------------------------------------------------- */
const sliderTrack = document.getElementById("sliderTrack");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("sliderDots");
const sliderCounter = document.getElementById("sliderCounter");
const sliderElement = document.getElementById("slider");

let currentSlide = 0;
let autoPlayTimer = null;
const AUTO_PLAY_DELAY = 5000; // 5 seconds

// Creates one dot button for each slide
function createSliderDots() {
  slides.forEach(function (slide, index) {
    const dot = document.createElement("button");
    dot.className = "slider-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Go to highlight " + (index + 1));

    dot.addEventListener("click", function () {
      goToSlide(index);
      restartAutoPlay();
    });

    dotsContainer.appendChild(dot);
  });
}

// Moves the slider to the slide with the given index
function goToSlide(index) {
  // Wrap around: after the last slide go back to the first, and the other way round
  if (index < 0) {
    index = slides.length - 1;
  } else if (index >= slides.length) {
    index = 0;
  }

  currentSlide = index;
  sliderTrack.style.transform = "translateX(-" + currentSlide * 100 + "%)";
  updateSliderIndicators();
}

// Highlights the active dot and updates the "1 / 4" counter
function updateSliderIndicators() {
  const dots = dotsContainer.querySelectorAll(".slider-dot");

  dots.forEach(function (dot, index) {
    const isActive = index === currentSlide;
    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-selected", isActive);
  });

  slides.forEach(function (slide, index) {
    slide.setAttribute("aria-hidden", index !== currentSlide);
  });

  sliderCounter.textContent = (currentSlide + 1) + " / " + slides.length;
}

function showNextSlide() {
  goToSlide(currentSlide + 1);
}

function showPreviousSlide() {
  goToSlide(currentSlide - 1);
}

// Automatic rotation (optional enhancement)
function startAutoPlay() {
  autoPlayTimer = setInterval(showNextSlide, AUTO_PLAY_DELAY);
}

function stopAutoPlay() {
  clearInterval(autoPlayTimer);
}

function restartAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

function initSlider() {
  createSliderDots();
  goToSlide(0);

  nextBtn.addEventListener("click", function () {
    showNextSlide();
    restartAutoPlay();
  });

  prevBtn.addEventListener("click", function () {
    showPreviousSlide();
    restartAutoPlay();
  });

  // Pause automatic rotation while the mouse is over the slider
  sliderElement.addEventListener("mouseenter", stopAutoPlay);
  sliderElement.addEventListener("mouseleave", restartAutoPlay);

  startAutoPlay();
}


/* ---------------------------------------------------------
   FEATURE 3: CONTACT FORM VALIDATION
   --------------------------------------------------------- */
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const successMessage = document.getElementById("successMessage");

// Simple email pattern: text @ text . text
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Shows an error message under a field
function showError(input, message) {
  const formGroup = input.parentElement;
  const errorElement = document.getElementById(input.id + "Error");

  formGroup.classList.add("invalid");
  input.setAttribute("aria-invalid", "true");
  errorElement.textContent = message;
}

// Removes the error message from a field
function clearError(input) {
  const formGroup = input.parentElement;
  const errorElement = document.getElementById(input.id + "Error");

  formGroup.classList.remove("invalid");
  input.removeAttribute("aria-invalid");
  errorElement.textContent = "";
}

// Checks every field and returns true only if all are valid
function validateForm() {
  let isValid = true;

  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const messageValue = messageInput.value.trim();

  // 1. Name must not be empty
  if (nameValue === "") {
    showError(nameInput, "Please enter your full name.");
    isValid = false;
  } else {
    clearError(nameInput);
  }

  // 2. Email must not be empty and must have a valid format
  if (emailValue === "") {
    showError(emailInput, "Please enter your email address.");
    isValid = false;
  } else if (!EMAIL_PATTERN.test(emailValue)) {
    showError(emailInput, "Please enter a valid email address (example: name@example.com).");
    isValid = false;
  } else {
    clearError(emailInput);
  }

  // 3. Message must not be empty
  if (messageValue === "") {
    showError(messageInput, "Please write a message.");
    isValid = false;
  } else {
    clearError(messageInput);
  }

  return isValid;
}

function handleFormSubmit(event) {
  // Stop the browser from reloading the page
  event.preventDefault();
  successMessage.textContent = "";

  if (!validateForm()) {
    // Move focus to the first field with an error
    const firstInvalid = contactForm.querySelector("[aria-invalid='true']");
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

  const firstName = nameInput.value.trim().split(" ")[0];
  successMessage.textContent =
    "Thank you, " + firstName + "! Your message passed validation. " +
    "(This is a demo form, so the message was not sent anywhere.)";

  contactForm.reset();
}

function initContactForm() {
  contactForm.addEventListener("submit", handleFormSubmit);

  // Clear a field's error as soon as the user starts typing again
  [nameInput, emailInput, messageInput].forEach(function (input) {
    input.addEventListener("input", function () {
      clearError(input);
    });
  });
}


/* ---------------------------------------------------------
   OPTIONAL: MOBILE NAVIGATION
   --------------------------------------------------------- */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");

function closeMobileMenu() {
  mainNav.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

function toggleMobileMenu() {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

function initNavigation() {
  navToggle.addEventListener("click", toggleMobileMenu);

  // Close the mobile menu after a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMobileMenu);
  });
}


/* ---------------------------------------------------------
   OPTIONAL: STICKY HEADER, ACTIVE LINK & BACK TO TOP
   --------------------------------------------------------- */
const siteHeader = document.getElementById("siteHeader");
const backToTopBtn = document.getElementById("backToTop");
const sections = document.querySelectorAll("main section[id]");

// Section IDs that have a link in the navigation
const navSectionIds = ["home", "about", "programs", "gallery", "contact"];

function updateActiveLink() {
  const scrollPosition = window.scrollY + window.innerHeight / 3;
  let activeId = "home";

  sections.forEach(function (section) {
    if (navSectionIds.includes(section.id) && scrollPosition >= section.offsetTop) {
      activeId = section.id;
    }
  });

  // At the very bottom of the page, highlight the last link (Contact)
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
    activeId = "contact";
  }

  navLinks.forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === "#" + activeId);
  });
}

function handleScroll() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 40);
  backToTopBtn.classList.toggle("visible", window.scrollY > 600);
  updateActiveLink();
}

function initScrollFeatures() {
  window.addEventListener("scroll", handleScroll);

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  handleScroll();
}


/* ---------------------------------------------------------
   OPTIONAL: GALLERY LIGHTBOX
   --------------------------------------------------------- */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(image, caption) {
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

function initLightbox() {
  const galleryCards = document.querySelectorAll(".gallery-card");

  galleryCards.forEach(function (card) {
    const image = card.querySelector("img");
    const caption = card.querySelector("figcaption").textContent;

    // Make the card usable with the keyboard as well
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Open image: " + caption);

    card.addEventListener("click", function () {
      openLightbox(image, caption);
    });

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image, caption);
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  // Close when clicking the dark background
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Close with the Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}


/* ---------------------------------------------------------
   OPTIONAL: REVEAL ON SCROLL
   --------------------------------------------------------- */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  // Older browsers: just show everything
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) {
      element.classList.add("revealed");
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(function (element) {
    observer.observe(element);
  });
}


/* ---------------------------------------------------------
   START EVERYTHING WHEN THE PAGE IS READY
   --------------------------------------------------------- */
function init() {
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  renderPrograms();        // must run before reveal animations (cards use .reveal)
  initSlider();
  initContactForm();
  initNavigation();
  initScrollFeatures();
  initLightbox();
  initRevealAnimations();
}

init();
