// ============================================
// Main JavaScript - Interactions & Animations
// ============================================

// Smooth scroll function
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// ============================================
// Initialize chromatic aberration text
// ============================================
function initChromaticText() {
    const chromaticElements = document.querySelectorAll('.chromatic-text');
    
    chromaticElements.forEach(el => {
        const text = el.textContent;
        el.setAttribute('data-text', text);
    });
}

// ============================================
// Project Cards Animation on Scroll
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe skill items
    document.querySelectorAll('.skill-item').forEach((skill, index) => {
        skill.style.opacity = '0';
        skill.style.transform = 'translateX(-30px)';
        skill.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(skill);
    });
}

// ============================================
// Skill bars animation
// ============================================
function animateSkillBars() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.skill-fill');
                fills.forEach((fill, index) => {
                    setTimeout(() => {
                        fill.style.width = fill.style.width;
                    }, index * 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-category').forEach(category => {
        skillObserver.observe(category);
    });
}

// ============================================
// Parallax effect on scroll
// ============================================
function initParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Parallax for hero content
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroContent.style.opacity = Math.max(1 - scrolled / 600, 0);
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// Cursor effect - Custom cursor trail
// ============================================
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            width: 20px;
            height: 20px;
            border: 2px solid #28abff;
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            mix-blend-mode: difference;
            opacity: 0;
        }
        
        .custom-cursor.active {
            opacity: 1;
        }

        .custom-cursor.clicked {
            transform: scale(0.5);
            border-color: #9d5cff;
        }

        a, button, .project-card {
            cursor: none;
        }
    `;
    document.head.appendChild(cursorStyle);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });

    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicked');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicked');
    });

    // Smooth cursor follow
    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .nav-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = '#9d5cff';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = '#28abff';
        });
    });
}

// ============================================
// Project card tilt effect
// ============================================
function initProjectCardTilt() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ============================================
// Navigation background on scroll
// ============================================
function initNavScroll() {
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.7)';
            nav.style.boxShadow = 'none';
        }
    });
}

// ============================================
// Active section detection for navigation
// ============================================
function initActiveSection() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                
                navLinks.forEach(link => {
                    link.style.color = 'var(--text-white)';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--primary)';
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });
}

// ============================================
// Initialize everything when DOM is ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initChromaticText();
    initScrollAnimations();
    animateSkillBars();
    initParallax();
    initCustomCursor();
    initProjectCardTilt();
    initNavScroll();
    initActiveSection();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// Optimize performance
// ============================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Re-init animations on resize if needed
        initScrollAnimations();
    }, 250);
});