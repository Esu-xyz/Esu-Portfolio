// ============================================
// Fluid Simulation Effect
// ============================================

class FluidSimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 100;
        this.mouse = { x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0 };
        this.colors = ['#28abff', '#9d5cff'];
        
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                life: 1
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.lastX = this.mouse.x;
            this.mouse.lastY = this.mouse.y;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.vx = this.mouse.x - this.mouse.lastX;
            this.mouse.vy = this.mouse.y - this.mouse.lastY;

            // Create particles at mouse position
            if (Math.abs(this.mouse.vx) > 2 || Math.abs(this.mouse.vy) > 2) {
                for (let i = 0; i < 3; i++) {
                    this.particles.push({
                        x: this.mouse.x + (Math.random() - 0.5) * 20,
                        y: this.mouse.y + (Math.random() - 0.5) * 20,
                        vx: this.mouse.vx * 0.1 + (Math.random() - 0.5) * 2,
                        vy: this.mouse.vy * 0.1 + (Math.random() - 0.5) * 2,
                        radius: Math.random() * 3 + 2,
                        color: this.colors[Math.floor(Math.random() * this.colors.length)],
                        life: 1
                    });
                }
            }
        });

        // Touch support
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mouse.lastX = this.mouse.x;
            this.mouse.lastY = this.mouse.y;
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
            this.mouse.vx = this.mouse.x - this.mouse.lastX;
            this.mouse.vy = this.mouse.y - this.mouse.lastY;
        });
    }

    updateParticles() {
        // Remove dead particles
        this.particles = this.particles.filter(p => p.life > 0);

        // Keep particle count in check
        while (this.particles.length > this.maxParticles * 2) {
            this.particles.shift();
        }

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Apply gravity and friction
            particle.vy += 0.05;
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Mouse interaction - attraction/repulsion
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                const force = (150 - dist) / 150;
                const angle = Math.atan2(dy, dx);
                
                // Push away from mouse
                particle.vx -= Math.cos(angle) * force * 0.5;
                particle.vy -= Math.sin(angle) * force * 0.5;
            }

            // Boundary check with wrapping
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Fade out
            particle.life -= 0.005;
            particle.radius *= 0.995;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            
            // Create gradient for each particle
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 2
            );
            
            gradient.addColorStop(0, this.hexToRgba(particle.color, particle.life * 0.8));
            gradient.addColorStop(1, this.hexToRgba(particle.color, 0));
            
            this.ctx.fillStyle = gradient;
            this.ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawConnections() {
        // Connect nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    const opacity = (1 - dist / 100) * Math.min(p1.life, p2.life) * 0.3;
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.hexToRgba('#28abff', opacity);
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    animate() {
        // Clear with fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateParticles();
        this.drawConnections();
        this.drawParticles();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fluidCanvas');
    new FluidSimulation(canvas);
});