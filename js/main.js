// Cape Sports Adventures - Enhanced JavaScript for Modern Homepage

// DOM Elements
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');
const contactForm = document.querySelector('.contact__form');

// Carousel Elements
const carousel = document.querySelector('.carousel');
const carouselTrack = document.querySelector('.carousel__track');
const carouselSlides = document.querySelectorAll('.carousel__slide');
const prevBtn = document.querySelector('.carousel__btn--prev');
const nextBtn = document.querySelector('.carousel__btn--next');
const indicators = document.querySelectorAll('.carousel__indicator');

// Accessibility Elements
const accessibilityBtns = document.querySelectorAll('.accessibility__btn');

// State Management
let currentSlide = 0;
let isAnimating = false;
let autoSlideTimer;
let isCarouselPaused = false;
let carouselDirection = 1; // 1 for forward, -1 for reverse - pendulum fix

// Mobile Navigation Functions
function toggleMobileNav() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        navToggle.setAttribute('aria-expanded', 'true');
    } else {
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
    }
}

function closeMobileNav() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-expanded', 'false');
}

// Header scroll effect with sticky functionality
function handleHeaderScroll() {
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
}

// Active navigation link highlighting (only for home page with sections)
function updateActiveNavLink() {
    // Only run on home page (index.html) - don't interfere with multi-page navigation
    if (window.location.pathname.includes('pages/')) {
        return; // Skip this function on subpages
    }
    
    const currentSection = getCurrentSection();
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Only update links that start with # (section links on home page)
        if (href.startsWith('#')) {
            link.classList.remove('active');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        }
    });
}

// Get current section based on scroll position
function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        
        if (scrollPosition >= sectionTop) {
            return section.id;
        }
    }
    
    return 'home';
}

// Smooth scroll for navigation links
function handleSmoothScroll(e) {
    const href = this.getAttribute('href');
    
    if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            closeMobileNav();
        }
    }
}

// Carousel Functions
function updateCarousel(slideIndex) {
    if (!carouselTrack || isAnimating) return;
    
    isAnimating = true;
    const slideWidth = carouselSlides[0].offsetWidth;
    const slidesToShow = getSlidesToShow();
    const maxSlide = Math.max(0, carouselSlides.length - slidesToShow);
    
    // Ensure slide index is within bounds
    currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
    
    // Calculate transform
    const translateX = -(currentSlide * slideWidth);
    carouselTrack.style.transform = `translateX(${translateX}px)`;
    
    // Update indicators
    updateIndicators();
    
    // Update button states
    updateCarouselButtons();
    
    // Reset animation flag after transition
    setTimeout(() => {
        isAnimating = false;
    }, 350);
}

