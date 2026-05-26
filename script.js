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
    
    // ========== SMOOTH NAVIGATION WITHOUT URL HASH ==========
    // Intercepta todos os links com # para navegação suave sem alterar URL
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Impede o comportamento padrão de adicionar #
            
            // Remove o # do href para obter o ID da seção
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Rola suavemente até a seção
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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

// ========== PORTFOLIO CAROUSEL CENTER MODE ==========
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    // Verificar se existem itens
    if (carouselItems.length === 0) return;
    
    // Configurações
    let currentIndex = 0;
    const totalItems = carouselItems.length;
    let autoPlayTimer = null;
    let isAutoPlayActive = false;
    
    /**
     * Atualiza posições dos itens
     */
    function updateCarouselPositions() {
        carouselItems.forEach((item, index) => {
            // Remove todas as classes
            item.classList.remove('active', 'prev', 'next', 'hidden');
            
            // Adiciona classes baseadas na posição
            if (index === currentIndex) {
                item.classList.add('active');
            } else if (index === getPrevIndex()) {
                item.classList.add('prev');
            } else if (index === getNextIndex()) {
                item.classList.add('next');
            } else {
                // Itens que não são active, prev ou next ficam invisíveis
                item.classList.add('hidden');
            }
        });
    }
    
    /**
     * Obtém índice anterior
     */
    function getPrevIndex() {
        return (currentIndex - 1 + totalItems) % totalItems;
    }
    
    /**
     * Obtém próximo índice
     */
    function getNextIndex() {
        return (currentIndex + 1) % totalItems;
    }
    
    /**
     * Avança para próximo slide
     */
    function nextSlide() {
        currentIndex = getNextIndex();
        updateCarouselPositions();
    }
    
    /**
     * Inicia autoplay
     */
    function startAutoPlay() {
        if (!isAutoPlayActive) {
            isAutoPlayActive = true;
            autoPlayTimer = setInterval(nextSlide, 5000);
        }
    }
    
    /**
     * Para autoplay
     */
    function stopAutoPlay() {
        if (isAutoPlayActive && autoPlayTimer) {
            isAutoPlayActive = false;
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }
    
    /**
     * Reseta autoplay
     */
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Event listeners
    const carousel = document.querySelector('.portfolio-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    // Pausar no hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Navegação com botões
    prevBtn.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        currentIndex = prevIndex;
        updateCarouselPositions();
        resetAutoPlay();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    // Navegação manual com setas do teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            nextSlide(); // Vai para o anterior (próximo no sentido anti-horário)
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
            currentIndex = prevIndex;
            updateCarouselPositions();
            resetAutoPlay();
        }
    });
    
    // Click nos itens para lightbox
    carouselItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    // Inicialização
    updateCarouselPositions();
    
    // Iniciar auto-play após 3 segundos para evitar bug inicial
    setTimeout(() => {
        startAutoPlay();
    }, 3000);
    
    // Cleanup
    window.addEventListener('beforeunload', stopAutoPlay);
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
            src: 'assets/nutri-gaby-roncaglio.png',
            title: 'One Page - Nutricionista Gabrielly Roncaglio',
            alt: 'One Page Mobile Gabrielly Roncaglio Nutricionista'
        },
        {
            src: 'assets/nutri-ana-caroline.png',
            title: 'One Page - Nutricionista Ana Caroline',
            alt: 'One Page Ana Caroline Nutricionista'
        },
        {
            src: 'assets/breis-entregas.png',
            title: 'Site Institucional - Breis Entregas',
            alt: 'Site Institucional Mobile Breis Entregas'
        },
        {
            src: 'assets/rotopecas-abrasivos.png',
            title: 'Site Institucional - Rotopeças Abrasivos',
            alt: 'Site Institucional Rotopeças Abrasivos'
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
