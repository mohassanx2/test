/**
 * ================================================================
 * SCRIPT.JS - V6 - 2025 ENHANCED EDITION
 * Developer: MiniMax Agent
 * Features: Modern ES2025+ syntax, enhanced animations, intersection observer,
 * performance optimizations, and advanced UI interactions
 * ================================================================
 */

// Modern ES2025+ Class-based Application Architecture
class ModernPortfolioApp {
    constructor() {
        this.config = {
            aos: {
                duration: 800,
                once: false,
                easing: 'ease-out-cubic',
                offset: 100
            },
            portfolio: {
                initialItems: 9,
                gridSelector: '#portfolio-grid',
                filtersSelector: '#portfolio-filters',
                showMoreBtnSelector: '#show-more-btn',
                showMoreContainerSelector: '#show-more-container',
                itemSelector: '.portfolio-item',
                filterBtnSelector: '.filter-btn',
                activeFilterClass: 'active',
                hiddenItemClass: 'hidden',
                filterStorageKey: 'activePortfolioFilter',
            },
            mobileMenu: {
                hamburgerSelector: '.hamburger',
                navMenuSelector: '.navbar__menu',
                navLinkSelector: '.navbar__link',
                activeClass: 'active'
            },
            theme: {
                toggleSelector: '.theme-toggle',
                lightIconClass: 'fa-sun',
                darkIconClass: 'fa-moon',
                storageKey: 'theme'
            },
            scrollRestoration: {
                storageKey: 'scrollPosition'
            },
            animations: {
                observerOptions: {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            }
        };

        this.observers = new Map();
        this.portfolioState = {};
        this.rafId = null;
        
        this.init();
    }

    /**
     * Initialize all application modules
     */
    async init() {
        try {
            // Wait for DOM to be fully loaded
            await this.waitForDOM();
            
            // Initialize core modules
            this.initAOS();
            this.initIntersectionObservers();
            this.initMobileMenu();
            this.initThemeToggle();
            this.initPortfolio();
            this.initVideoHover();
            this.initScrollRestoration();
            this.initAdvancedAnimations();
            this.initPerformanceOptimizations();
            this.initAccessibilityFeatures();
            this.initKeyboardNavigation();
            
            // Initialize Fancybox if available
            this.initFancybox();
            
            console.log('🚀 Portfolio App initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Portfolio App:', error);
        }
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Initialize AOS (Animate On Scroll) library
     */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init(this.config.aos);
        }
    }