function getSlidesToShow() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.carousel__indicator');
    
    indicators.forEach((indicator, index) => {
        const isActive = index === currentSlide;
        indicator.classList.toggle('carousel__indicator--active', isActive);
        indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
}

function updateCarouselButtons() {
    if (!prevBtn || !nextBtn) return;
    
    const slidesToShow = getSlidesToShow();
    const maxSlide = Math.max(0, carouselSlides.length - slidesToShow);
    
    // Update button disabled states
    prevBtn.disabled = currentSlide <= 0;
    nextBtn.disabled = currentSlide >= maxSlide;
    
    // Update ARIA labels
    prevBtn.setAttribute('aria-disabled', currentSlide <= 0 ? 'true' : 'false');
    nextBtn.setAttribute('aria-disabled', currentSlide >= maxSlide ? 'true' : 'false');
}

function nextSlide() {
    const slidesToShow = getSlidesToShow();
    const maxSlide = Math.max(0, carouselSlides.length - slidesToShow);
    
    if (carouselDirection === 1) {
        // Moving forward
        if (currentSlide < maxSlide) {
            updateCarousel(currentSlide + 1);
        } else {
            // Reached the end, reverse direction
            carouselDirection = -1;
            updateCarousel(currentSlide - 1);
        }
    } else {
        // Moving backward
        if (currentSlide > 0) {
            updateCarousel(currentSlide - 1);
        } else {
            // Reached the beginning, reverse direction
            carouselDirection = 1;
            updateCarousel(currentSlide + 1);
        }
    }
}

function prevSlide() {
    const slidesToShow = getSlidesToShow();
    const maxSlide = Math.max(0, carouselSlides.length - slidesToShow);
    
    if (currentSlide > 0) {
        carouselDirection = -1; // Set direction to backward when manually going previous
        updateCarousel(currentSlide - 1);
    } else {
        // Loop to end (keep original manual behavior for prev button)
        carouselDirection = -1;
        updateCarousel(maxSlide);
    }
}

function goToSlide(slideIndex) {
    // Update direction based on where we're going
    if (slideIndex > currentSlide) {
        carouselDirection = 1; // Moving forward
    } else if (slideIndex < currentSlide) {
        carouselDirection = -1; // Moving backward
    }
    updateCarousel(slideIndex);
}

// Manual next button (override auto behavior for manual control)
function manualNextSlide() {
    const slidesToShow = getSlidesToShow();
    const maxSlide = Math.max(0, carouselSlides.length - slidesToShow);
    
    if (currentSlide < maxSlide) {
        carouselDirection = 1; // Set direction to forward when manually going next
        updateCarousel(currentSlide + 1);
    } else {
        // Loop to beginning (keep original manual behavior for next button)
        carouselDirection = 1;
        updateCarousel(0);
    }
}

// Remove goToView function as we're going back to slide-based navigation

// Auto-slide functionality
function startAutoSlide() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Respect user's motion preferences
    }
    
    autoSlideTimer = setInterval(() => {
        if (!document.hidden && !isAnimating && !isCarouselPaused) {
            // Simple pendulum behavior - force it to work with total slides
            const maxSlide = carouselSlides.length - 1; // Use total slides instead of visible calculation
            
            if (carouselDirection === 1) {
                // Moving forward
                if (currentSlide < maxSlide) {
                    updateCarousel(currentSlide + 1);
                } else {
                    // Reached the end, reverse direction
                    carouselDirection = -1;
                    updateCarousel(currentSlide - 1);
                }
            } else {
                // Moving backward
                if (currentSlide > 0) {
                    updateCarousel(currentSlide - 1);
                } else {
                    // Reached the beginning, reverse direction
                    carouselDirection = 1;
                    updateCarousel(currentSlide + 1);
                }
            }
        }
    }, 3600); // 3.6 second intervals
}

function stopAutoSlide() {
    clearInterval(autoSlideTimer);
}

// Toggle carousel pause state
function toggleCarouselPause() {
    isCarouselPaused = !isCarouselPaused;
    updateCarouselPauseIndicator();
    
    if (isCarouselPaused) {
        announceToScreenReader('Carousel paused');
    } else {
        announceToScreenReader('Carousel resumed');
    }
}

// Update visual pause indicator
function updateCarouselPauseIndicator() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    let pauseIndicator = carousel.querySelector('.carousel__pause-indicator');
    
    if (isCarouselPaused) {
        if (!pauseIndicator) {
            pauseIndicator = document.createElement('div');
            pauseIndicator.className = 'carousel__pause-indicator';
            pauseIndicator.innerHTML = `
                <div class="carousel__pause-content">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                    <span>Paused</span>
                </div>
            `;
            carousel.appendChild(pauseIndicator);
        }
        pauseIndicator.style.display = 'flex';
    } else {
        if (pauseIndicator) {
            pauseIndicator.style.display = 'none';
        }
    }
}

// Pause auto-slide on hover or focus
function pauseCarouselOnInteraction() {
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        carousel.addEventListener('focusin', stopAutoSlide);
        carousel.addEventListener('focusout', startAutoSlide);
        
        // Add click listener for manual pause/resume
        carousel.addEventListener('click', (e) => {
            // Only toggle if not clicking on a link or button
            if (!e.target.closest('a, button, .carousel__btn, .carousel__indicator')) {
                toggleCarouselPause();
            }
        });
    }
}

