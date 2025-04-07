// Import the audio service module
import audioService from './audio-service.js';

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
  audioService.play("Audio/DIFF.mp3");
  
  // Initialize reveal buttons functionality
  initRevealButtons();
  
  // Initialize text hover effects
  initTextHoverEffects();
});

// Function to initialize the reveal buttons
function initRevealButtons() {
  const reasonsBtn = document.getElementById('reasonsBtn');
  const finalActBtn = document.getElementById('finalActBtn');
  
  if(reasonsBtn && finalActBtn) {
    const reasonsContent = document.querySelector('#reasons .story-container');
    const finalActContent = document.querySelector('#final-act .apology-container');
    
    reasonsBtn.addEventListener('click', function() {
      // Add special effect before revealing
      this.classList.add('magical');
      
      // After a short delay, reveal the content
      setTimeout(() => {
        reasonsContent.classList.add('show');
        this.classList.remove('button-animation');
        this.classList.remove('magical');
        
        // Smooth scroll to the section
        document.querySelector('#reasons').scrollIntoView({
          behavior: 'smooth'
        });
      }, 800);
    });
    
    finalActBtn.addEventListener('click', function() {
      // Add special effect before revealing
      this.classList.add('magical');
      
      // After a short delay, reveal the content
      setTimeout(() => {
        finalActContent.classList.add('show');
        this.classList.remove('button-animation');
        this.classList.remove('magical');
        
        // Smooth scroll to the section
        document.querySelector('#final-act').scrollIntoView({
          behavior: 'smooth'
        });
      }, 800);
    });
  }
}

// Function to add hover effects to text segments
function initTextHoverEffects() {
  // Find all paragraphs within the containers
  const paragraphs = document.querySelectorAll('.story-container p, .apology-container p');
  
  paragraphs.forEach(paragraph => {
    // If it doesn't already have hover-text spans
    if (!paragraph.querySelector('.hover-text')) {
      // Split the paragraph by sentences and wrap the first sentence
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

// Function to create and animate a heart element
function createHeart() {
  const heart = document.createElement("span");
  heart.classList.add("floating-heart");
  heart.innerHTML = "&#10084;"; // Unicode heart character

  // Randomize size: from 30px to 60px
  heart.style.fontSize = (Math.random() * 30 + 30) + "px";

  // Random horizontal position (0% - 100%)
  heart.style.left = Math.random() * 100 + "%";

  // Random animation duration (4s - 7s)
  heart.style.animationDuration = (Math.random() * 3 + 4) + "s";

  // Append heart to the container
  document.querySelector(".heart-container").appendChild(heart);

  // Remove the heart after its animation completes
  setTimeout(() => {
    heart.remove();
  }, parseFloat(heart.style.animationDuration) * 1000);
}

// Generate hearts every 500 milliseconds (old animation code)
setInterval(createHeart, 500);

// Magic Button Interactivity (old code with audio state preserved)
// The magic button plays a "magical" animation, then navigates to page2.html.
const magicBtn = document.getElementById("magicBtn");
if (magicBtn) {
  magicBtn.addEventListener("click", function () {
    // Optionally, you can save the current audio time explicitly:
    // localStorage.setItem("audioCurrentTime", audioService.currentTime);
    this.classList.add("magical");
    // After 1 second, remove the effect and navigate to page2.html
    setTimeout(() => {
      this.classList.remove("magical");
      window.location.href = "page2.html";
    }, 1000);
  });
}