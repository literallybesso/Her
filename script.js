// Import the audio service module
import audioService from './audio-service.js';

// Custom cursor implementation
function initCustomCursor() {
  // Check if we're on a Windows system (better support for .ani files)
  const isWindows = navigator.userAgent.indexOf('Windows') !== -1;
  
  // Set default cursor for the body
  if (isWindows) {
    // Use .ani file for Windows browsers
    document.body.style.cursor = 'url("assets/cursors/pomcursorani.ani"), auto';
  } else {
    // Use .cur file for non-Windows browsers
    document.body.style.cursor = 'url("assets/cursors/pompointercur.cur"), auto';
  }
  
  // Special cursor for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, [role="button"]');
  interactiveElements.forEach(element => {
    element.style.cursor = 'url("assets/cursors/pompointerpng.png"), pointer';
  });
}

// Smooth scrolling for internal navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// When the DOM is fully loaded, start/resume audio playback using the AudioService
document.addEventListener("DOMContentLoaded", () => {
  // Initialize custom cursor first
  initCustomCursor();
  
  audioService.play("Audio/DIFF.mp3");
  
  // Initialize reveal buttons functionality
  initRevealButtons();
  
  // Initialize text hover effects
  initTextHoverEffects();
  
  // Initialize live counter update
  initLiveCounter();
  
  // Initialize sparkle effect on mouse move
  initSparkleEffect();
});

// -- Reveal Buttons (For "My Reasons" / "My Final Act") --
function initRevealButtons() {
  const reasonsBtn = document.getElementById('reasonsBtn');
  const finalActBtn = document.getElementById('finalActBtn');
  
  if(reasonsBtn && finalActBtn) {
    const reasonsContent = document.querySelector('#reasons .story-container');
    const finalActContent = document.querySelector('#final-act .apology-container');
    
    reasonsBtn.addEventListener('click', function() {
      this.classList.add('magical');
      setTimeout(() => {
        reasonsContent.classList.add('show');
        this.classList.remove('button-animation');
        this.classList.remove('magical');
        document.querySelector('#reasons').scrollIntoView({ behavior: 'smooth' });
      }, 800);
    });
    
    finalActBtn.addEventListener('click', function() {
      this.classList.add('magical');
      setTimeout(() => {
        finalActContent.classList.add('show');
        this.classList.remove('button-animation');
        this.classList.remove('magical');
        document.querySelector('#final-act').scrollIntoView({ behavior: 'smooth' });
      }, 800);
    });
  }
}

// -- Hover Effects for Paragraph Text --
function initTextHoverEffects() {
  const paragraphs = document.querySelectorAll('.story-container p, .apology-container p');
  
  paragraphs.forEach(paragraph => {
    if (!paragraph.querySelector('.hover-text')) {
      const text = paragraph.textContent;
      const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
      if (sentences.length > 0) {
        const firstSentence = sentences[0];
        const restOfText = text.substring(firstSentence.length);
        paragraph.innerHTML = `<span class="hover-text">${firstSentence}</span>${restOfText}`;
      }
    }
  });
}

// -- Animated Floating Hearts --
function createHeart() {
  const heart = document.createElement("span");
  heart.classList.add("floating-heart");
  heart.innerHTML = "&#10084;"; // Unicode heart character

  // Randomize size (30px to 60px)
  heart.style.fontSize = (Math.random() * 30 + 30) + "px";
  // Random horizontal position (0% - 100%)
  heart.style.left = Math.random() * 100 + "%";
  // Random animation duration (4s - 7s)
  heart.style.animationDuration = (Math.random() * 3 + 4) + "s";

  // Click interaction: pop heart, show "Malak"
  heart.addEventListener('click', () => {
    createMalakPopup(heart.style.left, heart.style.fontSize);
    heart.remove();
  });

  document.querySelector(".heart-container").appendChild(heart);

  // Remove the heart after animation
  setTimeout(() => {
    heart.remove();
  }, parseFloat(heart.style.animationDuration) * 1000);
}

// Generate hearts every 500 milliseconds
setInterval(createHeart, 500);

// Popup "Malak" at heart position
function createMalakPopup(leftPos, fontSize) {
  const popup = document.createElement("div");
  popup.classList.add("malak-popup");
  popup.innerText = "Malak";

  // Convert leftPos (e.g. "42.5%") to numeric for optional variation
  popup.style.left = leftPos;
  // For vertical, just pick a random vertical offset (like 50% or so).
  // But we want it near the same location the heart was. The hearts float from bottom to top,
  // so we'll approximate it. We can just set top = 50% or so, or we can store the heart's top dynamically.
  // For simplicity, let's put it around mid-screen:
  popup.style.top = "50%";

  document.querySelector(".heart-container").appendChild(popup);

  // Remove popup after animation
  setTimeout(() => {
    popup.remove();
  }, 800);
}

// -- Magic Button (Navigates to page2.html) --
const magicBtn = document.getElementById("magicBtn");
if (magicBtn) {
  magicBtn.addEventListener("click", function () {
    this.classList.add("magical");
    setTimeout(() => {
      this.classList.remove("magical");
      window.location.href = "page2.html";
    }, 1000);
  });
}

let liveCounterInterval = null;

function updateLiveCounter() {
  // Only update if the page is visible
  if (document.hidden) return;
  
  const liveCounter = document.getElementById('liveCounter');
  if (liveCounter) {
    let count = parseInt(liveCounter.dataset.count, 10) || 0;
    count++;
    liveCounter.dataset.count = count;
    liveCounter.textContent = `Moments of Love: ${count}`;
    sessionStorage.setItem("loveCount", count);
  }
}

function initLiveCounter() {
  const liveCounter = document.getElementById('liveCounter');
  if (liveCounter) {
    let storedCount = parseInt(sessionStorage.getItem("loveCount"), 10) || 0;
    liveCounter.dataset.count = storedCount;
    liveCounter.textContent = `Moments of Love: ${storedCount}`;
    
    // Clear any existing interval before setting a new one.
    if (liveCounterInterval) clearInterval(liveCounterInterval);
    liveCounterInterval = setInterval(updateLiveCounter, 1000);
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && liveCounterInterval) {
    clearInterval(liveCounterInterval);
  } else if (!liveCounterInterval) {
    // Only reinitialize the counter if it isn’t already running
    initLiveCounter();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Other initializations...
  initLiveCounter();
});



// ---------- Sparkle Effect (Follows the Cursor) ----------
function initSparkleEffect() {
  document.addEventListener('mousemove', (e) => {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.innerHTML = '&#10022;'; // Unicode sparkle character
    // Use clientX and clientY so the sparkle is fixed relative to the viewport
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => {
      sparkle.remove();
    }, 800);
  });
}

// Handle cursor visibility on page load
window.addEventListener('load', function() {
  // Force cursor refresh
  const tempCursor = document.body.style.cursor;
  document.body.style.cursor = 'default';
  setTimeout(() => {
    initCustomCursor(); // Re-apply custom cursor
  }, 100);
});