// Contact form handling
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    // Validate form data
    const validation = validateFormData(data);
    if (!validation.isValid) {
        showNotification(validation.message, 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handler)
    setTimeout(() => {
        showNotification('Thank you for your inquiry! We\'ll get back to you within 24 hours.', 'success');
        this.reset();
        
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Form validation
function validateFormData(data) {
    if (!data.name.trim()) {
        return { isValid: false, message: 'Please enter your name.' };
    }
    
    if (!data.email.trim()) {
        return { isValid: false, message: 'Please enter your email address.' };
    }
    
    if (!isValidEmail(data.email)) {
        return { isValid: false, message: 'Please enter a valid email address.' };
    }
    
    if (!data.service) {
        return { isValid: false, message: 'Please select a service of interest.' };
    }
    
    if (!data.message.trim()) {
        return { isValid: false, message: 'Please enter a message.' };
    }
    
    if (data.message.trim().length < 10) {
        return { isValid: false, message: 'Please provide a more detailed message (at least 10 characters).' };
    }
    
    return { isValid: true };
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close" aria-label="Close notification">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    const autoRemoveTimer = setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification__close');
    closeButton.addEventListener('click', () => {
        clearTimeout(autoRemoveTimer);
        notification.remove();
    });
    
    // Keyboard support for close button
    closeButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            clearTimeout(autoRemoveTimer);
            notification.remove();
        }
    });
}

// Accessibility Functions
function handleAccessibilityToggle(e) {
    const accessibilityType = this.getAttribute('data-accessibility');
    
    switch (accessibilityType) {
        case 'font-size':
            toggleLargeText();
            break;
        case 'contrast':
            toggleHighContrast();
            break;
        case 'motion':
            toggleReducedMotion();
            break;
    }
    
    // Update button state
    this.classList.toggle('active');
}

function toggleLargeText() {
    document.body.classList.toggle('large-text');
    const isActive = document.body.classList.contains('large-text');
    
    // Store preference
    localStorage.setItem('large-text', isActive);
    
    showNotification(
        isActive ? 'Large text enabled' : 'Large text disabled',
        'info'
    );
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isActive = document.body.classList.contains('high-contrast');
    
    // Store preference
    localStorage.setItem('high-contrast', isActive);
    
    showNotification(
        isActive ? 'High contrast enabled' : 'High contrast disabled',
        'info'
    );
}

function toggleReducedMotion() {
    document.body.classList.toggle('reduced-motion');
    const isActive = document.body.classList.contains('reduced-motion');
    
    // Store preference
    localStorage.setItem('reduced-motion', isActive);
    
    if (isActive) {
        stopAutoSlide();
        showNotification('Reduced motion enabled', 'info');
    } else {
        startAutoSlide();
        showNotification('Reduced motion disabled', 'info');
    }
}

// Load accessibility preferences
function loadAccessibilityPreferences() {
    if (localStorage.getItem('large-text') === 'true') {
        document.body.classList.add('large-text');
        const fontBtn = document.querySelector('[data-accessibility="font-size"]');
        if (fontBtn) fontBtn.classList.add('active');
    }
    
    if (localStorage.getItem('high-contrast') === 'true') {
        document.body.classList.add('high-contrast');
        const contrastBtn = document.querySelector('[data-accessibility="contrast"]');
        if (contrastBtn) contrastBtn.classList.add('active');
    }
    
    if (localStorage.getItem('reduced-motion') === 'true') {
        document.body.classList.add('reduced-motion');
        const motionBtn = document.querySelector('[data-accessibility="motion"]');
        if (motionBtn) motionBtn.classList.add('active');
    }
}

// Intersection Observer for animations
function initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Skip animations for users who prefer reduced motion
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-tile, .experience-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Enhanced keyboard navigation support
function handleKeyboardNavigation(e) {
    // Escape key closes mobile menu and modals
    if (e.key === 'Escape') {
        if (navMenu.classList.contains('active')) {
            closeMobileNav();
            navToggle.focus();
        }
        
        // Close any open notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
    
    // Tab navigation for mobile menu
    if (navMenu.classList.contains('active') && (e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        const focusableElements = navMenu.querySelectorAll('.nav__link');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
        
        // Arrow key navigation in mobile menu
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % focusableElements.length;
            } else {
                nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
            }
            
            focusableElements[nextIndex].focus();
        }
    }
    
    // Arrow key navigation for carousel (when focused)
    if (carousel && carousel.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    }
}

