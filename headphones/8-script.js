/**
 * Headphones Mobile Navigation
 * Enhanced hamburger menu functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('main-nav');
    const navOverlay = document.getElementById('nav-overlay');
    const hamburger = document.querySelector('.hamburger-menu');
    const navItems = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // Menu state tracking
    let isMenuOpen = false;
    
    /**
     * Toggle the mobile menu
     * @param {boolean} [state] - Force open/close state
     */
    function toggleMenu(state) {
        // Use provided state or toggle current state
        isMenuOpen = typeof state === 'boolean' ? state : !isMenuOpen;
        
        // Update checkbox and aria-expanded
        menuToggle.checked = isMenuOpen;
        hamburger.setAttribute('aria-expanded', isMenuOpen);
        
        // Toggle body scroll
        body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
        
        // For screen readers
        if (isMenuOpen) {
            navLinks.setAttribute('aria-hidden', 'false');
            // Focus first menu item when opening
            setTimeout(() => navItems[0].focus(), 100);
        } else {
            navLinks.setAttribute('aria-hidden', 'true');
        }
    }
    
    /**
     * Close the mobile menu
     */
    function closeMenu() {
        toggleMenu(false);
    }
    
    /**
     * Handle window resize events
     */
    function handleResize() {
        // Close menu if window grows beyond mobile breakpoint
        if (window.innerWidth > 480 && isMenuOpen) {
            closeMenu();
        }
        
        // Update menu display property
        navLinks.style.display = window.innerWidth <= 480 ? 'flex' : 'flex';
    }
    
    // Event Listeners
    
    // Hamburger button click
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent overlay click from triggering immediately
        toggleMenu();
    });
    
    // Overlay click to close
    navOverlay.addEventListener('click', closeMenu);
    
    // Menu item clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth > 480) return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Close menu first
            closeMenu();
            
            // Then scroll to target section
            setTimeout(() => {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 400); // Match this with your CSS transition duration
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !navLinks.contains(e.target) && e.target !== hamburger) {
            closeMenu();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key closes menu
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
            hamburger.focus();
        }
        
        // Trap focus within menu when open
        if (isMenuOpen && e.key === 'Tab') {
            const focusableElements = navLinks.querySelectorAll('a[href]');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    });
    
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });
    
    // Initialize
    function init() {
        // Set initial ARIA attributes
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        navLinks.setAttribute('aria-hidden', 'true');
        
        // Set initial display based on viewport
        handleResize();
    }
    
    init();
});