    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    // Mobile Menu Functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    navOverlay.addEventListener('click', toggleMobileMenu);

    // Navigation Scroll and Active State
    const sections = document.querySelectorAll('section');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const mainNav = document.getElementById('mainNav');

    // Smooth scrolling for navigation links
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    toggleMobileMenu();
                }
                
                // Smooth scroll to section
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        let current = '';
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Navbar background on scroll
        if (window.scrollY > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }

    // Scroll event listener
    window.addEventListener('scroll', updateActiveNavLink);

    // Slider functionality
    document.addEventListener('DOMContentLoaded', () => {
        const sliderWrapper = document.querySelector('.slider-wrapper');
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.dots-container');
        const autoPlayBtn = document.querySelector('.auto-play-btn');
        const autoPlayIcon = autoPlayBtn.querySelector('i');
        
        let currentIndex = 0;
        let slideInterval;
        let isPlaying = true;
        const slideCount = slides.length;
        const autoSlideDelay = 5000; // 5 seconds
        
        // Initialize dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.dot');
        
        // Update slider position
        function updateSlider() {
            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active slide and dot
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentIndex);
            });
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Go to specific slide
        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
            resetAutoSlide();
        }
        
        // Next slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slideCount;
            updateSlider();
            resetAutoSlide();
        }
        
        // Previous slide
        function prevSlide() {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateSlider();
            resetAutoSlide();
        }
        
        // Auto slide functionality
        function startAutoSlide() {
            if (isPlaying) {
                slideInterval = setInterval(nextSlide, autoSlideDelay);
                autoPlayIcon.classList.remove('fa-play');
                autoPlayIcon.classList.add('fa-pause');
            }
        }
        
        function stopAutoSlide() {
            clearInterval(slideInterval);
            autoPlayIcon.classList.remove('fa-pause');
            autoPlayIcon.classList.add('fa-play');
        }
        
        function resetAutoSlide() {
            if (isPlaying) {
                clearInterval(slideInterval);
                startAutoSlide();
            }
        }
        
        function toggleAutoPlay() {
            isPlaying = !isPlaying;
            if (isPlaying) {
                startAutoSlide();
            } else {
                stopAutoSlide();
            }
        }
        
        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        autoPlayBtn.addEventListener('click', toggleAutoPlay);
        
        // Touch support with better detection
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50;
        
        sliderWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        sliderWrapper.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        sliderWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === ' ') {
                e.preventDefault();
                toggleAutoPlay();
            }
        });
        
        // Initialize
        updateSlider();
        startAutoSlide();
        
        // Pause auto slide on hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', () => {
            if (isPlaying) startAutoSlide();
        });
        
        // Handle image loading
        const images = document.querySelectorAll('.slide img, .gallery-item img');
        images.forEach(img => {
            // Add loading state
            img.addEventListener('load', function() {
                this.parentElement.classList.remove('loading');
            });
            
            img.addEventListener('error', function() {
                console.warn('Image failed to load:', this.src);
                this.parentElement.classList.add('loading');
                // Create error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'image-error';
                errorMsg.innerHTML = `
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>Image not found: ${this.alt}</p>
                    <p style="font-size: 0.8rem; margin-top: 5px;">Check images folder</p>
                `;
                this.parentElement.appendChild(errorMsg);
            });
        });
        
        // Preload images for better performance
        function preloadImages() {
            images.forEach(img => {
                const newImg = new Image();
                newImg.src = img.src;
            });
        }
        
        // Start preloading
        preloadImages();

        // Button functionality
        const serviceButtons = document.querySelectorAll('.service-btn, .nav-cta');
        serviceButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert('Thank you for your interest in Arts & Visuals Co.! We will contact you shortly to discuss your photography needs.');
            });
        });

        // Form submission
        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            });
        }

        // Magnetic card effect
        const featureCards = document.querySelectorAll('.feature-card, .pricing-card');
        
        featureCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleY = (x - centerX) / 25;
                const angleX = (centerY - y) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
            });
        });
    });