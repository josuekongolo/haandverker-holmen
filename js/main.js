/**
 * Håndverker Holmen AS - Main JavaScript
 * Navigation, form handling, animations, and interactivity
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================

    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMobile = document.getElementById('nav-mobile');
    const contactForm = document.getElementById('contact-form');
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // ========================================
    // Mobile Navigation
    // ========================================

    if (navToggle && navMobile) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMobile.classList.toggle('active');
            document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile nav when clicking a link
        const navMobileLinks = navMobile.querySelectorAll('.nav-mobile-link');
        navMobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (navMobile.classList.contains('active') &&
                !navMobile.contains(e.target) &&
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // Header Scroll Effect
    // ========================================

    if (header) {
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // ========================================
    // Smooth Scrolling for Anchor Links
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Contact Form Handling
    // ========================================

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Check honeypot
            const honeypot = this.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) {
                console.log('Bot detected');
                return;
            }

            // Gather form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                if (key !== 'website') { // Exclude honeypot
                    data[key] = value;
                }
            });

            // Validate required fields
            const name = this.querySelector('#name');
            const phone = this.querySelector('#phone');
            const projectType = this.querySelector('#project-type');
            const message = this.querySelector('#message');

            if (!name.value || !phone.value || !projectType.value || !message.value) {
                showFormMessage('Vennligst fyll ut alle obligatoriske felter.', 'error');
                return;
            }

            // Validate phone number (Norwegian format)
            const phoneRegex = /^(\+47)?[2-9]\d{7}$/;
            const cleanPhone = phone.value.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFormMessage('Vennligst oppgi et gyldig norsk telefonnummer.', 'error');
                return;
            }

            // Validate email if provided
            const email = this.querySelector('#email');
            if (email.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.value)) {
                    showFormMessage('Vennligst oppgi en gyldig e-postadresse.', 'error');
                    return;
                }
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sender...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            try {
                // In production, replace this with actual API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message
                showFormMessage('Takk for din henvendelse! Jeg tar kontakt snart.', 'success');
                this.reset();

            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('Beklager, noe gikk galt. Prøv igjen eller ring oss direkte.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.innerHTML = `
            <p>${message}</p>
            <button type="button" class="form-message-close" aria-label="Lukk">&times;</button>
        `;

        // Style the message
        messageEl.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: fadeIn 0.3s ease;
            ${type === 'success'
                ? 'background-color: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;'
                : 'background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
            }
        `;

        // Add close button functionality
        const closeBtn = messageEl.querySelector('.form-message-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            color: inherit;
        `;
        closeBtn.addEventListener('click', () => messageEl.remove());

        // Insert before form
        contactForm.insertBefore(messageEl, contactForm.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    // ========================================
    // Cookie Banner
    // ========================================

    if (cookieBanner) {
        // Check if user has already made a choice
        const cookieChoice = localStorage.getItem('cookieConsent');

        if (!cookieChoice) {
            // Show banner after a short delay
            setTimeout(() => {
                cookieBanner.classList.add('active');
            }, 1000);
        }

        if (acceptCookies) {
            acceptCookies.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'accepted');
                cookieBanner.classList.remove('active');
            });
        }

        if (declineCookies) {
            declineCookies.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'declined');
                cookieBanner.classList.remove('active');
            });
        }
    }

    // ========================================
    // Project Filtering
    // ========================================

    if (filterBtns.length > 0) {
        const projectCards = document.querySelectorAll('.project-full-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.dataset.filter;

                projectCards.forEach(card => {
                    const category = card.dataset.category;

                    if (filter === 'all' || category === filter) {
                        card.style.display = '';
                        card.style.animation = 'fadeIn 0.3s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ========================================
    // Intersection Observer for Animations
    // ========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.service-card, .project-card, .testimonial-card, .value-card, .why-card');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // ========================================
    // Phone Number Formatting
    // ========================================

    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters except +
            let value = e.target.value.replace(/[^\d+]/g, '');

            // Format as Norwegian phone number
            if (value.startsWith('+47')) {
                value = value.slice(0, 11);
            } else if (value.startsWith('47')) {
                value = '+' + value.slice(0, 10);
            } else {
                value = value.slice(0, 8);
            }

            e.target.value = value;
        });
    });

    // ========================================
    // Lazy Loading Images
    // ========================================

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // Service Worker Registration (PWA)
    // ========================================

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Uncomment when service worker is ready
            // navigator.serviceWorker.register('/sw.js')
            //     .then(registration => {
            //         console.log('ServiceWorker registration successful');
            //     })
            //     .catch(err => {
            //         console.log('ServiceWorker registration failed: ', err);
            //     });
        });
    }

    // ========================================
    // Print Styles Enhancement
    // ========================================

    window.addEventListener('beforeprint', () => {
        // Expand any collapsed sections
        document.querySelectorAll('.nav-mobile').forEach(el => {
            el.style.display = 'none';
        });
    });

    // ========================================
    // Accessibility Enhancements
    // ========================================

    // Handle focus visible for keyboard users
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('using-keyboard');
    });

    // Skip to main content link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const main = document.querySelector('main');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
            }
        });
    }

    // ========================================
    // Error Handling
    // ========================================

    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.message);
    });

    // ========================================
    // Utility Functions
    // ========================================

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ========================================
    // Console Branding
    // ========================================

    console.log('%c Håndverker Holmen AS ',
        'background: #8B5A2B; color: white; font-size: 16px; padding: 10px 20px; border-radius: 4px;'
    );
    console.log('%c Din lokale snekker i Indre Østfold ',
        'color: #8B5A2B; font-size: 12px;'
    );

})();
