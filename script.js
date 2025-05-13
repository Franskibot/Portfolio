document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Splitting.js for text animations ---
    // Splitting.js divide il testo in parole e caratteri per animazioni più fini.
    // Si applica agli elementi con l'attributo `data-splitting`.
    if (typeof Splitting === 'function') {
        Splitting();
    }

    // --- Initialize Lucide Icons ---
    // Se le icone Lucide sono usate, questo le renderizza.
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- Element Selectors ---
    const preloader = document.querySelector('.preloader');
    const mainHeader = document.getElementById('main-header');
    const navLinksContainer = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const heroSection = document.getElementById('hero');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    // const scrollIndicator = document.querySelector('.scroll-indicator'); // L'animazione è gestita da .hero-section.loaded
    // const heroCta = document.querySelector('.hero-cta'); // L'animazione è gestita da .hero-section.loaded
    const sectionsToAnimate = document.querySelectorAll('section.content-section');
    const contactForm = document.getElementById('contact-form');
    const currentYearEl = document.getElementById('currentYear');
    const timestampEl = document.getElementById('footer-timestamp');

    // --- PRELOADER & INITIAL ANIMATIONS ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('loaded');
            }
            document.body.classList.add('loaded'); // Per animazioni globali post-load

            if (heroSection) {
                heroSection.classList.add('loaded'); // Triggera animazioni specifiche della hero
            }
            if (heroSubtitle) {
                heroSubtitle.classList.add('visible'); // Triggera animazione del sottotitolo hero
            }

            // Inizializza Intersection Observers dopo il caricamento e il preloader
            sectionsToAnimate.forEach(section => {
                // La hero section ha già la sua classe 'loaded', non serve ri-osservarla con questo observer principale.
                // Altre sezioni verranno osservate per triggerare le loro animazioni.
                if (section.id !== 'hero') {
                    // console.log("Observing section:", section.id); // Debug
                    contentObserver.observe(section);
                }
            });

            if (contactForm) {
                // console.log("Observing contact form"); // Debug
                contactFormObserver.observe(contactForm);
            }

            // Imposta la variabile CSS --item-index per l'animazione staggerata delle competenze
            const skillItems = document.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                item.style.setProperty('--item-index', index);
            });

        }, 1800); // Durata minima del preloader, regola se necessario
    });

    // --- HEADER BEHAVIOR ---
    let lastScrollTop = 0;
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > mainHeader.offsetHeight) {
                mainHeader.classList.add('header-hidden'); // Nascondi scendendo
            } else {
                mainHeader.classList.remove('header-hidden'); // Mostra salendo o in cima
            }
            if (scrollTop > 50) {
                mainHeader.classList.add('header-scrolled'); // Cambia sfondo dopo un po' di scroll
            } else {
                mainHeader.classList.remove('header-scrolled');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, { passive: true });
    }

    // --- MOBILE MENU ---
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
            // Blocca lo scroll del body quando il menu è aperto
            document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
        });

        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navLinksContainer.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- INTERSECTION OBSERVER FOR CONTENT SECTIONS ANIMATIONS ---
    const contentObserverOptions = {
        root: null, // Relativo al viewport
        rootMargin: '0px',
        threshold: 0.15 // Triggera quando il 15% della sezione è visibile
    };

    const contentRevealCallback = (entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // console.log(entry.target.id || entry.target.className, "is intersecting, ADDING .loaded class"); // Debug
                entry.target.classList.add('loaded'); // Aggiunge .loaded alla SECTION
                observerInstance.unobserve(entry.target); // Non osservare più una volta animato
            }
        });
    };
    const contentObserver = new IntersectionObserver(contentRevealCallback, contentObserverOptions);
    // L'osservazione delle sezioni (`sectionsToAnimate`) è avviata nell'evento 'load'

    // --- INTERSECTION OBSERVER FOR CONTACT FORM ---
    const contactFormObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.25 // Triggera quando il 25% del form è visibile
    };
    const contactFormRevealCallback = (entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // console.log("Contact form is intersecting, ADDING .visible class"); // Debug
                entry.target.classList.add('visible'); // Aggiunge .visible al FORM
                observerInstance.unobserve(entry.target);
            }
        });
    };
    const contactFormObserver = new IntersectionObserver(contactFormRevealCallback, contactFormObserverOptions);
    // L'osservazione del form (`contactForm`) è avviata nell'evento 'load'

    // --- ACTIVE NAV LINK ON SCROLL ---
    const sectionsForNavHighlight = document.querySelectorAll('section[id]'); // Prende tutte le sezioni con un ID
    if (mainHeader && allNavLinks.length > 0 && sectionsForNavHighlight.length > 0) {
        window.addEventListener('scroll', () => {
            let currentActiveSectionId = '';
            sectionsForNavHighlight.forEach(section => {
                const sectionTop = section.offsetTop;
                // L'offsetHeight dell'header + un piccolo buffer per triggerare prima
                if (pageYOffset >= sectionTop - mainHeader.offsetHeight - 100) {
                    currentActiveSectionId = section.getAttribute('id');
                }
            });

            allNavLinks.forEach(link => {
                link.classList.remove('active');
                // Controlla se l'href del link corrisponde (ignorando '#') all'ID della sezione corrente
                if (link.getAttribute('href') && link.getAttribute('href').substring(1) === currentActiveSectionId) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });
    }

    // --- FOOTER ---
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    function updateTimestamp() {
        if (timestampEl) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            // const dateString = now.toLocaleDateString('it-IT', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
            // timestampEl.innerHTML = `Local time: ${timeString} <br> ${dateString}`;
            timestampEl.textContent = `Ora Locale: ${timeString} (Italia)`; // Semplificato
        }
    }
    updateTimestamp(); // Chiama subito
    setInterval(updateTimestamp, 60000); // Aggiorna ogni minuto

    // --- CONTACT FORM SUBMISSION (SIMULATED) ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Qui potresti aggiungere una vera logica di invio con Fetch API, ecc.
            alert('Messaggio inviato (simulazione)! Grazie per avermi contattato, Francesco.');
            contactForm.reset(); // Resetta i campi del form
        });
    }

    console.log("Portfolio Reimagined JS Initialized");
});