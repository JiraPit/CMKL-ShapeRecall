// app.js
document.addEventListener('DOMContentLoaded', () => {
    const screens = {
      home:   document.getElementById('home'),
      memory: document.getElementById('memory'),
      input:  document.getElementById('input')
    };
    const homeBtn         = document.getElementById('homeBtn');
    const startBtn        = document.getElementById('startBtn');
    const patternContainer= document.querySelector('.pattern-container');
    const progress        = document.querySelector('.progress');
    const answerContainer = document.getElementById('answerContainer');
    const submitBtn       = document.getElementById('submitBtn');
    const shapeButtons    = document.querySelectorAll('.shape-btn');
    const backspaceBtn    = document.querySelector('.backspace-btn');
    const colorButtons    = document.querySelectorAll('.color-picker .color');
    const notificationEl  = document.getElementById('notification');
    const memoryLevelEl   = document.querySelector('#memory h1');
    const inputLevelEl    = document.querySelector('#input h1');
  
    let currentColor = 'pink';
    let patternSequence = [];
    let answerSequence = [];
    let currentLevel = 1;
  
    function updateLevelDisplay() {
      memoryLevelEl.textContent = `Level ${currentLevel}`;
      inputLevelEl.textContent  = `Level ${currentLevel}`;
    }
  
    function showScreen(id) {
      Object.values(screens).forEach(s => s.classList.remove('active'));
      screens[id].classList.add('active');
      if (id === 'memory') {
        // restart the 2s progress animation
        progress.style.animation = 'none';
        void progress.offsetWidth;
        progress.style.animation = '';
      }
      if (id === 'input') {
        notificationEl.textContent = '';
        notificationEl.className = 'notification';
      }
    }
  
    function generatePattern() {
      patternSequence = [];
      patternContainer.innerHTML = '';
      const shapes = ['square','circle','triangle','star'];
      const colors = ['pink','green','blue'];
      for (let i = 0; i < 4; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        patternSequence.push({ shape, color });
        const div = document.createElement('div');
        div.className = `shape ${shape} ${color}`;
        patternContainer.appendChild(div);
      }
    }
  
    // initialize level text
    updateLevelDisplay();
  
    // Home button always returns to start and resets the level
    homeBtn.addEventListener('click', () => {
      showScreen('home');
      answerSequence = [];
      answerContainer.innerHTML = '';
      currentLevel = 1;
      updateLevelDisplay();
    });
  
    // Start → memory → input
    startBtn.addEventListener('click', () => {
      showScreen('memory');
      updateLevelDisplay();
      generatePattern();
      // initial memory display (4 s)
      setTimeout(() => showScreen('input'), 4000);
    });
  
    // Color picker
    colorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        currentColor = btn.classList.contains('green') ? 'green'
                     : btn.classList.contains('blue')  ? 'blue'
                     : 'pink';
        colorButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  
    // Shape & backspace
    shapeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn === backspaceBtn) {
          if (!answerSequence.length) return;
          answerSequence.pop();
          answerContainer.removeChild(answerContainer.lastChild);
          return;
        }
        
        // Limit input to 4 shapes
        if (answerSequence.length >= 4) return;
        
        const shapeName = btn.classList.contains('square-btn')   ? 'square'
                        : btn.classList.contains('circle-btn')   ? 'circle'
                        : btn.classList.contains('triangle-btn') ? 'triangle'
                        : 'star';
        answerSequence.push({ shape: shapeName, color: currentColor });
        const el = document.createElement('div');
        el.className = `shape ${shapeName} ${currentColor}`;
        answerContainer.appendChild(el);
      });
    });
  
    // Submit & check
    submitBtn.addEventListener('click', () => {
      const correct = answerSequence.length === patternSequence.length
        && answerSequence.every((a, i) =>
             a.shape === patternSequence[i].shape
          && a.color === patternSequence[i].color
        );
  
      notificationEl.textContent = correct ? 'Correct!' : 'Incorrect!';
      notificationEl.classList.add(correct ? 'correct' : 'incorrect');
  
      // clear user answer immediately
      answerSequence = [];
      answerContainer.innerHTML = '';
  
      // after 1s, go back into memory
      setTimeout(() => {
        showScreen('memory');
  
        if (correct) {
          currentLevel++;
          updateLevelDisplay();
          generatePattern();
        }
        // on incorrect: patternSequence stays the same
  
        setTimeout(() => showScreen('input'), 4000);
      }, 1000);
    });
  });
  