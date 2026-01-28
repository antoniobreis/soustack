// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Auto-update current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Smooth scroll with header offset calculation for Safari/iOS compatibility
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignora links vazios

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Pega a altura real do header naquele momento
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // -20px de respiro extra

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Fechar o menu mobile se estiver aberto
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
});

// Cookie Consent Script
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    
    // Verificar se o usuário já aceitou os cookies
    if (!localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
    } else {
        cookieBanner.style.display = 'none';
    }
    
    // Ao clicar em "Aceitar"
    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.style.display = 'none';
    });
});

// Lightbox Gallery with Navigation
document.addEventListener('DOMContentLoaded', function() {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const portfolioImages = document.querySelectorAll('.portfolio-img');

    // Array de projetos
    const projects = [
        {
            src: 'assets/gaby.png',
            title: 'Landing Page - Nutricionista Gabrielly Roncaglio',
            alt: 'Landing Page Mobile Gabrielly Roncaglio Nutricionista'
        },
        {
            src: 'assets/breis.png',
            title: 'Site Institucional - Breis Entregas',
            alt: 'Site Institucional Breis Entregas'
        }
    ];

    let currentIndex = 0;

    // Open lightbox when clicking on portfolio images
    portfolioImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentIndex = index;
            openLightbox(currentIndex);
        });
    });

    function openLightbox(index) {
        const project = projects[index];
        lightboxImg.src = project.src;
        lightboxImg.alt = project.alt;
        lightboxTitle.textContent = project.title;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add touch swipe support
        addTouchSupport();
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxImg.alt = '';
            lightboxTitle.textContent = '';
        }, 300);
    }

    function navigateProject(direction) {
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % projects.length; // Loop infinito
        } else {
            currentIndex = (currentIndex - 1 + projects.length) % projects.length; // Loop infinito
        }
        
        const project = projects[currentIndex];
        lightboxImg.src = project.src;
        lightboxImg.alt = project.alt;
        lightboxTitle.textContent = project.title;
    }

    // Close lightbox when clicking on X button
    lightboxClose.addEventListener('click', closeLightbox);

    // Close lightbox when clicking on background
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Navigation buttons
    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateProject('prev');
    });

    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateProject('next');
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightboxModal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateProject('prev');
                break;
            case 'ArrowRight':
                navigateProject('next');
                break;
        }
    });

    // Touch swipe support for mobile
    function addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        lightboxModal.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxModal.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next project
                    navigateProject('next');
                } else {
                    // Swipe right - previous project
                    navigateProject('prev');
                }
            }
        }
    }
});