    /**
     * Initialize modern Intersection Observer for enhanced animations
     */
    initIntersectionObservers() {
        // Enhanced scroll animations for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length > 0) {
            const serviceObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
                        }, index * 100);
                    }
                });
            }, this.config.animations.observerOptions);

            serviceCards.forEach(card => serviceObserver.observe(card));
            this.observers.set('services', serviceObserver);
        }

        // Enhanced navbar scroll effect
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const navObserver = new IntersectionObserver(([entry]) => {
                navbar.classList.toggle('scrolled', !entry.isIntersecting);
            }, { threshold: 1 });

            const hero = document.querySelector('.hero-section');
            if (hero) navObserver.observe(hero);
            this.observers.set('navbar', navObserver);
        }

        // Portfolio items lazy loading animation
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        if (portfolioItems.length > 0) {
            const portfolioObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInUp 0.6s ease-out both';
                        portfolioObserver.unobserve(entry.target);
                    }
                });
            }, this.config.animations.observerOptions);

            portfolioItems.forEach(item => portfolioObserver.observe(item));
            this.observers.set('portfolio', portfolioObserver);
        }
    }

    /**
     * Enhanced mobile menu with modern animations
     */
    initMobileMenu() {
        const { hamburgerSelector, navMenuSelector, navLinkSelector, activeClass } = this.config.mobileMenu;
        const hamburger = document.querySelector(hamburgerSelector);
        const navMenu = document.querySelector(navMenuSelector);

        if (!hamburger || !navMenu) return;

        // Enhanced hamburger toggle with animation
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle(activeClass);
            navMenu.classList.toggle(activeClass);
            hamburger.setAttribute('aria-expanded', isActive);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
            
            // Add stagger animation to menu items
            if (isActive) {
                this.animateMenuItems(navMenu);
            }
        });

        // Close menu when clicking on links
        navMenu.addEventListener('click', (e) => {
            if (e.target.matches(navLinkSelector)) {
                hamburger.classList.remove(activeClass);
                navMenu.classList.remove(activeClass);
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove(activeClass);
                navMenu.classList.remove(activeClass);
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Animate menu items with stagger effect
     */
    animateMenuItems(menu) {
        const items = menu.querySelectorAll('.navbar__item');
        items.forEach((item, index) => {
            item.style.animation = `fadeInUp 0.4s ease-out ${index * 0.1}s both`;
        });
    }

    /**
     * Enhanced theme toggle with smooth transitions
     */
    initThemeToggle() {
        const { toggleSelector, lightIconClass, darkIconClass, storageKey } = this.config.theme;
        const toggleButton = document.querySelector(toggleSelector);
        
        if (!toggleButton) return;

        const icon = toggleButton.querySelector('i');
        
        const applyTheme = (theme, animate = true) => {
            // Add transition class for smooth theme change
            if (animate) {
                document.body.classList.add('theme-transitioning');
                setTimeout(() => {
                    document.body.classList.remove('theme-transitioning');
                }, 300);
            }
            
            document.body.dataset.theme = theme;
            localStorage.setItem(storageKey, theme);
            
            if (icon) {
                icon.classList.toggle(lightIconClass, theme === 'light');
                icon.classList.toggle(darkIconClass, theme === 'dark');
            }
            
            // Dispatch custom event for theme change
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
        };

        // Enhanced toggle with animation
        toggleButton.addEventListener('click', () => {
            const currentTheme = document.body.dataset.theme;
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });

        // Initialize theme
        const savedTheme = localStorage.getItem(storageKey) || 'dark';
        applyTheme(savedTheme, false);
    }

    /**
     * Enhanced video hover effects with performance optimization
     */
    initVideoHover() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            const video = item.querySelector('video');
            if (!video) return;

            // Preload video metadata
            video.preload = 'metadata';
            
            let playPromise;
            
            const playVideo = async () => {
                try {
                    if (video.readyState >= 2) { // HAVE_CURRENT_DATA
                        playPromise = video.play();
                        await playPromise;
                    }
                } catch (error) {
                    console.warn('Video play failed:', error);
                }
            };
            
            const pauseVideo = async () => {
                try {
                    if (playPromise) {
                        await playPromise;
                    }
                    video.pause();
                } catch (error) {
                    console.warn('Video pause failed:', error);
                }
            };

            // Use modern event listeners with passive option
            item.addEventListener('mouseenter', playVideo, { passive: true });
            item.addEventListener('mouseleave', pauseVideo, { passive: true });
            
            // Pause video when it goes out of viewport
            const videoObserver = new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting) {
                    pauseVideo();
                }
            });
            
            videoObserver.observe(item);
            this.observers.set(`video-${item.dataset.id || Math.random()}`, videoObserver);
        });
    }

    /**
     * Enhanced scroll restoration with smooth scrolling
     */
    initScrollRestoration() {
        const { storageKey } = this.config.scrollRestoration;
        
        // Save scroll position when clicking portfolio items
        document.body.addEventListener('click', e => {
            if (e.target.closest(this.config.portfolio.itemSelector)) {
                sessionStorage.setItem(storageKey, window.scrollY);
            }
        }, { passive: true });

        // Restore scroll position
        const restoreScroll = () => {
            const pos = sessionStorage.getItem(storageKey);
            if (pos) {
                // Use smooth scrolling
                window.scrollTo({
                    top: parseInt(pos, 10),
                    behavior: 'smooth'
                });
                sessionStorage.removeItem(storageKey);
            }
        };

        // Handle page show event (including back/forward navigation)
        window.addEventListener('pageshow', event => {
            if (event.persisted) {
                setTimeout(restoreScroll, 150);
            }
        });
        
        // Initial scroll restoration
        setTimeout(restoreScroll, 150);
    }

    /**
     * Enhanced Fancybox initialization with modern options
     */
    initFancybox() {
        if (typeof Fancybox === 'undefined') return;

        let scrollPosition = 0;
        
        Fancybox.bind("[data-fancybox]", {
            wheel: "zoom",
            zoom: true,
            keyboard: true,
            closeButton: true,
            toolbar: true,
            infobar: true,
            arrows: true,
            
            // Modern UI configuration
            ui: {
                closeButton: "top",
                toolbar: {
                    display: {
                        left: ["infobar"],
                        middle: [],
                        right: ["slideshow", "fullscreen", "download", "thumbs", "close"]
                    }
                }
            },
            
            // Enhanced animations
            showClass: "fancybox-fadeIn",
            hideClass: "fancybox-fadeOut",
            
            on: {
                reveal: () => {
                    scrollPosition = window.scrollY;
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${scrollPosition}px`;
                    document.body.style.width = '100%';
                },
                close: () => {
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    window.scrollTo(0, scrollPosition);
                }
            }
        });
    }

    /**
     * Enhanced Portfolio Module with modern features
     */
    initPortfolio() {
        const cfg = this.config.portfolio;
        const grid = document.querySelector(cfg.gridSelector);
        
        if (!grid) return;
        
        this.portfolioState = { 
            items: Array.from(grid.querySelectorAll(cfg.itemSelector)),
            visibleCount: cfg.initialItems,
            filter: '*'
        };
        
        this.initPortfolioFilters();
        this.initPortfolioShowMore();
        this.restorePortfolioState();
    }

    /**
     * Enhanced portfolio rendering with animations
     */
    renderPortfolio() {
        const { filter, items, visibleCount } = this.portfolioState;
        if (!items) return;

        const filteredItems = items.filter(item => 
            filter === '*' || item.classList.contains(filter.substring(1))
        );

        // Hide all items first
        items.forEach(item => {
            item.classList.add('hidden');
            item.style.animation = '';
        });

        // Show visible items with stagger animation
        const visibleItems = filteredItems.slice(0, visibleCount);
        visibleItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.remove('hidden');
                item.style.animation = `fadeInUp 0.6s ease-out both`;
            }, index * 50);
        });

        // Update show more button
        const showMoreContainer = document.querySelector(this.config.portfolio.showMoreContainerSelector);
        if (showMoreContainer) {
            showMoreContainer.classList.toggle('hidden', filteredItems.length <= visibleCount);
        }

        // Refresh AOS
        if (typeof AOS !== 'undefined') {
            setTimeout(() => AOS.refresh(), 300);
        }
    }

    /**
     * Enhanced filter application with animations
     */
    applyFilter(newFilter) {
        const cfg = this.config.portfolio;
        const filterContainer = document.querySelector(cfg.filtersSelector);
        
        if (!filterContainer) return;

        // Save filter state
        sessionStorage.setItem(cfg.filterStorageKey, newFilter);

        // Update active button with animation
        const oldActiveButton = filterContainer.querySelector(`.${cfg.activeFilterClass}`);
        const newActiveButton = filterContainer.querySelector(`[data-filter="${newFilter}"]`);
        
        if (oldActiveButton) {
            oldActiveButton.classList.remove(cfg.activeFilterClass);
        }
        
        if (newActiveButton) {
            newActiveButton.classList.add(cfg.activeFilterClass);
            
            // Add pulse animation to active button
            newActiveButton.style.animation = 'pulse 0.3s ease-out';
            setTimeout(() => {
                newActiveButton.style.animation = '';
            }, 300);
        }

        // Update state and render
        this.portfolioState.filter = newFilter;
        this.portfolioState.visibleCount = cfg.initialItems;
        
        this.updateProjectLinks();
        
        // Add loading effect
        const grid = document.querySelector(cfg.gridSelector);
        if (grid) {
            grid.style.opacity = '0.7';
            setTimeout(() => {
                this.renderPortfolio();
                grid.style.opacity = '1';
            }, 150);
        }
    }

    /**
     * Initialize portfolio filters with enhanced interactions
     */
    initPortfolioFilters() {
        const cfg = this.config.portfolio;
        const filterContainer = document.querySelector(cfg.filtersSelector);
        
        if (!filterContainer) return;
        
        filterContainer.addEventListener('click', (e) => {
            const button = e.target.closest(cfg.filterBtnSelector);
            if (!button) return;
            
            e.preventDefault();
            
            const newFilter = button.getAttribute('data-filter');
            
            // Clear saved state if "All" is selected
            if (newFilter === '*') {
                sessionStorage.removeItem(cfg.filterStorageKey);
            }
            
            this.applyFilter(newFilter);
        });
        
        // Add hover effects to filter buttons
        const filterButtons = filterContainer.querySelectorAll(cfg.filterBtnSelector);
        filterButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains(cfg.activeFilterClass)) {
                    button.style.transform = 'translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains(cfg.activeFilterClass)) {
                    button.style.transform = '';
                }
            });
        });
    }

    /**
     * Initialize show more functionality
     */
    initPortfolioShowMore() {
        const showMoreBtn = document.querySelector(this.config.portfolio.showMoreBtnSelector);
        if (!showMoreBtn) return;
        
        showMoreBtn.addEventListener('click', () => {
            const filteredItems = this.portfolioState.items.filter(item => 
                this.portfolioState.filter === '*' || 
                item.classList.contains(this.portfolioState.filter.substring(1))
            );
            
            this.portfolioState.visibleCount = filteredItems.length;
            this.renderPortfolio();
            
            // Add animation to button
            showMoreBtn.style.animation = 'pulse 0.3s ease-out';
            setTimeout(() => {
                showMoreBtn.style.animation = '';
            }, 300);
        });
    }

    /**
     * Update project links with filter parameters
     */
    updateProjectLinks() {
        if (!this.portfolioState.filter) return;
        
        const { filter, items } = this.portfolioState;
        const currentFilterClass = filter.replace('.', '');
        
        items.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;
            
            const originalHref = link.href.split('?')[0];
            link.href = (currentFilterClass !== '*') 
                ? `${originalHref}?filter=${currentFilterClass}` 
                : originalHref;
        });
    }

    /**
     * Restore portfolio state from URL and session
     */
    restorePortfolioState() {
        const cfg = this.config.portfolio;
        const params = new URLSearchParams(window.location.search);
        const urlFilter = params.get('filter');
        const sessionFilter = sessionStorage.getItem(cfg.filterStorageKey);

        let filterToApply = '*'; // Default filter

        // Priority: URL filter > Session filter > Default
        if (urlFilter) {
            filterToApply = `.${urlFilter}`;
            sessionStorage.setItem(cfg.filterStorageKey, filterToApply);
        } else if (sessionFilter) {
            filterToApply = sessionFilter;
        }

        this.applyFilter(filterToApply);
    }

    /**
     * Initialize advanced animations and effects
     */
    initAdvancedAnimations() {
        // Parallax effect for hero section
        this.initParallaxEffect();
        
        // Smooth scroll for anchor links
        this.initSmoothScroll();
        
        // Enhanced scroll-triggered animations
        this.initScrollAnimations();
        
        // Magnetic effect for CTA buttons
        this.initMagneticEffect();
    }

    /**
     * Initialize parallax effect
     */
    initParallaxEffect() {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;

        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            hero.style.transform = `translateY(${rate}px)`;
            ticking = false;
        };
        
        const requestParallax = () => {
            if (!ticking) {
                this.rafId = requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestParallax, { passive: true });
    }

    /**
     * Initialize smooth scroll for anchor links
     */
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize scroll-triggered animations
     */
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (animatedElements.length === 0) return;
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => animationObserver.observe(el));
        this.observers.set('animations', animationObserver);
    }

    /**
     * Initialize magnetic effect for interactive elements
     */
    initMagneticEffect() {
        const magneticElements = document.querySelectorAll('.cta-button, .service-card');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.1;
                const moveY = y * 0.1;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    /**
     * Initialize performance optimizations
     */
    initPerformanceOptimizations() {
        // Lazy load images
        this.initLazyLoading();
        
        // Optimize scroll listeners
        this.optimizeScrollListeners();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    /**
     * Initialize lazy loading for images
     */
    initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading is supported
            return;
        }
        
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
        
        this.observers.set('images', imageObserver);
    }

    /**
     * Optimize scroll listeners with throttling
     */
    optimizeScrollListeners() {
        let scrollTimeout;
        
        const handleScroll = () => {
            // Clear existing timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            // Set new timeout
            scrollTimeout = setTimeout(() => {
                // Scroll-based operations here
                this.updateScrollProgress();
            }, 16); // ~60fps
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Update scroll progress indicator
     */
    updateScrollProgress() {
        const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        // Update any scroll progress indicators
        const progressBars = document.querySelectorAll('.scroll-progress');
        progressBars.forEach(bar => {
            bar.style.width = `${scrollProgress}%`;
        });
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        // Preload critical fonts
        const fontPreloads = [
            'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Lato:wght@300;400;700&display=swap'
        ];
        
        fontPreloads.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = fontUrl;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    /**
     * Initialize accessibility features
     */
    initAccessibilityFeatures() {
        // Enhanced focus management
        this.initFocusManagement();
        
        // Skip links
        this.initSkipLinks();
        
        // Reduce motion for users who prefer it
        this.initReducedMotion();
        
        // ARIA live regions
        this.initAriaLiveRegions();
    }

    /**
     * Initialize focus management
     */
    initFocusManagement() {
        // Add visible focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });
        
        // Trap focus in modal dialogs
        this.initFocusTrap();
    }

    /**
     * Initialize focus trap for modal elements
     */
    initFocusTrap() {
        const modals = document.querySelectorAll('[role="dialog"]');
        
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        });
    }

    /**
     * Initialize skip links for keyboard navigation
     */
    initSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        
        skipLink.addEventListener('focus', () => {
            skipLink.classList.remove('sr-only');
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.classList.add('sr-only');
        });
        
        document.body.prepend(skipLink);
    }

    /**
     * Initialize reduced motion preferences
     */
    initReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (mediaQuery) => {
            if (mediaQuery.matches) {
                document.body.classList.add('reduce-motion');
                // Disable AOS animations
                if (typeof AOS !== 'undefined') {
                    AOS.init({ disable: true });
                }
            } else {
                document.body.classList.remove('reduce-motion');
                // Re-enable AOS animations
                if (typeof AOS !== 'undefined') {
                    AOS.init(this.config.aos);
                }
            }
        };
        
        prefersReducedMotion.addEventListener('change', handleReducedMotion);
        handleReducedMotion(prefersReducedMotion);
    }

    /**
     * Initialize ARIA live regions for dynamic content
     */
    initAriaLiveRegions() {
        // Create live region for portfolio filter announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
        
        // Listen for portfolio filter changes
        window.addEventListener('portfolioFiltered', (e) => {
            const { filter, count } = e.detail;
            const announcement = `Showing ${count} ${filter === '*' ? 'projects' : `${filter} projects`}`;
            liveRegion.textContent = announcement;
        });
    }

    /**
     * Initialize keyboard navigation enhancements
     */
    initKeyboardNavigation() {
        // Enhanced keyboard navigation for portfolio grid
        const portfolioGrid = document.querySelector('#portfolio-grid');
        if (portfolioGrid) {
            this.initGridKeyboardNavigation(portfolioGrid);
        }
        
        // Global keyboard shortcuts
        this.initGlobalKeyboardShortcuts();
    }

    /**
     * Initialize grid keyboard navigation
     */
    initGridKeyboardNavigation(grid) {
        const items = grid.querySelectorAll('.portfolio-item');
        let currentIndex = 0;
        
        items.forEach((item, index) => {
            item.setAttribute('tabindex', index === 0 ? '0' : '-1');
            
            item.addEventListener('keydown', (e) => {
                const cols = Math.floor(grid.offsetWidth / item.offsetWidth);
                const rows = Math.ceil(items.length / cols);
                
                switch (e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        currentIndex = Math.min(currentIndex + 1, items.length - 1);
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        currentIndex = Math.max(currentIndex - 1, 0);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        currentIndex = Math.min(currentIndex + cols, items.length - 1);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        currentIndex = Math.max(currentIndex - cols, 0);
                        break;
                    case 'Home':
                        e.preventDefault();
                        currentIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        currentIndex = items.length - 1;
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        const link = item.querySelector('a');
                        if (link) link.click();
                        break;
                }
                
                // Update focus
                items.forEach(item => item.setAttribute('tabindex', '-1'));
                items[currentIndex].setAttribute('tabindex', '0');
                items[currentIndex].focus();
            });
        });
    }

    /**
     * Initialize global keyboard shortcuts
     */
    initGlobalKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + T: Toggle theme
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                const themeToggle = document.querySelector('.theme-toggle');
                if (themeToggle) themeToggle.click();
            }
            
            // Alt + M: Toggle mobile menu
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                const hamburger = document.querySelector('.hamburger');
                if (hamburger) hamburger.click();
            }
            
            // Escape: Close mobile menu or modals
            if (e.key === 'Escape') {
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.navbar__menu');
                
                if (hamburger && navMenu && navMenu.classList.contains('active')) {
                    hamburger.click();
                }
            }
        });
    }

    /**
     * Cleanup method for proper resource management
     */
    destroy() {
        // Cancel any pending animation frames
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Remove event listeners
        // Note: Modern browsers automatically clean up event listeners
        // when the page is unloaded, but this is good practice
        
        console.log('🧹 Portfolio App cleaned up');
    }
}

// Initialize the application when DOM is ready
const portfolioApp = new ModernPortfolioApp();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    portfolioApp.destroy();
});

// Expose app instance for debugging in development
if (process?.env?.NODE_ENV === 'development') {
    window.portfolioApp = portfolioApp;
}