/**
 * Application de gestion des promotions - Optimisé SEO
 * Gère l'interface utilisateur et les fonctionnalités de la page promotions
 */

class PromotionApp {
    constructor() {
        this.currentTheme = 'light';
        this.isFullscreen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.displayCurrentDate();
        this.setupPerformanceMonitoring();
    }

    setupEventListeners() {
        // Thème
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Plein écran
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Gestion des erreurs images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => this.handleImageError(img));
            img.addEventListener('load', () => this.handleImageLoad(img));
        });

        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Analytics des interactions (SEO)
        this.setupInteractionTracking();
    }

    loadUserPreferences() {
        // Chargement du thème
        this.currentTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', this.currentTheme);
        
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn && this.currentTheme === 'dark') {
            themeToggleBtn.classList.add('theme-dark');
        }
    }

    // Gestion du thème
    toggleTheme() {
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        if (themeToggleBtn) {
            themeToggleBtn.classList.toggle('theme-dark', this.currentTheme === 'dark');
        }
        
        // Tracking d'événement (pour analytics)
        this.trackEvent('theme_toggle', this.currentTheme);
    }

    // Plein écran
    toggleFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Erreur mode plein écran:', err);
                this.trackEvent('fullscreen_error', err.message);
            });
            this.isFullscreen = true;
            if (fullscreenBtn) fullscreenBtn.classList.add('fullscreen');
        } else {
            document.exitFullscreen();
            this.isFullscreen = false;
            if (fullscreenBtn) fullscreenBtn.classList.remove('fullscreen');
        }
        
        this.trackEvent('fullscreen_toggle', this.isFullscreen);
    }

    // Affichage de la date actuelle
    displayCurrentDate() {
        const currentDateElement = document.getElementById('currentDate');
        if (currentDateElement) {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            currentDateElement.textContent = formattedDate;
            currentDateElement.setAttribute('datetime', today.toISOString());
        }
    }

    // Gestion des erreurs images
    handleImageError(img) {
        console.warn('Image non chargée:', img.src);
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
        img.alt = 'Image non disponible';
        
        this.trackEvent('image_error', img.src);
    }

    handleImageLoad(img) {
        img.classList.add('loaded');
        this.trackEvent('image_loaded', img.src);
    }

    // Gestion de la visibilité de la page
    handleVisibilityChange() {
        if (document.hidden) {
            this.trackEvent('page_hidden');
        } else {
            this.trackEvent('page_visible');
        }
    }

    // Setup du tracking des interactions (pour analytics)
    setupInteractionTracking() {
        // Track les clics sur les boutons importants
        const trackableElements = document.querySelectorAll('a, button, .inline-btn');
        trackableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const elementType = e.target.tagName.toLowerCase();
                const elementText = e.target.textContent.trim() || e.target.getAttribute('aria-label') || 'unknown';
                this.trackEvent('click', `${elementType}_${elementText}`);
            });
        });

        // Track le temps passé sur la page
        this.startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - this.startTime;
            this.trackEvent('time_spent', Math.round(timeSpent / 1000));
        });
    }

    // Monitoring des performances
    setupPerformanceMonitoring() {
        // Utilise l'API Performance pour mesurer le temps de chargement
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                this.trackEvent('page_load_time', loadTime);
            });
        }
    }

    // Méthode de tracking (à adapter avec votre solution analytics)
    trackEvent(action, value = null) {
        // Exemple d'implémentation - À adapter avec Google Analytics ou autre
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'promotion_page',
                'event_label': value
            });
        }
        
        // Log en console pour le développement
        if (process.env.NODE_ENV === 'development') {
            console.log('Event tracked:', { action, value });
        }
    }

    // Nettoyage mémoire
    destroy() {
        // Nettoie les event listeners si nécessaire
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        
        if (themeToggleBtn) {
            themeToggleBtn.removeEventListener('click', this.toggleTheme);
        }
        if (fullscreenBtn) {
            fullscreenBtn.removeEventListener('click', this.toggleFullscreen);
        }
        
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

// Initialisation de l'application
let promotionApp;

document.addEventListener('DOMContentLoaded', () => {
    try {
        promotionApp = new PromotionApp();
        
        // Signal que la page est prête pour le SEO
        document.body.classList.add('page-loaded');
        
        console.log('Application promotions initialisée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Erreur globale:', event.error);
    
    // Track l'erreur
    if (promotionApp && promotionApp.trackEvent) {
        promotionApp.trackEvent('global_error', event.error.message);
    }
});

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromotionApp;
}