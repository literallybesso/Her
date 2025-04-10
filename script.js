// Import the audio service module
import audioService from './audio-service.js';

// Add an audio tracks array and a function to switch between tracks
const audioTracks = [
  "Audio/DIFF.mp3",
  "Audio/heartbeat.mp3",  // Replace with your actual second track path
  // Add more tracks as needed
];

// Get current track index from sessionStorage or default to 0
let currentTrackIndex = parseInt(sessionStorage.getItem('currentTrackIndex') || '0');

function switchAudioTrack() {
  // Move to next track (or loop back to the first one)
  currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
  // Store new track index in sessionStorage
  sessionStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
  // Play the new track
  audioService.play(audioTracks[currentTrackIndex]);
}

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
  
  // Initialize audio (only start a new track if not already playing)
  const audioState = JSON.parse(sessionStorage.getItem('audioState') || '{}');
  if (!audioState.src) {
    // No audio state found, start playing the current track
    audioService.play(audioTracks[currentTrackIndex]);
  }
  
  // Initialize reveal buttons functionality
  initRevealButtons();
  
  // Initialize text hover effects
  initTextHoverEffects();
  
  // Initialize live counter update
  initLiveCounter();
  
  // Initialize sparkle effect on mouse move
  initSparkleEffect();
  
  // Add event listener to audio switch button if it exists
  const switchAudioBtn = document.getElementById('switchAudioBtn');
  if (switchAudioBtn) {
    switchAudioBtn.addEventListener('click', function() {
      this.classList.add('magical');
      switchAudioTrack();
      setTimeout(() => {
        this.classList.remove('magical');
      }, 1000);
    });
  }
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

  popup.style.left = leftPos;
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
    
    // Ensure audio state is saved immediately before navigation
    audioService.saveState();
    
    setTimeout(() => {
      this.classList.remove("magical");
      // Navigate to the next page
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
    // Only reinitialize the counter if it isn't already running
    initLiveCounter();
  }
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

document.addEventListener("DOMContentLoaded", () => {
  // Check if video already played (optional for one-time play logic)
  // if (localStorage.getItem("introPlayed")) return;

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "intro-video-overlay";

  const video = document.createElement("video");
  video.id = "intro-video";
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;

  // fallback if autoplay fails
  video.setAttribute("preload", "auto");

  const source = document.createElement("source");
  source.src = "webintro/joker.webm"; // ✅ Check this path
  source.type = "video/webm";

  video.appendChild(source);
  overlay.appendChild(video);
  document.body.appendChild(overlay);

  // Video ends or fails = fade out
  const removeOverlay = () => {
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.remove();
      // localStorage.setItem("introPlayed", true); // Optional: remember it's played
    }, 1000);
  };

  video.addEventListener("ended", removeOverlay);
  video.addEventListener("error", removeOverlay); // fallback if video fails

  // Safety timeout in case video doesn't fire events
  setTimeout(() => {
    if (document.body.contains(overlay)) removeOverlay();
  }, 15000); // 15 seconds safety net
});


