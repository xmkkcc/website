// Mobile nav toggle + set year in footer + homepage clock + persistent background music
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[id^="year"]').forEach(el => el.textContent = new Date().getFullYear());

  // Initialize persistent background music player
  function initBackgroundMusic() {
    // Check if global audio player already exists
    if (!document.getElementById('global-audio-player')) {
      const audioDiv = document.createElement('div');
      audioDiv.id = 'global-audio-player-container';
      audioDiv.innerHTML = `
        <audio id="global-audio-player" loop muted style="display: none;">
          <source src="TINH VỆ (精卫) - JAPANDEE REMIX - YouTube.mp3" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      `;
      document.body.appendChild(audioDiv);
    }
    
    const audio = document.getElementById('global-audio-player');
    if (audio) {
      // Restore playback position from previous page
      const currentTime = parseFloat(sessionStorage.getItem('audioTime')) || 0;
      if (currentTime > 0) {
        audio.currentTime = currentTime;
      }
      
      // Set crossOrigin for better compatibility
      audio.crossOrigin = 'anonymous';
      
      // Log audio state for debugging
      audio.addEventListener('loadstart', () => {
        console.log('Audio loading...');
      });
      
      audio.addEventListener('loadedmetadata', () => {
        console.log('Audio metadata loaded:', audio.duration, 'seconds');
      });
      
      audio.addEventListener('canplay', () => {
        console.log('Audio ready to play');
      });
      
      audio.addEventListener('error', (e) => {
        console.log('Audio error:', e.target.error.code, e.target.error.message);
      });
      
      // Save playback state every second
      setInterval(() => {
        try {
          if (!isNaN(audio.currentTime)) {
            sessionStorage.setItem('audioTime', audio.currentTime);
          }
          sessionStorage.setItem('audioPlaying', !audio.paused);
        } catch (e) {
          // Storage might be full or unavailable
        }
      }, 1000);
      
      // Update state on play/pause
      audio.addEventListener('play', () => {
        try {
          sessionStorage.setItem('audioPlaying', 'true');
        } catch (e) {}
        updateMusicButtonState();
      });
      
      audio.addEventListener('pause', () => {
        try {
          sessionStorage.setItem('audioPlaying', 'false');
        } catch (e) {}
        updateMusicButtonState();
      });
    }
  }

  function updateMusicButtonState() {
    const btn = document.getElementById('music-toggle-btn');
    const audio = document.getElementById('global-audio-player');
    if (btn && audio && !audio.paused) {
      btn.classList.add('playing');
    } else if (btn) {
      btn.classList.remove('playing');
    }
  }

  initBackgroundMusic();

  function startClock() {
    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    if (!timeEl || !dateEl) return;

    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = `${h}:${m}:${s}`;

      const dayName = days[now.getDay()];
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      dateEl.textContent = `${dayName}, ngày ${day}/${month}/${year}`;
    };

    update();
    setInterval(update, 1000);
  }

  startClock();

  // Mobile navigation toggle
  ['navToggle','navToggle2','navToggle3','navToggle4'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const nav = document.getElementById('main' + id.replace('navToggle','Nav'));
    btn.addEventListener('click', () => {
      if (nav) nav.classList.toggle('open');
    });
    
    // Close menu when link is clicked
    if (nav) {
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('open');
        });
      });
    }
  });

  // Add floating music control button
  function addMusicControl() {
    if (!document.getElementById('music-toggle-btn')) {
      const btn = document.createElement('button');
      btn.id = 'music-toggle-btn';
      btn.className = 'music-toggle-btn';
      btn.title = 'Bật/Tắt nhạc nền';
      btn.innerHTML = '🎵';
      
      btn.addEventListener('click', () => {
        const audio = document.getElementById('global-audio-player');
        if (!audio) return;
        
        if (audio.paused) {
          // Play audio
          audio.muted = false;
          
          // Ensure audio source is set correctly
          if (!audio.src && !audio.querySelector('source')) {
            console.log('No audio source found');
            return;
          }
          
          // Wait for audio to be ready before playing
          if (audio.readyState >= 2) {
            // Audio is ready to play
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  btn.classList.add('playing');
                  console.log('Audio playing successfully');
                })
                .catch(err => {
                  console.log('Audio playback error:', err.name, '-', err.message);
                  audio.muted = true;
                  btn.classList.remove('playing');
                });
            }
          } else {
            // Audio not ready yet - try to load it
            audio.load();
            
            // Wait for canplay event before attempting to play
            const playWhenReady = () => {
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    btn.classList.add('playing');
                    console.log('Audio playing successfully');
                    audio.removeEventListener('canplay', playWhenReady);
                  })
                  .catch(err => {
                    console.log('Audio playback error:', err.name, '-', err.message);
                    audio.muted = true;
                    btn.classList.remove('playing');
                    audio.removeEventListener('canplay', playWhenReady);
                  });
              }
            };
            
            audio.addEventListener('canplay', playWhenReady, { once: true });
            
            // Timeout fallback in case canplay never fires
            setTimeout(() => {
              audio.removeEventListener('canplay', playWhenReady);
            }, 5000);
          }
        } else {
          // Pause audio
          audio.pause();
          audio.muted = true;
          btn.classList.remove('playing');
        }
      });
      
      document.body.appendChild(btn);
    }
  }
  
  addMusicControl();
});
// Đợi trang web tải xong
document.addEventListener("DOMContentLoaded", function() {
    const galleryImages = document.querySelectorAll('.gallery img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    // Gán sự kiện click cho từng ảnh trong gallery
    galleryImages.forEach(img => {
        img.onclick = function() {
            lightbox.style.display = 'flex';
            lightboxImg.src = this.src;
        };
    });
});