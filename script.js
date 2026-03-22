/* ================================================================
   SCRIPT.JS — Hemant Digarse Portfolio
   Typing · Particles · Cursor Glow · Tilt · Stats Counter · Reveals
   ================================================================ */

// ======================== LOADING SCREEN ========================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            initReveal();
            addStaggerDelays();
        }, 300);
    }, 1200);
});

// Typing animation removed for new hero design

// ======================== PARTICLE BACKGROUND ========================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.baseOpacity = this.opacity;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction — particles glow near cursor
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
            this.opacity = this.baseOpacity + (1 - dist / 200) * 0.4;
            // Slight push away from cursor
            this.x += dx * 0.002;
            this.y += dy * 0.002;
        } else {
            this.opacity = this.baseOpacity;
        }

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function createParticles() {
    const count = window.innerWidth < 768 ? 40 : 90;
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
createParticles();

function drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
                const opacity = (1 - dist / maxDist) * 0.12;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ======================== CURSOR GLOW ========================
const cursorGlow = document.getElementById('cursor-glow');

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('visible');
    });
}

// ======================== NAVBAR SCROLL EFFECTS ========================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveLink();
    toggleBackToTop();
});

function updateActiveLink() {
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ======================== HAMBURGER MENU ========================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ======================== SCROLL REVEAL WITH STAGGER ========================
function addStaggerDelays() {
    // Add stagger delays to grid children
    document.querySelectorAll('.skills-grid, .projects-grid, .stats-grid, .about-details').forEach(grid => {
        const children = grid.querySelectorAll('.reveal');
        children.forEach((child, i) => {
            child.classList.add(`delay-${(i % 6) + 1}`);
        });
    });
}

function initReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ======================== SKILL BAR ANIMATION ========================
const skillSection = document.getElementById('skills');
let skillsAnimated = false;

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            skillsAnimated = true;
            const fills = document.querySelectorAll('.skill-fill');
            fills.forEach((fill, index) => {
                const width = fill.getAttribute('data-width');
                setTimeout(() => {
                    fill.style.width = width;
                    // Add dot glow at end
                    setTimeout(() => fill.classList.add('animated'), 1400);
                }, index * 150);
            });
        }
    });
}, { threshold: 0.3 });

if (skillSection) skillObserver.observe(skillSection);

// ======================== STATS COUNTER ANIMATION ========================
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + suffix;
                    }
                };
                updateCounter();
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-section').forEach(s => statsObserver.observe(s));

// ======================== 3D TILT EFFECT ========================
function initTilt() {
    if (window.innerWidth < 768) return; // Skip on mobile

    document.querySelectorAll('[data-tilt]').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -6;
            const rotateY = (x - centerX) / centerX * 6;

            element.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            element.style.transition = 'transform 0.1s ease-out';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

// Init tilt after page loads
setTimeout(initTilt, 2000);

// ======================== BACK TO TOP BUTTON ========================
const backToTopBtn = document.getElementById('back-to-top');

function toggleBackToTop() {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ======================== CONTACT FORM ========================
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        showFormNotification('Please fill in all fields.', 'error');
        return;
    }

    const btn = contactForm.querySelector('.btn-submit');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        btn.style.background = 'linear-gradient(135deg, #00e676, #00c853)';

        showFormNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

        contactForm.reset();

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }, 1500);
});

function showFormNotification(msg, type) {
    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'form-notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 32px;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 9998;
        animation: slideInRight 0.4s ease;
        backdrop-filter: blur(12px);
        border: 1px solid ${type === 'success' ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)'};
        background: ${type === 'success' ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.15)'};
        color: ${type === 'success' ? '#00e676' : '#ff5252'};
        font-family: 'Inter', sans-serif;
    `;
    notification.textContent = msg;
    document.body.appendChild(notification);

    if (!document.querySelector('#slide-animation-style')) {
        const style = document.createElement('style');
        style.id = 'slide-animation-style';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'all 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ======================== THEME TOGGLE ========================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');

    if (isLight) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('portfolio-theme', 'light');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('portfolio-theme', 'dark');
    }
});

// ======================== SMOOTH SCROLL ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
