/**
 * Patrick Lessa - Portfolio
 * Main JavaScript Application
 */

// ===== DOM Elements =====
const loadingScreen = document.getElementById('loadingScreen');
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');
const cursorGlow = document.getElementById('cursorGlow');
const typingText = document.getElementById('typingText');
const statNumbers = document.querySelectorAll('.stat-number');

// ===== Loading Screen =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'visible';
        initAnimations();
    }, 1500);
});

// ===== Navbar Scroll Effect =====
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add/remove scrolled class
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
    
    // Update active nav link
    updateActiveNavLink();
    
    // Show/hide scroll to top button
    if (currentScrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// ===== Mobile Menu Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Active Nav Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Scroll to Top =====
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Cursor Glow Effect =====
if (cursorGlow && window.innerWidth >= 1024) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// ===== Typing Animation =====
const typingStrings = {
    pt: [
        'Data Scientist',
        'Full Stack Developer',
        'Especialista em IA & RAG',
        'Python Developer',
        'Analytics Engineer'
    ],
    en: [
        'Data Scientist',
        'Full Stack Developer',
        'AI & RAG Specialist',
        'Python Developer',
        'Analytics Engineer'
    ]
};

let currentStringIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeString() {
    // O localStorage só é gravado quando o usuário troca o idioma manualmente. Num
    // primeiro acesso com navegador em inglês, o i18n detecta 'en' mas o storage está
    // vazio — por isso a fonte da verdade é o i18n, com o storage só como reserva.
    const currentLang = (window.i18n && window.i18n.getCurrentLang())
        || localStorage.getItem('portfolio-lang')
        || 'pt';
    const strings = typingStrings[currentLang] || typingStrings.pt;
    const currentString = strings[currentStringIndex];
    
    if (isDeleting) {
        typingText.textContent = currentString.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentString.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && currentCharIndex === currentString.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentStringIndex = (currentStringIndex + 1) % strings.length;
        typingSpeed = 500; // Pause before new string
    }
    
    setTimeout(typeString, typingSpeed);
}

// ===== Counter Animation =====
function animateCounters() {
    statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ===== Reveal on Scroll =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.timeline-item, .education-card, .skill-category, .highlight-item, .project-card, .project-pillar'
    );
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on load
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Skill Hover Effects =====
// Em telas de toque o mouseenter dispara no tap e o brilho fica preso até tocar em outro lugar.
if (window.matchMedia('(hover: hover)').matches) {
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(0, 255, 175, 0.3)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// ===== Initialize Animations =====
function initAnimations() {
    // Start typing animation
    if (typingText) {
        setTimeout(typeString, 1000);
    }
    
    // Animate counters when hero is visible
    const heroSection = document.getElementById('home');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (heroSection) {
        observer.observe(heroSection);
    }
    
    // Initialize scroll reveal
    initScrollReveal();
}

// ===== Parallax Effect on Hero =====
const heroSection = document.querySelector('.hero');
const heroGrid = document.querySelector('.hero-grid');

if (heroSection && heroGrid && window.innerWidth >= 1024) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroGrid.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Preload Images =====
function preloadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        return;
    }
    // Fallback for older browsers
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                lazyLoadObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => lazyLoadObserver.observe(img));
}

// ===== Handle Resize =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reset mobile menu on larger screens
        if (window.innerWidth >= 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// ===== Console Easter Egg =====
console.log(`
%c
    ____        __         _      __       __                        
   / __ \\____ _/ /______(_)____/ /__    / /   ___  _______________ _
  / /_/ / __ \`/ __/ ___/ / ___/ //_/   / /   / _ \\/ ___/ ___/ __ \`/
 / ____/ /_/ / /_/ /  / / /__/ ,<     / /___/  __(__  |__  ) /_/ / 
/_/    \\__,_/\\__/_/  /_/\\___/_/|_|   /_____/\\___/____/____/\\__,_/  

%c📊 Data Scientist & Full Stack Developer | Python • IA/LLMs • React

%cCurious about the code? Check it out:
https://github.com/lessapwb/lessapwb.github.io

`, 
'color: #00AEEF; font-family: monospace;',
'color: #00FFAF; font-size: 14px;',
'color: #F5F7FA; font-size: 12px;'
);

// ===== Performance Monitoring =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`⚡ Page loaded in ${loadTime}ms`);
        }, 0);
    });
}
