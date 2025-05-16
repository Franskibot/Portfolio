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
    const themeToggle = document.getElementById('theme-toggle');

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

        // --- Imposta le larghezze delle barre di progresso ---
        const progressBars = document.querySelectorAll('.skill-progress-fill');
        progressBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width;
            }, 500); // Piccolo ritardo per garantire che l'animazione funzioni
        });
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

    // --- MARQUEE DRAG SCROLLING WITH INERTIA ---
    const marqueeElement = document.querySelector('.certifications-marquee');
    const marqueeContent = document.querySelector('.marquee-content');
    
    if (marqueeElement && marqueeContent) {
        let isDragging = false;
        let startX;
        let scrollLeft;
        let velocity = 0;
        let animationFrame;
        let lastPageX;
        let lastTimestamp = 0;
        
        // Clona il contenuto per creare l'effetto infinito
        marqueeContent.innerHTML += marqueeContent.innerHTML;
        
        // Funzione per gestire l'inerzia
        function handleInertia() {
            if (Math.abs(velocity) > 0.5) {
                // Applica la resistenza/attrito per rallentare gradualmente
                velocity *= 0.95;
                
                // Aggiorna la posizione in base alla velocità
                marqueeContent.style.transform = `translateX(${scrollLeft}px)`;
                scrollLeft += velocity;
                
                // Logica per scrolling infinito
                const contentWidth = marqueeContent.offsetWidth / 2;
                if (scrollLeft < -contentWidth) {
                    scrollLeft += contentWidth;
                } else if (scrollLeft > 0) {
                    scrollLeft -= contentWidth;
                }
                
                animationFrame = requestAnimationFrame(handleInertia);
            } else {
                cancelAnimationFrame(animationFrame);
            }
        }
        
        // Mouse/Touch Down
        marqueeElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - marqueeContent.offsetLeft;
            scrollLeft = parseInt(marqueeContent.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
            lastPageX = e.pageX;
            lastTimestamp = Date.now();
            velocity = 0;
            
            // Ferma qualsiasi animazione di inerzia in corso
            cancelAnimationFrame(animationFrame);
            
            // Cambia stile durante il drag
            marqueeElement.style.cursor = 'grabbing';
        });
        
        // Mouse/Touch Move
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const x = e.pageX - marqueeContent.offsetLeft;
            const walk = (x - startX);
            
            // Calcola la velocità in base al tempo trascorso e alla distanza
            const now = Date.now();
            const dt = now - lastTimestamp;
            if (dt > 0) {
                const dx = e.pageX - lastPageX;
                velocity = dx / dt * 15; // Moltiplica per un fattore per aumentare l'effetto
            }
            
            lastTimestamp = now;
            lastPageX = e.pageX;
            
            // Aggiorna la posizione
            scrollLeft = scrollLeft + walk;
            marqueeContent.style.transform = `translateX(${scrollLeft}px)`;
            startX = x;
        });
        
        // Mouse/Touch Up / Cancel
        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                marqueeElement.style.cursor = 'grab';
                
                // Avvia l'animazione di inerzia
                animationFrame = requestAnimationFrame(handleInertia);
            }
        });
        
        window.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                marqueeElement.style.cursor = 'grab';
                
                // Avvia l'animazione di inerzia
                animationFrame = requestAnimationFrame(handleInertia);
            }
        });
        
        // Supporto per dispositivi touch
        marqueeElement.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            isDragging = true;
            startX = touch.pageX - marqueeContent.offsetLeft;
            scrollLeft = parseInt(marqueeContent.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
            lastPageX = touch.pageX;
            lastTimestamp = Date.now();
            velocity = 0;
            
            // Ferma qualsiasi animazione di inerzia in corso
            cancelAnimationFrame(animationFrame);
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const x = touch.pageX - marqueeContent.offsetLeft;
            const walk = (x - startX);
            
            // Calcola la velocità
            const now = Date.now();
            const dt = now - lastTimestamp;
            if (dt > 0) {
                const dx = touch.pageX - lastPageX;
                velocity = dx / dt * 15;
            }
            
            lastTimestamp = now;
            lastPageX = touch.pageX;
            
            scrollLeft = scrollLeft + walk;
            marqueeContent.style.transform = `translateX(${scrollLeft}px)`;
            startX = x;
        });
        
        window.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                
                // Avvia l'animazione di inerzia
                animationFrame = requestAnimationFrame(handleInertia);
            }
        });
    }

    // Inizializziamo un'animazione automatica di scorrimento
    let autoScrollSpeed = -1; // Velocità negativa = scorrimento verso sinistra
    let isAutoScrolling = true;

    function startAutoScroll() {
        function autoScroll() {
            if (!isDragging && isAutoScrolling) {
                scrollLeft += autoScrollSpeed;
                marqueeContent.style.transform = `translateX(${scrollLeft}px)`;
                
                // Logica per scrolling infinito
                const contentWidth = marqueeContent.offsetWidth / 2;
                if (scrollLeft < -contentWidth) {
                    scrollLeft += contentWidth;
                } else if (scrollLeft > 0) {
                    scrollLeft -= contentWidth;
                }
                
                requestAnimationFrame(autoScroll);
            }
        }
        
        requestAnimationFrame(autoScroll);
    }

    // Inizia lo scorrimento automatico
    startAutoScroll();

    // Interrompi lo scorrimento automatico quando l'utente interagisce
    marqueeElement.addEventListener('mouseenter', () => {
        isAutoScrolling = false;
    });

    // Ripristina lo scorrimento automatico quando l'utente smette di interagire
    marqueeElement.addEventListener('mouseleave', () => {
        // Ritarda leggermente per permettere all'inerzia di completarsi
        setTimeout(() => {
            if (!isDragging) {
                isAutoScrolling = true;
                startAutoScroll();
            }
        }, 1000);
    });

    // --- THEME TOGGLE ---
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-theme');
            // Salva la preferenza dell'utente
            const currentTheme = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
        });
        
        // Controlla se c'è una preferenza salvata
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.add('light-theme');
        }
    }

    console.log("Portfolio Reimagined JS Initialized");
});