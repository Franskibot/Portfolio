// Browser-specific scrolling fix for Chromium browsers (Chrome, Edge, Brave)
if (navigator.userAgent.indexOf("Chrome") > -1 || navigator.userAgent.indexOf("Edg") > -1) {
    // Create style element
    const style = document.createElement('style');
    style.textContent = `
        html, body {
            scroll-behavior: auto !important;
        }
        * {
            -webkit-overflow-scrolling: auto !important;
        }
    `;
    // Append to head immediately
    document.head.appendChild(style);
}

// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- SPLITTING JS INITIALIZATION ---
    Splitting();

    // --- LENIS SMOOTH SCROLL ---
    // Browser detection for scroll optimization
    let wheelMultiplierValue = 1.2;
    let durationValue = 0.3;

    // Detect Brave/Chrome
    if (navigator.userAgent.indexOf("Chrome") > -1) {
        wheelMultiplierValue = 1.3;
        durationValue = 0.25;
    }
    // Detect Edge
    else if (navigator.userAgent.indexOf("Edg") > -1) {
        wheelMultiplierValue = 1.4;
        durationValue = 0.2;
    } 

    // Completely disable smooth scrolling for mouse wheel but keep for programmatic scrolling
    const lenis = new Lenis({
        duration: 0.1,
        smoothWheel: false,     // Disable smooth wheel scrolling
        wheelMultiplier: 1,     // Use browser default
        smoothTouch: false,     // Disable for touch too
        touchMultiplier: 1,
        infinite: false
    });

    // Only use Lenis for programmatic scrolling (clicking links)
    gsap.ticker.add((time) => { 
        lenis.raf(time * 1000); 
    });
    gsap.ticker.lagSmoothing(0);

    // --- CURSOR ---
    const cursor = document.querySelector('.cursor-ft');

    // Only initialize cursor if it exists in the DOM
    if (cursor) {
        // Check if device supports hover (has a mouse)
        const supportsHover = window.matchMedia('(hover: hover)').matches;
        
        if (supportsHover) {
            const cursorDot = cursor.querySelector('.cursor-ft-dot');
            const cursorOutline = cursor.querySelector('.cursor-ft-outline');
            
            if (cursorDot && cursorOutline) {
                cursor.style.display = 'block';
                let mouseX = 0, mouseY = 0;
                let outlineX = 0, outlineY = 0;
                const outlineDelay = 0.1;

                gsap.set(cursor, { xPercent: -50, yPercent: -50 });
                gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
                gsap.set(cursorOutline, { xPercent: -50, yPercent: -50 });

                window.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    gsap.to(cursorDot, { duration: 0.03, x: mouseX, y: mouseY });
                });

                gsap.ticker.add(() => {
                    outlineX += (mouseX - outlineX) * outlineDelay;
                    outlineY += (mouseY - outlineY) * outlineDelay;
                    gsap.set(cursorOutline, { x: outlineX, y: outlineY });
                });
                
                document.querySelectorAll('a, button, .btn-ft, .ft-project-item-link, .ft-menu-toggle, input, textarea, .ft-social-icon-link, .email-magnet-ft').forEach(el => {
                    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-ft-hover'));
                    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ft-hover'));
                });
                document.querySelectorAll('h1, h2, h3, h4, .ft-nav-link span, .ft-logo a, .btn-ft span, .ft-section-tag, .ft-method-link, .ft-project-title').forEach(el => {
                    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-ft-text-hover'));
                    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ft-text-hover'));
                });
            }
        } else {
            // On touch devices, ensure cursor is hidden and doesn't initialize
            cursor.style.display = 'none';
            // Remove the cursor-related classes if they were somehow added
            document.body.classList.remove('cursor-ft-hover', 'cursor-ft-text-hover');
        }
    }


    // --- PRELOADER ANIMATION ---
    const preloader = document.querySelector('.preloader-ft');
    const preloaderCells = gsap.utils.toArray('.preloader-ft-cell');
    const preloaderLine = document.querySelector('.preloader-ft-line');

    if (preloader && preloaderCells.length && preloaderLine) {
        document.body.style.overflow = 'hidden'; // Prevent scroll during preloader
        const preloaderTl = gsap.timeline({
            onComplete: () => {
                if (preloader) preloader.style.display = 'none';
                document.body.style.overflow = '';
                initPageAnimations();
            }
        });
        preloaderTl
            .to(preloaderCells, {
                opacity: 1,
                scale: 1,
                stagger: {
                    each: 0.05,
                    from: "random"
                },
                duration: 0.6,
                ease: "power2.out"
            })
            .to(preloaderLine, {
                width: "80%",
                duration: 1,
                ease: "power3.inOut"
            }, "-=0.3")
            .to(preloaderCells, {
                opacity: 0,
                y: -20,
                stagger: {
                    each: 0.03,
                    from: "end"
                },
                duration: 0.4,
                ease: "power1.in"
            }, "-=0.3")
            .to(preloaderLine, {
                width: "100%",
                opacity: 0,
                duration: 0.3,
                ease: "power1.in"
            }, "-=0.2")
            .to(preloader, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut"
            });
    } else {
        if (preloader) preloader.style.display = 'none';
        document.body.style.overflow = '';
        initPageAnimations();
    }


    // --- MAIN PAGE ANIMATIONS FUNCTION ---
    function initPageAnimations() {
        // Header Animation
        gsap.to(".ft-main-header", {
            y: 0,
            duration: 1,
            ease: "expo.out",
            delay: 0.2 // Delay after preloader
        });

        // Hero Section Animations
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" }});
        heroTl
            .fromTo(".ft-hero-eyebrow span", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, delay: 0.5 }) // Start after header
            .fromTo(".ft-hero-title .title-line .char",
                { opacity:0, yPercent: 100, rotationZ: 10 },
                { opacity:1, yPercent: 0, rotationZ: 0, stagger: 0.03, duration: 1, ease: "expo.out" }, "-=0.5")
            .fromTo(".ft-hero-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
            .fromTo(".ft-hero-cta-container", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
            .fromTo(".ft-hero-bottom-bar", { opacity: 0, yPercent: 100 }, { opacity: 1, yPercent: 0, duration: 1, ease: "expo.out"}, "-=0.7");

        // Hero background shapes parallax
        gsap.utils.toArray(".ft-hero-background-visual .ft-bg-shape").forEach(shape => {
            gsap.to(shape, {
                x: () => gsap.utils.random(-100, 100, 1),
                y: () => gsap.utils.random(-150, 150, 1),
                rotation: () => gsap.utils.random(-90, 90, 1),
                scale: () => gsap.utils.random(0.8, 1.5, 0.1),
                scrollTrigger: {
                    trigger: ".ft-hero-section",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5 + Math.random() * 2,
                }
            });
        });
        gsap.to(".ft-hero-background-visual .ft-bg-grid-pattern", {
            yPercent: -30,
            scrollTrigger: {
                trigger: ".ft-hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });


        // General Scroll-Triggered Animations for Sections and Elements
        gsap.utils.toArray("section").forEach((section, i) => {
            const sectionTitle = section.querySelector(".ft-section-title");
            if (sectionTitle) {
                const chars = sectionTitle.querySelectorAll(".char");
                if (chars.length > 0) {
                     gsap.fromTo(chars,
                        { opacity:0, yPercent: 100, skewY: 7 },
                        {
                            opacity:1, yPercent: 0, skewY: 0,
                            stagger: 0.02, duration: 0.8, ease: "circ.out",
                            scrollTrigger: { trigger: sectionTitle, start: "top 85%", toggleActions: "play none none none" }
                        }
                    );
                }
            }
            const sectionTag = section.querySelector(".ft-section-tag");
            if (sectionTag) {
                gsap.fromTo(sectionTag, { opacity: 0, y: 20, scale:0.9 }, {
                    opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out",
                    scrollTrigger: { trigger: sectionTag, start: "top 90%", toggleActions: "play none none none" }
                });
            }
        });

        // Generic [data-anim] reveal
        gsap.utils.toArray("[data-anim]").forEach(el => {
            const delay = parseFloat(el.dataset.delay) || 0;
            const type = el.dataset.anim;

            let fromState = { opacity: 0 };
            if (type === "fade-up") fromState.y = 50;
            if (type === "fade-left") fromState.x = -50;
            if (type === "fade-right") fromState.x = 50;
            if (type === "scale-in") { fromState.scale = 0.8; fromState.y = 0; }

            gsap.fromTo(el, fromState, {
                opacity: 1, y: 0, x: 0, scale: 1,
                duration: 1,
                delay: delay,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    toggleActions: "play none none none",
                }
            });
        });
        
        // Parallax Dividers
        gsap.utils.toArray(".parallax-divider-ft svg").forEach(svg => {
            const speed = parseFloat(svg.closest(".parallax-divider-ft").dataset.speed) || 1;
            gsap.to(svg, {
                yPercent: -30 * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: svg.closest(".parallax-divider-ft"),
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // About Section - Visual Stack Animation
        const visualCards = gsap.utils.toArray(".ft-visual-stack .ft-visual-card");
        if (visualCards.length) {
            gsap.fromTo(visualCards,
                { opacity:0, y:50, rotationZ: (i) => (i % 2 === 0 ? -5 : 5) },
                {
                    opacity:1, y:0, rotationZ: (i) => (i % 2 === 0 ? -2 : 3),
                    stagger:0.15, duration:1, ease:"expo.out",
                    scrollTrigger: { trigger: ".ft-visual-stack", start:"top 80%" }
                }
            );
        }
        // Tech icons animation in About
        const techIcons = gsap.utils.toArray('.ft-tech-icon-grid span');
        if (techIcons.length) {
            gsap.fromTo(techIcons,
                { opacity: 0, scale: 0.5 },
                {
                    opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: "back.out(1.7)",
                    scrollTrigger: { trigger: ".ft-tech-icon-grid", start: "top 90%" }
                }
            );
        }
        
        // Project Items Interaction & Animation
        const projectItems = gsap.utils.toArray(".ft-project-item");
        if (projectItems.length) {
            gsap.fromTo(projectItems,
                { opacity:0, y:60, rotationX:-10, transformPerspective: 1000},
                {
                    opacity:1, y:0, rotationX:0,
                    stagger:0.15, duration:1, ease:"expo.out",
                    scrollTrigger: { trigger: ".ft-projects-grid", start:"top 80%" }
                }
            );
        }
        // Project item details toggle
        document.querySelectorAll('.ft-project-item-link').forEach(link => {
            link.addEventListener('click', function(e) {
                // Allow default behavior if it's a real link to another page/site (e.g. GitHub)
                if (this.getAttribute('href') && this.getAttribute('href') !== '#' && this.getAttribute('target') === '_blank') {
                    return;
                }
                e.preventDefault();
                const item = this.closest('.ft-project-item');
                if (item) {
                    item.classList.toggle('details-visible');
                    ScrollTrigger.refresh();
                }
            });
        });


        // Skills Section Bars Animation
        gsap.utils.toArray(".ft-skill-progress").forEach(bar => {
            const targetWidth = bar.style.width; // Get target width from inline style
            gsap.fromTo(bar, 
                { width: "0%" }, // Start from 0%
                {
                width: targetWidth,
                duration: 1.5,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: bar.closest(".ft-skill-item"),
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        });
        
        // Contact Form Animation
        const contactFormArea = document.querySelector(".ft-contact-form-area");
        if (contactFormArea) {
             gsap.fromTo(contactFormArea,
                { opacity:0, scale:0.95, filter: "blur(3px)" },
                {
                    opacity:1, scale:1, filter: "blur(0px)",
                    duration:1, ease:"expo.out",
                    scrollTrigger: { trigger: contactFormArea, start:"top 80%" }
                }
            );
        }
        // Form input label animation
        const inputs = document.querySelectorAll('.ft-contact-form input, .ft-contact-form textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => input.closest('.ft-form-group').classList.add('focused'));
            input.addEventListener('blur', () => {
                if (!input.value) input.closest('.ft-form-group').classList.remove('focused');
            });
             // Initialize focused state for pre-filled inputs (e.g. browser autofill)
            if (input.value) {
                input.closest('.ft-form-group').classList.add('focused');
            }
        });
        const contactForm = document.getElementById('ft-contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Grazie per il tuo messaggio! (Questo è un demo, il form non invia dati reali)');
                this.reset();
                 inputs.forEach(input => {
                    input.closest('.ft-form-group').classList.remove('focused')
                 });
            });
        }


        // Magnetic Buttons (GSAP)
        document.querySelectorAll('.btn-ft-magnetic, .email-magnet-ft').forEach(btn => {
            const strength = btn.classList.contains('email-magnet-ft') ? 40 : 20;
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
                 if (btn.querySelector('.btn-ft-arrow')) {
                    gsap.to(btn.querySelector('.btn-ft-arrow'), {
                        x: x * 0.1,
                        y: y * 0.1,
                        duration: 0.5,
                        ease: 'elastic.out(1, 0.5)'
                    });
                }
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
                 if (btn.querySelector('.btn-ft-arrow')) {
                    gsap.to(btn.querySelector('.btn-ft-arrow'), { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
                }
            });
        });
        
        // Active Nav Link on Scroll
        const navLinks = document.querySelectorAll('.ft-main-nav a');
        const pageSections = document.querySelectorAll('section[id]');
        const varHeaderHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height-ft')) || 80;
        
        function updateActiveNavLink() {
            let currentSectionId = '';
            const headerOffset = varHeaderHeight + 50;

            pageSections.forEach(section => {
                const sectionTop = section.offsetTop - headerOffset;
                if (lenis.scroll >= sectionTop) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref && linkHref.substring(1) === currentSectionId) {
                    link.classList.add('active');
                }
            });
        }

        // Add throttling to your nav update function
        let scrollThrottleTimer;
        function throttledUpdateActiveNavLink() {
            if (!scrollThrottleTimer) {
                scrollThrottleTimer = setTimeout(() => {
                    updateActiveNavLink();
                    scrollThrottleTimer = null;
                }, 100);  // Update at most every 100ms
            }
        }

        if (pageSections.length && navLinks.length) {
            lenis.on('scroll', throttledUpdateActiveNavLink);
            updateActiveNavLink();
        }
        
        // Smooth scroll to section on nav link click
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                 if (targetId && targetId.startsWith("#") && document.querySelector(targetId)) {
                    lenis.scrollTo(targetId, { offset: -varHeaderHeight + 1 });
                } else if (targetId === "#hero-ft" || targetId === "#") {
                     lenis.scrollTo(0);
                }

                if (mainNav.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.classList.remove('no-scroll-ft');
                }
            });
        });


    } // Fine initPageAnimations()

    // --- Mobile Menu ---
    const menuToggle = document.querySelector('.ft-menu-toggle');
    const mainNav = document.querySelector('.ft-main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Toggle no-scroll class on body
            document.body.classList.toggle('no-scroll-ft', mainNav.classList.contains('active'));
            
            // Ensure proper ARIA attributes for accessibility
            const expanded = mainNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', expanded);
        });
        
        // Close menu when clicking on a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll-ft');
            });
        });
    }

    // --- Footer Year ---
    const yearSpan = document.getElementById('year-ft');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

}); // Fine DOMContentLoaded

