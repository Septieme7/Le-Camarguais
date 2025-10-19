class PromotionApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayCurrentDate();
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
        });
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
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Erreur en passant en plein écran: ${err.message}`);
            });
            fullscreenBtn.classList.add('fullscreen');
        } else {
            document.exitFullscreen();
            fullscreenBtn.classList.remove('fullscreen');
        }
    }

    // Affichage de la date actuelle
    displayCurrentDate() {
        const promoDate = document.getElementById('promoDate');
        if (promoDate) {
            const today = new Date();
            const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
            promoDate.textContent = `Vérifié le ${formattedDate}`;
        }
    }

    // Gestion des erreurs images
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