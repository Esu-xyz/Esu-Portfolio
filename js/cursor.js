// ============================================
// Custom Cursor with Fluid Trail Effect
// ============================================

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.canvas = null;
        this.ctx = null;
        this.points = [];
        this.maxPoints = 30; // Nombre de points pour la traînée
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.isHovering = false;
        
        this.init();
    }

    init() {
        // Only init on desktop
        if (window.innerWidth <= 768) return;

        this.createCanvas();
        this.createCursor();
        this.addStyles();
        this.addEventListeners();
        this.animate();
    }

    createCanvas() {
        // Create canvas for trail
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'cursor-trail-canvas';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    createCursor() {
        // Main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .cursor-trail-canvas {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9998;
            }
            
            .custom-cursor {
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                border: 2px solid #28abff;
                opacity: 0;
                mix-blend-mode: difference;
                transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
            }
            
            .custom-cursor.active {
                opacity: 1;
            }
            
            .custom-cursor.hovering {
                width: 40px;
                height: 40px;
                border-color: #9d5cff;
                background: rgba(157, 92, 255, 0.1);
            }
            
            /* Hide default cursor on interactive elements */
            @media (hover: hover) and (pointer: fine) {
                a, button, .project-card, input, textarea {
                    cursor: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addEventListeners() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Initialize cursor position on first move
            if (this.cursorX === 0 && this.cursorY === 0) {
                this.cursorX = this.mouseX;
                this.cursorY = this.mouseY;
            }
            
            this.cursor.classList.add('active');
            
            // Add point to trail with lifetime (use animated cursor position)
            this.points.push({
                x: this.cursorX,
                y: this.cursorY,
                life: 1 // Full life at creation
            });
        });

        // Mouse leave
        document.addEventListener('mouseleave', () => {
            this.cursor.classList.remove('active');
            this.points = [];
        });

        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, input, textarea, .nav-link');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.cursor.classList.add('hovering');
            });
            
            el.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.cursor.classList.remove('hovering');
            });
        });

        // Click effect
        document.addEventListener('mousedown', () => {
            this.cursor.style.transform = 'scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            this.cursor.style.transform = 'scale(1)';
        });

        // Resize canvas
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    updateCursor() {
        // Smooth follow
        const lerpFactor = 0.25;
        
        const dx = this.mouseX - this.cursorX;
        const dy = this.mouseY - this.cursorY;
        
        this.cursorX += dx * lerpFactor;
        this.cursorY += dy * lerpFactor;
        
        // Update main cursor position
        this.cursor.style.left = (this.cursorX - this.cursor.offsetWidth / 2) + 'px';
        this.cursor.style.top = (this.cursorY - this.cursor.offsetHeight / 2) + 'px';
    }

    drawTrail() {
        // Clear canvas completely (no fade)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.points.length < 2) return;
        
        // Update points lifetime and remove old ones
        this.points = this.points.map(point => {
            point.life = (point.life || 1) - 0.02; // Decay over time
            return point;
        }).filter(point => point.life > 0);
        
        // Draw trail segments with decreasing width
        for (let i = 0; i < this.points.length - 1; i++) {
            const point = this.points[i];
            const nextPoint = this.points[i + 1];
            
            // Calculate width: starts at 25 at cursor, shrinks to 0 at tail
            const progress = i / this.points.length;
            const width = 25 * progress; // Start at 0, grow to 25
            
            if (width < 0.5) continue; // Skip if too small
            
            this.ctx.beginPath();
            this.ctx.moveTo(point.x, point.y);
            this.ctx.lineTo(nextPoint.x, nextPoint.y);
            
            // White color
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = width;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.stroke();
        }
    }

    animate() {
        this.updateCursor();
        this.drawTrail();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CustomCursor();
    });
} else {
    new CustomCursor();
}

// Reinit on window resize if needed
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const existingCanvas = document.querySelector('.cursor-trail-canvas');
        const existingCursor = document.querySelector('.custom-cursor');
        
        if (window.innerWidth <= 768 && existingCanvas) {
            // Remove on mobile
            existingCanvas?.remove();
            existingCursor?.remove();
        } else if (window.innerWidth > 768 && !existingCanvas) {
            // Reinit on desktop
            new CustomCursor();
        }
    }, 250);
});