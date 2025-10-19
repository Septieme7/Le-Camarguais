class PromotionApp {
    constructor() {
        this.lastFocusedElement = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
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

        // Modal
        const closeModalBtn = document.getElementById('closeModal');
        const modal = document.getElementById('imageModal');

        // Événements de délégation
        document.addEventListener('click', (e) => this.handleClickEvents(e));
        document.addEventListener('keydown', (e) => this.handleKeyboardEvents(e));

        // Fermeture du modal
        if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeModal('imageModal'));

        // Gestion des erreurs images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => this.handleImageError(img));
        });
    }

    handleClickEvents(e) {
        // Images cliquables
        if (e.target.classList.contains('menu-img')) {
            this.openImageModal(e.target.dataset.src, e.target.dataset.alt);
            return;
        }
        
        // Fermeture modal par clic extérieur
        if (e.target.id === 'imageModal') this.closeModal('imageModal');
    }

    handleKeyboardEvents(e) {
        // Échap pour fermer le modal
        if (e.key === 'Escape') {
            if (!document.getElementById('imageModal').classList.contains('hidden')) {
                this.closeModal('imageModal');
            }
        }
    }

    // Gestion du thème
    toggleTheme() {
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggleBtn.classList.toggle('theme-dark', newTheme === 'dark');
    }

    // Plein écran
    toggleFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullscreenBtn.classList.add('fullscreen');
        } else {
            document.exitFullscreen();
            fullscreenBtn.classList.remove('fullscreen');
        }
    }

    // Gestion des modals
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        this.lastFocusedElement = document.activeElement;
        
        modal.classList.remove('hidden');
        modal.classList.add('show');
        this.trapFocus(modal);
        
        // Focus sur le premier élément focusable
        const firstFocusable = modal.querySelector('button, [href]');
        if (firstFocusable) firstFocusable.focus();
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
        modal.classList.remove('show');
        
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
    }

    openImageModal(src, alt) {
        const modalImage = document.getElementById('modalImage');
        const imageModalLabel = document.getElementById('imageModalLabel');
        
        modalImage.src = src;
        modalImage.alt = alt;
        imageModalLabel.textContent = `Image agrandie: ${alt}`;
        
        this.openModal('imageModal');
    }

    // Piège du focus pour l'accessibilité
    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        modal.addEventListener('keydown', handleKeyDown);
        
        // Nettoyage
        const cleanup = () => modal.removeEventListener('keydown', handleKeyDown);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cleanup();
        }, { once: true });
    }

    // Gestion des erreurs
    handleImageError(img) {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
        img.alt = 'Image non disponible';
    }
}

// Initialisation de l'application
let promotionApp;
document.addEventListener('DOMContentLoaded', () => {
    // Chargement du thème
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn && currentTheme === 'dark') {
        themeToggleBtn.classList.add('theme-dark');
    }
    
    // Initialisation de l'app
    promotionApp = new PromotionApp();
});