// High contrast toggle functionality
function initializeAccessibilityFeatures() {
    // Create accessibility toggle button
    const accessibilityToggle = document.createElement('button');
    accessibilityToggle.className = 'accessibility-toggle';
    accessibilityToggle.setAttribute('aria-label', 'Toggle high contrast mode');
    accessibilityToggle.setAttribute('title', 'Toggle high contrast mode');
    accessibilityToggle.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10V2z"/>
        </svg>
        <span class="sr-only">High Contrast</span>
    `;
    
    // Add toggle to navigation
    const navContainer = document.querySelector('.nav__container');
    if (navContainer) {
        navContainer.appendChild(accessibilityToggle);
    }
    
    // Toggle high contrast mode
    accessibilityToggle.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const isActive = document.body.classList.contains('high-contrast');
        
        // Save preference
        localStorage.setItem('high-contrast', isActive);
        
        // Update ARIA label
        accessibilityToggle.setAttribute('aria-label', 
            isActive ? 'Disable high contrast mode' : 'Enable high contrast mode');
        
        // Announce change to screen readers
        announceToScreenReader(isActive ? 'High contrast mode enabled' : 'High contrast mode disabled');
    });
    
    // Load saved preference
    if (localStorage.getItem('high-contrast') === 'true') {
        document.body.classList.add('high-contrast');
        accessibilityToggle.setAttribute('aria-label', 'Disable high contrast mode');
    }
}

// Screen reader announcement function
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region') || createLiveRegion();
    liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 1000);
}

// Create ARIA live region for screen reader announcements
function createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.className = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
    return liveRegion;
}

// Enhanced mobile navigation with accessibility
function toggleMobileNavAccessible() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    
    toggleMobileNav();
    
    // Focus management
    if (!isExpanded) {
        // Menu was opened, focus first link
        setTimeout(() => {
            const firstLink = navMenu.querySelector('.nav__link');
            if (firstLink) firstLink.focus();
        }, 300);
    }
    
    // Announce state change
    announceToScreenReader(isExpanded ? 'Menu closed' : 'Menu opened');
}

// Skip to main content functionality
function initializeSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure main content has proper ID
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
        main.setAttribute('tabindex', '-1');
    }
    
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Window resize handler
function handleWindowResize() {
    // Update carousel on resize
    if (carouselTrack) {
        updateCarousel(currentSlide);
    }
    
    // Close mobile menu on desktop
    if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
        closeMobileNav();
    }
}

// Page visibility change handler
function handleVisibilityChange() {
    if (document.hidden) {
        stopAutoSlide();
    } else {
        if (!document.body.classList.contains('reduced-motion')) {
            startAutoSlide();
        }
    }
}

// Dynamic indicator generation
function generateCarouselIndicators() {
    const indicatorsContainer = document.querySelector('.carousel__indicators');
    if (!indicatorsContainer || !carouselSlides.length) return;
    
    const slidesToShow = getSlidesToShow();
    const totalSlides = carouselSlides.length;
    const maxSlide = Math.max(0, totalSlides - slidesToShow);
    const maxViews = maxSlide + 1; // Number of possible slide positions
    
    // Clear existing indicators
    indicatorsContainer.innerHTML = '';
    
    // Generate dynamic indicators
    for (let i = 0; i < maxViews; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'carousel__indicator';
        if (i === 0) indicator.classList.add('carousel__indicator--active');
        indicator.setAttribute('data-slide-to', i);
        indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load accessibility preferences first
    loadAccessibilityPreferences();
    
    // Initialize accessibility features first
    initializeSkipLink();
    initializeAccessibilityFeatures();
    createLiveRegion();
    
    // Navigation event listeners with accessibility
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNavAccessible);
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'nav-menu');
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    }
    
    // Add proper ARIA attributes to nav menu
    if (navMenu) {
        navMenu.setAttribute('id', 'nav-menu');
        navMenu.setAttribute('role', 'navigation');
        navMenu.setAttribute('aria-label', 'Main navigation');
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
    
    // Carousel event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', manualNextSlide);
    }
    
    // Generate dynamic indicators
    generateCarouselIndicators();
    
    // Re-generate indicators on window resize to handle responsive changes
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            generateCarouselIndicators();
            updateCarousel(currentSlide);
        }, 250);
    });
    
    // Contact form event listener
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Accessibility button event listeners
    accessibilityBtns.forEach(btn => {
        btn.addEventListener('click', handleAccessibilityToggle);
    });
    
    // Global event listeners
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        updateActiveNavLink();
    });
    
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('keydown', handleKeyboardNavigation);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && 
            !navToggle.contains(e.target) && 
            navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    });
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize carousel
    if (carouselTrack) {
        updateCarousel(0);
        pauseCarouselOnInteraction();
        
        // Start auto-slide if motion is not reduced
        if (!document.body.classList.contains('reduced-motion')) {
            startAutoSlide();
        }
    }
    
    // Initialize sports tours functionality
    initializeSportsTours();
    
    // Initialize itinerary builder
    itineraryBuilder = new ItineraryBuilder();
    
    // Initial calls
    handleHeaderScroll();
    updateActiveNavLink();
});

// CSS for notifications and animations (injected via JavaScript)
const dynamicStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1100;
    max-width: 400px;
    border-radius: 0.75rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.notification__content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    gap: 0.75rem;
}

.notification--success {
    background-color: #059669;
    color: white;
}

.notification--error {
    background-color: #dc2626;
    color: white;
}

.notification--info {
    background-color: #2563eb;
    color: white;
}

.notification__message {
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.5;
}

.notification__close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.375rem;
    transition: background-color 0.15s ease-in-out;
    flex-shrink: 0;
}

.notification__close:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.notification__close svg {
    width: 1rem;
    height: 1rem;
}

/* Animation classes for scroll animations */
.feature-tile,
.experience-card {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.feature-tile.animate-in,
.experience-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

/* Stagger animation delays */
.features__grid .feature-tile:nth-child(1).animate-in { transition-delay: 0.1s; }
.features__grid .feature-tile:nth-child(2).animate-in { transition-delay: 0.2s; }
.features__grid .feature-tile:nth-child(3).animate-in { transition-delay: 0.3s; }
.features__grid .feature-tile:nth-child(4).animate-in { transition-delay: 0.4s; }

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
    .feature-tile,
    .experience-card {
        opacity: 1;
        transform: none;
        transition: none;
    }
    
    .notification {
        animation: none;
    }
}

/* Reduced motion class for manual toggle */
body.reduced-motion .feature-tile,
body.reduced-motion .experience-card {
    opacity: 1;
    transform: none;
    transition: none;
}

body.reduced-motion .notification {
    animation: none;
}

/* Focus improvements */
.carousel__btn:focus,
.carousel__indicator:focus,
.accessibility__btn:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

/* Mobile notification adjustments */
@media (max-width: 640px) {
    .notification {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
}

/* Carousel pause indicator */
.carousel__pause-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    display: none;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.3s ease-out;
}

.carousel__pause-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.carousel__pause-indicator svg {
    width: 1rem;
    height: 1rem;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
`;

// Inject dynamic styles
if (!document.getElementById('dynamic-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'dynamic-styles';
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
}

// =============================================
// Sports Tours Tab Functionality
// =============================================

// Tab Elements
const tabButtons = document.querySelectorAll('.tab__btn');
const tabContents = document.querySelectorAll('.tab__content');

// Tab switching function
function switchTab(targetTab) {
    // First fade out all content
    tabContents.forEach(content => {
        content.style.opacity = '0';
    });
    
    // Wait for fade out, then switch content
    setTimeout(() => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => {
            btn.classList.remove('tab__btn--active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('tab__content--active');
        });
        
        // Add active class to clicked button and content
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        const activeContent = document.getElementById(`${targetTab}-panel`);
        
        if (activeButton && activeContent) {
            activeButton.classList.add('tab__btn--active');
            activeButton.setAttribute('aria-selected', 'true');
            activeContent.classList.add('tab__content--active');
            
            // Remove inline opacity to let CSS transition handle it
            activeContent.style.opacity = '';
            
            // Scroll to tabs section for mobile
            if (window.innerWidth <= 768) {
                document.querySelector('.sports-tabs').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }
    }, 150); // Wait for fade out to complete
}

// Handle tab button clicks
function handleTabClick(e) {
    e.preventDefault();
    const targetTab = this.getAttribute('data-tab');
    switchTab(targetTab);
    
    // Update URL hash without scrolling
    if (history.replaceState) {
        history.replaceState(null, null, `#${targetTab}`);
    }
}

// Handle keyboard navigation for tabs
function handleTabKeydown(e) {
    let targetTab = null;
    const currentTab = this.getAttribute('data-tab');
    const tabs = ['rugby', 'cricket', 'football', 'hockey'];
    const currentIndex = tabs.indexOf(currentTab);
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            targetTab = tabs[currentIndex === 0 ? tabs.length - 1 : currentIndex - 1];
            break;
        case 'ArrowRight':
            e.preventDefault();
            targetTab = tabs[currentIndex === tabs.length - 1 ? 0 : currentIndex + 1];
            break;
        case 'Home':
            e.preventDefault();
            targetTab = tabs[0];
            break;
        case 'End':
            e.preventDefault();
            targetTab = tabs[tabs.length - 1];
            break;
    }
    
    if (targetTab) {
        switchTab(targetTab);
        document.querySelector(`[data-tab="${targetTab}"]`).focus();
    }
}

// Initialize tabs functionality
function initializeTabs() {
    // Add event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
        button.addEventListener('keydown', handleTabKeydown);
    });
    
    // Check for hash in URL to activate specific tab
    const hash = window.location.hash.substring(1);
    const validTabs = ['rugby', 'cricket', 'football', 'hockey'];
    
    if (hash && validTabs.includes(hash)) {
        switchTab(hash);
    }
    
    // Handle browser back/forward with hash changes
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        if (newHash && validTabs.includes(newHash)) {
            switchTab(newHash);
        }
    });
    
    // Add ARIA attributes for accessibility
    tabButtons.forEach((button, index) => {
        const tabId = button.getAttribute('data-tab');
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', `${tabId}-panel`);
        button.setAttribute('id', `${tabId}-tab`);
        button.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
    
    tabContents.forEach(content => {
        content.setAttribute('role', 'tabpanel');
        const panelId = content.getAttribute('id');
        const tabId = panelId.replace('-panel', '-tab');
        content.setAttribute('aria-labelledby', tabId);
    });
}

// Enhanced smooth scrolling for sports tours page
function handleSportsToursScroll(e) {
    const href = this.getAttribute('href');
    
    // Handle tab navigation
    if (href.includes('#') && href.includes('sports-tours.html')) {
        const tabName = href.split('#')[1];
        const validTabs = ['rugby', 'cricket', 'football', 'hockey'];
        
        if (validTabs.includes(tabName)) {
            e.preventDefault();
            
            // If we're not on the sports tours page, navigate there first
            if (!window.location.pathname.includes('sports-tours.html')) {
                window.location.href = href;
                return;
            }
            
            // Otherwise, just switch the tab
            switchTab(tabName);
        }
    }
}

// Sports Tours Initialization
function initializeSportsTours() {
    // Initialize tabs if on sports tours page
    if (window.location.pathname.includes('sports-tours.html') || document.querySelector('.sports-tabs')) {
        initializeTabs();
    }
    
    // Add enhanced scroll handling for sports tours links
    const sportsToursLinks = document.querySelectorAll('a[href*="sports-tours.html"]');
    sportsToursLinks.forEach(link => {
        link.addEventListener('click', handleSportsToursScroll);
    });
}

// ================================================
// Itinerary Builder Form Functionality
// ================================================

class ItineraryBuilder {
    constructor() {
        this.form = document.getElementById('itineraryForm');
        this.basePrice = 0;
        this.groupMultiplier = 1;
        this.durationMultiplier = 1;
        this.seasonMultiplier = 1;
        this.addonsTotal = 0;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.updatePricing();
        this.setMinDate();
    }
    
    bindEvents() {
        // Sport type selection
        const sportType = this.form.querySelector('#sport-type');
        if (sportType) {
            sportType.addEventListener('change', () => this.handleSportTypeChange());
        }
        
        // Group size selection
        const groupSize = this.form.querySelector('#group-size');
        if (groupSize) {
            groupSize.addEventListener('change', () => this.handleGroupSizeChange());
        }
        
        // Duration selection
        const duration = this.form.querySelector('#duration');
        if (duration) {
            duration.addEventListener('change', () => this.handleDurationChange());
        }
        
        // Season preference
        const season = this.form.querySelector('#season-preference');
        if (season) {
            season.addEventListener('change', () => this.handleSeasonChange());
        }
        
        // Add-on checkboxes
        const addons = this.form.querySelectorAll('.addon-checkbox');
        addons.forEach(addon => {
            addon.addEventListener('change', () => this.handleAddonChange());
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Reset button
        const resetBtn = this.form.querySelector('#resetForm');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetForm());
        }
        
        // Real-time validation
        const requiredInputs = this.form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('change', () => this.validateForm());
        });
    }
    
    setMinDate() {
        const startDate = this.form.querySelector('#start-date');
        if (startDate) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            startDate.min = tomorrow.toISOString().split('T')[0];
        }
    }
    
    handleSportTypeChange() {
        const sportType = this.form.querySelector('#sport-type');
        const selectedOption = sportType.options[sportType.selectedIndex];
        
        if (selectedOption.value) {
            this.basePrice = parseInt(selectedOption.dataset.basePrice) || 0;
        } else {
            this.basePrice = 0;
        }
        
        this.updatePricing();
        this.validateForm();
    }
    
    handleGroupSizeChange() {
        const groupSize = this.form.querySelector('#group-size');
        const selectedOption = groupSize.options[groupSize.selectedIndex];
        
        if (selectedOption.value) {
            this.groupMultiplier = parseFloat(selectedOption.dataset.multiplier) || 1;
        } else {
            this.groupMultiplier = 1;
        }
        
        this.updatePricing();
        this.validateForm();
    }
    
    handleDurationChange() {
        const duration = this.form.querySelector('#duration');
        const selectedOption = duration.options[duration.selectedIndex];
        
        if (selectedOption.value) {
            this.durationMultiplier = parseFloat(selectedOption.dataset.multiplier) || 1;
        } else {
            this.durationMultiplier = 1;
        }
        
        this.updatePricing();
        this.validateForm();
    }
    
    handleSeasonChange() {
        const season = this.form.querySelector('#season-preference');
        const selectedOption = season.options[season.selectedIndex];
        
        if (selectedOption.value) {
            this.seasonMultiplier = parseFloat(selectedOption.dataset.multiplier) || 1;
        } else {
            this.seasonMultiplier = 1;
        }
        
        this.updatePricing();
    }
    
    handleAddonChange() {
        const checkedAddons = this.form.querySelectorAll('.addon-checkbox:checked');
        this.addonsTotal = 0;
        
        checkedAddons.forEach(addon => {
            this.addonsTotal += parseInt(addon.dataset.price) || 0;
        });
        
        this.updatePricing();
    }
    
    updatePricing() {
        const basePriceElement = document.getElementById('basePrice');
        const addonsPriceElement = document.getElementById('addonsPrice');
        const discountLineElement = document.getElementById('discountLine');
        const discountAmountElement = document.getElementById('discountAmount');
        const totalPriceElement = document.getElementById('totalPrice');
        
        if (!basePriceElement || !totalPriceElement) return;
        
        // Calculate base package price with multipliers
        const adjustedBasePrice = this.basePrice * this.durationMultiplier * this.seasonMultiplier;
        
        // Calculate discount (group multiplier less than 1 means discount)
        const discount = this.groupMultiplier < 1 ? 
            (adjustedBasePrice + this.addonsTotal) * (1 - this.groupMultiplier) : 0;
        
        // Calculate final total
        const finalTotal = (adjustedBasePrice + this.addonsTotal) * this.groupMultiplier;
        
        // Update display
        basePriceElement.textContent = `R${adjustedBasePrice.toLocaleString()}`;
        addonsPriceElement.textContent = `R${this.addonsTotal.toLocaleString()}`;
        totalPriceElement.textContent = `R${Math.round(finalTotal).toLocaleString()}`;
        
        // Show/hide discount line
        if (discount > 0 && discountLineElement && discountAmountElement) {
            discountLineElement.style.display = 'flex';
            discountAmountElement.textContent = `-R${Math.round(discount).toLocaleString()}`;
        } else if (discountLineElement) {
            discountLineElement.style.display = 'none';
        }
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
            }
        });
        
        const generateBtn = this.form.querySelector('#generateQuote');
        if (generateBtn) {
            generateBtn.disabled = !isValid;
            
            if (isValid) {
                generateBtn.classList.remove('btn--disabled');
            } else {
                generateBtn.classList.add('btn--disabled');
            }
        }
        
        return isValid;
    }
    
    resetForm() {
        // Reset form fields
        this.form.reset();
        
        // Reset internal state
        this.basePrice = 0;
        this.groupMultiplier = 1;
        this.durationMultiplier = 1;
        this.seasonMultiplier = 1;
        this.addonsTotal = 0;
        
        // Clear addon selections visually
        const addonItems = this.form.querySelectorAll('.addon-item');
        addonItems.forEach(item => {
            item.classList.remove('selected');
        });
        
        // Update pricing display
        this.updatePricing();
        this.validateForm();
        
        // Reset minimum date
        this.setMinDate();
        
        // Smooth scroll to top of form
        this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Announce reset to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = 'Itinerary form has been reset';
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showFormError('Please fill in all required fields before generating your quote.');
            return;
        }
        
        // Show loading state
        this.form.classList.add('loading');
        const generateBtn = this.form.querySelector('#generateQuote');
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = 'Generating Quote...';
        generateBtn.disabled = true;
        
        // Collect form data
        const formData = this.collectFormData();
        
        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Remove loading state
            this.form.classList.remove('loading');
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
            
            // Show success message and redirect to contact
            this.showSuccessMessage(formData);
        }, 2000);
    }
    
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {
            sportType: formData.get('sportType'),
            groupSize: formData.get('groupSize'),
            groupType: formData.get('groupType'),
            startDate: formData.get('startDate'),
            duration: formData.get('duration'),
            seasonPreference: formData.get('seasonPreference'),
            addons: formData.getAll('addons'),
            pricing: {
                basePrice: this.basePrice * this.durationMultiplier * this.seasonMultiplier,
                addonsTotal: this.addonsTotal,
                groupMultiplier: this.groupMultiplier,
                finalTotal: Math.round((this.basePrice * this.durationMultiplier * this.seasonMultiplier + this.addonsTotal) * this.groupMultiplier)
            }
        };
        
        return data;
    }
    
    showFormError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            background: #dc2626;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        
        // Insert at top of form
        this.form.insertBefore(errorDiv, this.form.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    showSuccessMessage(data) {
        // Create success modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 1rem;
        `;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;
        
        modal.innerHTML = `
            <div style="color: #1D4D2E; margin-bottom: 1rem;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
            </div>
            <h3 style="color: #1D4D2E; font-size: 1.5rem; margin-bottom: 1rem;">Quote Generated Successfully!</h3>
            <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.6;">
                Your custom itinerary quote for <strong>R${data.pricing.finalTotal.toLocaleString()}</strong> per person has been prepared. 
                You'll be redirected to complete your booking details.
            </p>
            <button id="continueBooking" style="
                background: #1D4D2E;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                font-size: 1rem;
            ">Continue to Booking</button>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Handle continue button
        const continueBtn = modal.querySelector('#continueBooking');
        continueBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            
            // Store quote data for contact form
            sessionStorage.setItem('itineraryQuote', JSON.stringify(data));
            
            // Scroll to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Pre-fill contact form if possible
            this.prefillContactForm(data);
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                continueBtn.click();
            }
        });
        
        // Focus trap and keyboard support
        modal.setAttribute('tabindex', '0');
        modal.focus();
    }
    
    prefillContactForm(data) {
        // Try to prefill the contact form with quote data
        setTimeout(() => {
            const serviceSelect = document.querySelector('#service');
            const messageTextarea = document.querySelector('#message');
            
            if (serviceSelect && data.sportType) {
                // Map sport type to service option
                const sportTypeMap = {
                    'rugby-tour': 'sports-tours',
                    'cricket-tour': 'sports-tours',
                    'football-tour': 'sports-tours',
                    'hockey-tour': 'sports-tours',
                    'championship-golf': 'golf',
                    'winelands-golf': 'golf',
                    'coastal-golf': 'golf',
                    'springbok-vip': 'fan-packages',
                    'sevens-weekend': 'fan-packages',
                    'cricket-experience': 'fan-packages',
                    'ultimate-adventure': 'adventure',
                    'adrenaline-special': 'adventure',
                    'cultural-adventure': 'adventure'
                };
                
                serviceSelect.value = sportTypeMap[data.sportType] || '';
            }
            
            if (messageTextarea) {
                const message = `I'm interested in booking the following itinerary:

Experience: ${data.sportType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
Group Size: ${data.groupSize} people
Duration: ${data.duration} days
Start Date: ${data.startDate}
${data.addons.length > 0 ? `Add-ons: ${data.addons.join(', ')}` : ''}

Estimated Total: R${data.pricing.finalTotal.toLocaleString()} per person

Please provide a detailed quote and availability for these dates.`;
                
                messageTextarea.value = message;
            }
        }, 500);
    }
}

// Initialize itinerary builder
let itineraryBuilder;