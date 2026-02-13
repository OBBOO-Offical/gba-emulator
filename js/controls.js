/*
 * ============================================================
 * SETUP INSTRUCTIONS - CONTROLS
 * ============================================================
 */

class ControlsManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.keyStates = {};
        
        this.keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'z': 'b',
            'x': 'a',
            'Enter': 'start',
            'Shift': 'select'
        };
        
        this.setupKeyboardControls();
        this.setupTouchControls();
        
        console.log('Controls initialized');
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            const button = this.keyMap[e.key];
            
            if (button && !this.keyStates[button]) {
                e.preventDefault();
                this.keyStates[button] = true;
                this.emulator.pressKey(button);
                this.highlightButton(button, true);
            }
        });

        document.addEventListener('keyup', (e) => {
            const button = this.keyMap[e.key];
            
            if (button) {
                e.preventDefault();
                this.keyStates[button] = false;
                this.emulator.releaseKey(button);
                this.highlightButton(button, false);
            }
        });
    }

    setupTouchControls() {
        const touchButtons = document.querySelectorAll('.dpad-btn, .action-btn');
        
        touchButtons.forEach(button => {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const key = button.dataset.key;
                
                button.classList.add('pressed');
                this.keyStates[key] = true;
                this.emulator.pressKey(key);
            }, { passive: false });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                const key = button.dataset.key;
                
                button.classList.remove('pressed');
                this.keyStates[key] = false;
                this.emulator.releaseKey(key);
            }, { passive: false });

            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                const key = button.dataset.key;
                
                button.classList.remove('pressed');
                this.keyStates[key] = false;
                this.emulator.releaseKey(key);
            }, { passive: false });
        });
    }

    highlightButton(button, pressed) {
        const btnElement = document.querySelector(`[data-key="${button}"]`);
        if (btnElement) {
            if (pressed) {
                btnElement.classList.add('pressed');
            } else {
                btnElement.classList.remove('pressed');
            }
        }
    }
}

let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

window.ControlsManager = ControlsManager;