// Add this after Lenis initialization
// Reduce animation processing during rapid scrolling
let isScrollingTimeout;
lenis.on('scroll', () => {
    // Clear timeout if scroll is ongoing
    window.clearTimeout(isScrollingTimeout);
    
    // Set a timeout to run after scrolling ends (300ms)
    isScrollingTimeout = setTimeout(() => {
        // Optional: run heavier animations only after scrolling stops
    }, 300);
});

// Add this after your Lenis initialization:

// Track scrolling state
let isScrolling = false;
let scrollTimeout;

// Pause animations during active scrolling
window.addEventListener('wheel', () => {
    if (!isScrolling) {
        isScrolling = true;
        document.body.classList.add('is-scrolling');
        
        // Pause GSAP animations during scroll
        gsap.globalTimeline.pause();
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        document.body.classList.remove('is-scrolling');
        
        // Resume animations after scrolling stops
        gsap.globalTimeline.resume();
    }, 200);
}, { passive: true });

// Add this at the end of your DOMContentLoaded event:

// Toggle button for disabling smooth scroll
const toggleButton = document.getElementById('toggle-smooth-scroll');
if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        if (lenis.isStopped) {
            lenis.start();
            toggleButton.textContent = 'Disattiva Scroll Fluido';
            localStorage.setItem('smoothScrollEnabled', 'true');
        } else {
            lenis.stop();
            toggleButton.textContent = 'Attiva Scroll Fluido';
            localStorage.setItem('smoothScrollEnabled', 'false');
        }
    });
    
    // Check saved preference
    if (localStorage.getItem('smoothScrollEnabled') === 'false') {
        lenis.stop();
        toggleButton.textContent = 'Attiva Scroll Fluido';
    }
}