/*
 * ============================================================
 * SETUP INSTRUCTIONS - MAIN APP
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('GBA Emulator App starting...');
    
    const emulatorManager = new GBAEmulatorManager();
    let controlsManager = null;
    
    const romInput = document.getElementById('romInput');
    const gameContainer = document.getElementById('gameContainer');
    const touchControls = document.getElementById('touchControls');
    const status = document.getElementById('status');
    
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    function showStatus(message, type = 'loading') {
        status.textContent = message;
        status.className = 'status ' + type;
        status.style.display = 'block';
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                status.style.display = 'none';
            }, 3000);
        }
    }
    
    romInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        
        if (!file) return;
        
        if (!file.name.toLowerCase().endsWith('.gba')) {
            showStatus('Please select a valid .gba file', 'error');
            return;
        }
        
        showStatus('Loading ROM...', 'loading');
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            await emulatorManager.loadROM(arrayBuffer);
            
            gameContainer.classList.add('active');
            touchControls.classList.add('active');
            
            if (!controlsManager) {
                controlsManager = new ControlsManager(emulatorManager);
            }
            
            emulatorManager.start();
            showStatus('ROM loaded successfully! 🎮', 'success');
            
            gameContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
        } catch (error) {
            console.error('Error loading ROM:', error);
            showStatus('Error loading ROM: ' + error.message, 'error');
        }
    });
    
    playBtn.addEventListener('click', () => {
        if (!emulatorManager.running) {
            emulatorManager.start();
            showStatus('Game started', 'success');
        }
    });
    
    pauseBtn.addEventListener('click', () => {
        emulatorManager.pause();
        showStatus(emulatorManager.paused ? 'Game paused' : 'Game resumed', 'success');
    });
    
    resetBtn.addEventListener('click', () => {
        if (confirm('Reset the game? Any unsaved progress will be lost.')) {
            emulatorManager.reset();
            showStatus('Game reset', 'success');
        }
    });
    
    saveBtn.addEventListener('click', () => {
        const slot = 0;
        if (emulatorManager.saveState(slot)) {
            showStatus('Game saved to slot ' + slot, 'success');
        } else {
            showStatus('Error saving game', 'error');
        }
    });
    
    loadBtn.addEventListener('click', () => {
        const slot = 0;
        if (emulatorManager.loadState(slot)) {
            showStatus('Game loaded from slot ' + slot, 'success');
        } else {
            showStatus('No save state found in slot ' + slot, 'error');
        }
    });
    
    fullscreenBtn.addEventListener('click', () => {
        const canvas = document.getElementById('screen');
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen();
            } else if (canvas.webkitRequestFullscreen) {
                canvas.webkitRequestFullscreen();
            }
        }
    });
    
    console.log('App initialized successfully');
});
