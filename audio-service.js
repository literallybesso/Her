// audio-service.js
class AudioService {
    constructor() {
      // Create a single audio element to be shared across the site
      this.audio = new Audio();
      this.currentSrc = '';
      
      // Initialize from sessionStorage when created
      this.initFromStorage();
      
      // Save state periodically
      setInterval(() => this.saveState(), 1000);
      
      // Also save when page is about to unload
      window.addEventListener('beforeunload', () => this.saveState());
    }
    
    initFromStorage() {
      // Use sessionStorage so that state doesn't persist beyond the current session
      const audioState = JSON.parse(sessionStorage.getItem('audioState') || '{}');
      
      if (audioState.src) {
        this.currentSrc = audioState.src;
        this.audio.src = audioState.src;
        // Resume from saved position if available; otherwise, start from 0.
        this.audio.currentTime = audioState.position || 0;
        if (audioState.isPlaying) {
          this.audio.play().catch(e => console.error('Auto-play prevented:', e));
        }
      }
    }
    
    saveState() {
      const state = {
        src: this.currentSrc,
        position: this.audio.currentTime,
        isPlaying: !this.audio.paused
      };
      sessionStorage.setItem('audioState', JSON.stringify(state));
    }
    
    play(src) {
      if (src && src !== this.currentSrc) {
        // New audio source
        this.currentSrc = src;
        this.audio.src = src;
        this.audio.currentTime = 0;
      }
      return this.audio.play();
    }
    
    pause() {
      this.audio.pause();
    }
    
    togglePlay() {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }
    
    seek(time) {
      this.audio.currentTime = time;
    }
    
    get currentTime() {
      return this.audio.currentTime;
    }
    
    get duration() {
      return this.audio.duration;
    }
    
    get isPaused() {
      return this.audio.paused;
    }
  }
  
  // Create a singleton instance
  const audioService = new AudioService();
  
  // Export for use across your site
  export default audioService;
  