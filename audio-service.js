class AudioService {
  constructor() {
    // Create a single audio element to be shared across the site
    this.audio = new Audio();
    this.currentSrc = '';
    
    // Initialize from sessionStorage when created
    this.initFromStorage();
    
    // Save state more frequently to ensure minimal loss during transitions
    setInterval(() => this.saveState(), 300);
    
    // Save state on page transitions
    window.addEventListener('beforeunload', () => {
      // Force an immediate state save with explicit "playing" flag if audio is playing
      if (!this.audio.paused) {
        const state = {
          src: this.currentSrc,
          position: this.audio.currentTime,
          isPlaying: true,
          timestamp: Date.now() // Add timestamp for calculating time gap
        };
        sessionStorage.setItem('audioState', JSON.stringify(state));
      }
    });
    
    // Handle visibility changes (tab switching, etc.)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveState();
      } else {
        // When becoming visible again, check if we need to recover playback
        this.checkAndRecoverPlayback();
      }
    });
  }
  
  initFromStorage() {
    // Use sessionStorage so that state doesn't persist beyond the current session
    const audioState = JSON.parse(sessionStorage.getItem('audioState') || '{}');
    
    if (audioState.src) {
      this.currentSrc = audioState.src;
      this.audio.src = audioState.src;
      
      // Calculate time gap if timestamp exists
      if (audioState.timestamp && audioState.isPlaying) {
        const timeGap = (Date.now() - audioState.timestamp) / 1000; // in seconds
        // Adjust currentTime to account for the gap during page navigation
        const newPosition = audioState.position + timeGap;
        
        // Handle looping if the audio would have ended
        if (this.audio.duration && newPosition > this.audio.duration) {
          this.audio.currentTime = newPosition % this.audio.duration;
        } else {
          this.audio.currentTime = newPosition;
        }
      } else {
        // Fallback to saved position
        this.audio.currentTime = audioState.position || 0;
      }
      
      // Auto-play with a slight delay to allow audio element to initialize
      if (audioState.isPlaying) {
        setTimeout(() => {
          this.audio.play().catch(e => {
            console.warn('Auto-play prevented:', e);
            // Create a user interaction event handler to enable playback
            this.setupAutoPlayFallback();
          });
        }, 100);
      }
    }
  }
  
  setupAutoPlayFallback() {
    // Add a one-time event listener for user interaction to start audio
    const resumeAudio = () => {
      this.audio.play().catch(e => console.error('Play failed:', e));
      // Remove the event listeners after first interaction
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
    };
    
    document.addEventListener('click', resumeAudio);
    document.addEventListener('keydown', resumeAudio);
  }
  
  checkAndRecoverPlayback() {
    const audioState = JSON.parse(sessionStorage.getItem('audioState') || '{}');
    if (audioState.isPlaying && this.audio.paused) {
      this.audio.play().catch(e => console.warn('Playback recovery failed:', e));
    }
  }
  
  saveState() {
    const state = {
      src: this.currentSrc,
      position: this.audio.currentTime,
      isPlaying: !this.audio.paused,
      timestamp: Date.now()
    };
    sessionStorage.setItem('audioState', JSON.stringify(state));
  }
  
  play(src) {
    if (src && src !== this.currentSrc) {
      // If we're switching tracks, save which track we're using
      this.currentSrc = src;
      this.audio.src = src;
      this.audio.currentTime = 0;
      
      // Save the track index for resuming the correct track
      if (src.includes('heartbeat.mp3')) {
        sessionStorage.setItem('currentTrackIndex', '1');
      } else if (src.includes('DIFF.mp3')) {
        sessionStorage.setItem('currentTrackIndex', '0');
      }
    }
    
    return this.audio.play().catch(e => {
      console.warn('Play failed:', e);
      this.setupAutoPlayFallback();
    });
  }
  
  pause() {
    this.audio.pause();
    this.saveState(); // Immediately save state when explicitly paused
  }
  
  togglePlay() {
    if (this.audio.paused) {
      this.audio.play().catch(e => {
        console.warn('Toggle play failed:', e);
        this.setupAutoPlayFallback();
      });
    } else {
      this.audio.pause();
    }
    this.saveState(); // Immediately save state on toggle
  }
  
  seek(time) {
    this.audio.currentTime = time;
    this.saveState(); // Immediately save state after seeking
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