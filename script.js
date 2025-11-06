// --- Loader Logic ---
function hideLoader() {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.style.overflow = ""; // Restore body scroll
  }, 500); // Wait for transition to complete
}
document.body.style.overflow = "hidden"; // Hide scroll during load
window.addEventListener("load", hideLoader);

// --- Global Helper Functions for Modals and Popups ---
const confirmationModal = document.getElementById("confirmation-modal");
const callbackModal = document.getElementById("callback-modal");

function showConfirmationModal(message) {
  document.getElementById("confirmation-message").textContent = message;
  confirmationModal.classList.remove("hidden");
  confirmationModal.classList.add("flex");
  document.body.style.overflow = "hidden"; // Disable background scroll
}

function closeConfirmationModal() {
  confirmationModal.classList.add("hidden");
  confirmationModal.classList.remove("flex");
  document.body.style.overflow = ""; // Enable background scroll
}

function openCallbackModal() {
  callbackModal.classList.remove("hidden");
  callbackModal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeCallbackModal() {
  callbackModal.classList.add("hidden");
  callbackModal.classList.remove("flex");
  document.body.style.overflow = "";
}

// --- 1. Mobile Navigation Logic ---
document.getElementById("mobile-menu-open").addEventListener("click", () => {
  document.getElementById("nav-modal").classList.remove("-translate-x-full");
  document
    .getElementById("nav-overlay")
    .classList.remove("opacity-0", "pointer-events-none");
  document
    .getElementById("nav-overlay")
    .classList.add("opacity-30", "pointer-events-auto");
  document.body.style.overflow = "hidden";
});

document
  .getElementById("mobile-menu-close")
  .addEventListener("click", closeMobileNav);
document
  .getElementById("nav-overlay")
  .addEventListener("click", closeMobileNav);

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

function closeMobileNav() {
  document.getElementById("nav-modal").classList.add("-translate-x-full");
  document
    .getElementById("nav-overlay")
    .classList.remove("opacity-30", "pointer-events-auto");
  document
    .getElementById("nav-overlay")
    .classList.add("opacity-0", "pointer-events-none");
  // Re-enable body scroll only if no other modal is open
  if (
    confirmationModal.classList.contains("hidden") &&
    callbackModal.classList.contains("hidden")
  ) {
    document.body.style.overflow = "";
  }
}

// --- 2. Contact Form Submission (Mailto Simulation) ---
function handleContactFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.elements["name"].value;
  const email = form.elements["email"].value;
  const subject = form.elements["subject"].value;
  const message = form.elements["message"].value;

  // Simple mailto construction
  const mailtoBody = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
  const mailtoLink = `mailto:info@hadafimmigration.com?subject=${encodeURIComponent(
    subject
  )}&body=${mailtoBody}`;

  // Show success popup
  showConfirmationModal(
    "Thank you! Your message intent has been noted. Please check your mail client to send the actual email."
  );

  form.reset();
}

// --- 3. Call Back Form Submission (Mailto Simulation) ---
function handleCallbackFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.elements["name"].value;
  const phone = form.elements["phone"].value;
  const country = form.elements["country"].value;

  const subject = "REQUEST FOR CALL BACK - Hadaf Immigration";
  const mailtoBody = `Call Back Request:%0A%0AName: ${name}%0APhone: ${phone}%0ACountry of Interest: ${country}%0A%0APlease call me back at your earliest convenience.`;
  const mailtoLink = `mailto:info@hadafimmigration.com?subject=${encodeURIComponent(
    subject
  )}&body=${mailtoBody}`;

  closeCallbackModal();
  showConfirmationModal(
    "Call back request recorded! We will contact you shortly. Please check your mail client to send the actual email."
  );

  form.reset();
}

// --- 4. Intersection Observer for Fade-In Animation ---
document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((element) => {
    observer.observe(element);
  });
});

// --- 5. Animated Counters Logic ---
const startCounterAnimation = (target) => {
  const counters = target.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const targetValue = parseInt(counter.getAttribute("data-target"));
    let currentValue = 0;
    const duration = 2000; // 2 seconds
    const step = targetValue / (duration / 16); // ~60fps

    const updateCounter = () => {
      if (currentValue < targetValue) {
        currentValue += step;
        // Use Math.ceil to prevent going past the target
        counter.textContent = Math.ceil(currentValue) + "";
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = targetValue + "+";
      }
    };

    updateCounter();
  });
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startCounterAnimation(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document
  .getElementById("success")
  .querySelectorAll(".fade-in")
  .forEach((el) => counterObserver.observe(el));

// --- 6. Testimonial Carousel Logic (Updated for smooth transition) ---
let currentTestimonialIndex = 0;
const slides = document.querySelectorAll(".testimonial-slide");
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("is-active", "flex", "flex-col");
    slide.classList.add("hidden");
  });

  const nextSlide = slides[index];
  nextSlide.classList.remove("hidden");
  nextSlide.classList.add("flex", "flex-col");

  // Apply transition classes after display is set
  setTimeout(() => {
    nextSlide.classList.add("is-active");
  }, 50); // Small delay to ensure display:flex is registered
}

function nextSlide() {
  currentTestimonialIndex = (currentTestimonialIndex + 1) % totalSlides;
  showSlide(currentTestimonialIndex);
}

function prevSlide() {
  currentTestimonialIndex =
    (currentTestimonialIndex - 1 + totalSlides) % totalSlides;
  showSlide(currentTestimonialIndex);
}

document
  .getElementById("next-testimonial")
  .addEventListener("click", nextSlide);
document
  .getElementById("prev-testimonial")
  .addEventListener("click", prevSlide);

// Initial setup
showSlide(currentTestimonialIndex);
// Auto-advance every 5 seconds
setInterval(nextSlide, 5000);
