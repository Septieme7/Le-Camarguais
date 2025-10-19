class RestaurantApp {
    constructor() {
        this.cart = [];
        this.quantities = {};
        this.lastFocusedElement = null;
        
        this.productCategories = {
            // Boissons
            "Canette 33cl": "Boissons",
            "Redbull 25cl": "Boissons",
            "Limonade Artisanale 42cl": "Boissons",
            "Perrier verre": "Boissons",
            "Orangina verre 33cl": "Boissons",
            "Crystalin fraise 50cl": "Boissons",
            "Crystalin nature": "Boissons",
            "Capri-Sun": "Boissons",
            "Sirop": "Boissons",
            "PAGO": "Boissons",
            
            // Plats de la semaine
            "Couscous selon humeur": "Plats de la semaine",
            "Paella selon humeur": "Plats de la semaine",
            "Daube selon humeur": "Plats de la semaine",
            
            // Sandwiches
            "Jambon emmental beurre": "Sandwiches",
            "Saucisson beurre": "Sandwiches",
            "Halal jambon emmental": "Sandwiches",
            
            // Burrata
            "Burrata mortadella emmental": "Burrata",
            
            // Croque Monsieur
            "Croque Monsieur nature": "Croque Monsieur",
            
            // Paninis
            "Saumon boursin": "Paninis",
            "Poulet boursin": "Paninis",
            "Jambon cru chèvre": "Paninis",
            "3 fromages": "Paninis",
            "Jambon emmental": "Paninis",
            "Chorizo tomate mozzarella": "Paninis",
            "Reblochon": "Paninis",
            "Reblochon lardons": "Paninis",
            
            // Bruschetta
            "Base crème": "Bruschetta",
            "Base tomate": "Bruschetta",
            
            // Burgers
            "Burger simple": "Burgers",
            "Burger double": "Burgers",
            
            // Autres
            "Portion pizza": "Autres",
            "Hot dog viande hachée": "Autres",
            "Hot dog saucisse": "Autres",
            
            // Desserts
            "Tiramisu speculoos": "Desserts",
            "Tarte Daim": "Desserts",
            "Tarte Oreo": "Desserts"
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCartFromLocalStorage();
        this.clearOldCart();
        this.handleResize();
        this.setupServiceWorker();
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

        // Modals
        const closeModalBtn = document.getElementById('closeModal');
        const closeCartBtn = document.getElementById('closeCart');
        const qrBtn = document.getElementById('qrBtn');
        const openCartBtn = document.getElementById('openCartBtn');
        const scrollTopBtn = document.getElementById('scrollTopBtn');

        // Événements de délégation
        document.addEventListener('click', (e) => this.handleClickEvents(e));
        document.addEventListener('keydown', (e) => this.handleKeyboardEvents(e));

        // Fermeture des modals
        if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeModal('imageModal'));
        if (closeCartBtn) closeCartBtn.addEventListener('click', () => this.closeModal('cartModal'));

        // Ouverture des modals
        if (qrBtn) qrBtn.addEventListener('click', () => this.openQRModal());
        if (openCartBtn) openCartBtn.addEventListener('click', () => this.openCartModal());

        // Scroll to top
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => this.scrollToTop());
            window.addEventListener('scroll', () => this.toggleScrollTopButton());
        }

        // Redimensionnement
        window.addEventListener('resize', () => this.handleResize());

        // Gestion des erreurs images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => this.handleImageError(img));
            img.addEventListener('load', () => this.handleImageLoad(img));
        });

        // Amélioration du SEO: tracking des interactions
        this.setupInteractionTracking();
    }

    setupInteractionTracking() {
        // Track menu section views
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log(`Section viewed: ${entry.target.id}`);
                    // Ici vous pourriez envoyer des données analytics
                }
            });
        }, { threshold: 0.5 });

        // Observer les sections du menu
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    handleClickEvents(e) {
        // Boutons quantité
        if (e.target.classList.contains('quantity-btn')) {
            this.handleQuantityChange(e.target);
            return;
        }
        
        // Ajout au panier
        if (e.target.classList.contains('add-to-cart')) {
            this.handleAddToCart(e.target);
            return;
        }
        
        // Images cliquables
        if (e.target.classList.contains('menu-img')) {
            this.openImageModal(e.target.dataset.src, e.target.dataset.alt);
            return;
        }
        
        // Fermeture modals par clic extérieur
        if (e.target.id === 'imageModal') this.closeModal('imageModal');
        if (e.target.id === 'cartModal') this.closeModal('cartModal');
    }

    handleKeyboardEvents(e) {
        // Raccourcis clavier
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.openCartModal();
        }
        
        // Échap pour fermer les modals
        if (e.key === 'Escape') {
            const cartModal = document.getElementById('cartModal');
            const imageModal = document.getElementById('imageModal');
            
            if (cartModal && cartModal.classList.contains('show')) {
                this.closeModal('cartModal');
            }
            if (imageModal && imageModal.classList.contains('show')) {
                this.closeModal('imageModal');
            }
        }
    }

    // Gestion du thème
    toggleTheme() {
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeToggleBtn) {
            themeToggleBtn.classList.toggle('theme-dark', newTheme === 'dark');
        }
        
        // Mise à jour des meta pour le SEO
        this.updateThemeMeta(newTheme);
    }

    updateThemeMeta(theme) {
        // Mise à jour de la meta theme-color pour le SEO
        const themeColor = theme === 'dark' ? '#2d3748' : '#f5f7fa';
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = themeColor;
    }

    // Plein écran
    toggleFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
            if (fullscreenBtn) fullscreenBtn.classList.add('fullscreen');
        } else {
            document.exitFullscreen();
            if (fullscreenBtn) fullscreenBtn.classList.remove('fullscreen');
        }
    }

    // Gestion des quantités
    handleQuantityChange(button) {
        const id = button.dataset.id;
        const isIncrease = button.classList.contains('increase');
        
        this.quantities[id] = Math.max(1, (this.quantities[id] || 1) + (isIncrease ? 1 : -1));
        const quantityElement = document.getElementById(`${id}-quantity`);
        if (quantityElement) {
            quantityElement.textContent = this.quantities[id];
        }
    }

    // Ajout au panier
    handleAddToCart(button) {
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const id = button.dataset.id;
        const quantity = this.quantities[id] || 1;
        
        this.addToCart(name, price, quantity);
        
        // Feedback visuel
        const originalText = button.textContent;
        button.textContent = 'Ajouté !';
        button.disabled = true;
        
        // Animation de confirmation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            this.quantities[id] = 1;
            const quantityElement = document.getElementById(`${id}-quantity`);
            if (quantityElement) {
                quantityElement.textContent = 1;
            }
        }, 1000);
    }

    addToCart(name, price, quantity = 1) {
        const existingItem = this.cart.find(item => item.name === name && item.price === price);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ name, price, quantity });
        }
        
        this.updateCart();
        this.triggerCartAnimation();
    }

    triggerCartAnimation() {
        const cartBtn = document.getElementById('openCartBtn');
        if (cartBtn) {
            cartBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                cartBtn.style.transform = 'scale(1)';
            }, 300);
        }
    }

    // Gestion du panier
    updateCart() {
        const cartItemsList = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItemsList || !cartTotal) return;
        
        cartItemsList.innerHTML = '';
        let total = 0;
        
        // Grouper les articles par catégorie
        const cartByCategory = {};
        
        this.cart.forEach(item => {
            const category = this.productCategories[item.name] || 'Autres';
            if (!cartByCategory[category]) {
                cartByCategory[category] = [];
            }
            cartByCategory[category].push(item);
        });

        // Grouper les articles identiques dans chaque catégorie
        Object.keys(cartByCategory).forEach(category => {
            const categoryItems = cartByCategory[category];
            const groupedItems = categoryItems.reduce((acc, item) => {
                const key = `${item.name}-${item.price}`;
                if (!acc[key]) {
                    acc[key] = { ...item, quantity: 0 };
                }
                acc[key].quantity += item.quantity;
                return acc;
            }, {});

            // Ajouter l'en-tête de catégorie
            if (Object.keys(groupedItems).length > 0) {
                const categoryHeader = document.createElement('li');
                categoryHeader.className = 'category-header';
                categoryHeader.textContent = category;
                cartItemsList.appendChild(categoryHeader);
            }

            // Ajouter les articles de la catégorie
            Object.values(groupedItems).forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.innerHTML = `
                    <div class="flex-1">
                        <div class="font-medium">${item.name}</div>
                        <div class="text-sm text-gray-600">
                            ${item.price.toFixed(2)}€ 
                            <span class="cart-item-quantity">× ${item.quantity}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="font-bold">${itemTotal.toFixed(2)}€</span>
                        <div class="flex space-x-1">
                            <button class="cart-action-btn bg-green-500" onclick="app.addCartItem('${this.escapeHtml(item.name)}', ${item.price})" aria-label="Ajouter une unité de ${this.escapeHtml(item.name)}">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="cart-action-btn bg-yellow-500" onclick="app.decreaseCartItem('${this.escapeHtml(item.name)}', ${item.price})" aria-label="Diminuer une unité de ${this.escapeHtml(item.name)}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="cart-action-btn bg-red-500" onclick="app.removeCartItem('${this.escapeHtml(item.name)}', ${item.price})" aria-label="Supprimer ${this.escapeHtml(item.name)}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                cartItemsList.appendChild(li);
            });
        });

        cartTotal.textContent = `Total: ${total.toFixed(2)}€`;
        this.saveCartToLocalStorage();
        
        // Mise à jour du bouton panier
        this.updateCartButton();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateCartButton() {
        const cartBtn = document.getElementById('openCartBtn');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartBtn) {
            if (totalItems > 0) {
                cartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Voir Commande (${totalItems})`;
            } else {
                cartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Voir Commande`;
            }
        }
    }

    // Méthodes pour les boutons du panier (accessibles globalement)
    addCartItem(name, price) {
        this.addToCart(name, price, 1);
    }

    decreaseCartItem(name, price) {
        const itemIndex = this.cart.findIndex(item => item.name === name && item.price === price);
        if (itemIndex !== -1) {
            if (this.cart[itemIndex].quantity > 1) {
                this.cart[itemIndex].quantity--;
            } else {
                this.cart.splice(itemIndex, 1);
            }
            this.updateCart();
        }
    }

    removeCartItem(name, price) {
        this.cart = this.cart.filter(item => !(item.name === name && item.price === price));
        this.updateCart();
    }

    // Gestion des modals
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        this.lastFocusedElement = document.activeElement;
        
        modal.classList.remove('hidden');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Empêche le scroll du body
        
        this.trapFocus(modal);
        
        // Focus sur le premier élément focusable
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.add('hidden');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Rétablit le scroll
        
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
    }

    openImageModal(src, alt) {
        const modalImage = document.getElementById('modalImage');
        const imageModalLabel = document.getElementById('imageModalLabel');
        
        if (modalImage && imageModalLabel) {
            modalImage.src = src;
            modalImage.alt = alt;
            imageModalLabel.textContent = `Image agrandie: ${alt}`;
            
            this.openModal('imageModal');
        }
    }

    openQRModal() {
        this.openImageModal('assets/images/QR3-Le-Camarguais.png', 'QR Code Le Camarguais');
    }

    openCartModal() {
        this.openModal('cartModal');
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
        const cleanup = () => {
            modal.removeEventListener('keydown', handleKeyDown);
        };
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cleanup();
        }, { once: true });
        
        // Nettoyage quand le modal est fermé
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && !modal.classList.contains('show')) {
                    cleanup();
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
    }

    // Scroll to top
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toggleScrollTopButton() {
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (!scrollTopBtn) return;

        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    // Gestion des erreurs
    handleImageError(img) {
        console.warn('Image failed to load:', img.src);
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
        img.alt = 'Image non disponible';
    }

    handleImageLoad(img) {
        img.classList.add('loaded');
    }

    // Responsive
    handleResize() {
        const isMobile = window.innerWidth < 640;
        const modals = document.querySelectorAll('#cartModal .modal-content, #imageModal .modal-content');
        
        modals.forEach(modal => {
            if (isMobile) {
                modal.classList.add('mx-2');
                modal.classList.remove('mx-4');
            } else {
                modal.classList.remove('mx-2');
                modal.classList.add('mx-4');
            }
        });
    }

    // Service Worker pour PWA
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // LocalStorage
    saveCartToLocalStorage() {
        try {
            localStorage.setItem('restaurantCart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }

    loadCartFromLocalStorage() {
        try {
            const savedCart = localStorage.getItem('restaurantCart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                this.updateCart();
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            this.cart = [];
        }
    }

    clearOldCart() {
        try {
            const lastClear = localStorage.getItem('lastCartClear');
            const now = new Date().getTime();
            const oneDay = 24 * 60 * 60 * 1000;

            if (!lastClear || now - lastClear > oneDay) {
                localStorage.removeItem('restaurantCart');
                this.cart = [];
                this.updateCart();
                localStorage.setItem('lastCartClear', now);
            }
        } catch (error) {
            console.error('Error clearing old cart:', error);
        }
    }

    // Méthode utilitaire pour le SEO
    updatePageTitle(section) {
        const baseTitle = 'Le Camarguais - Restaurant Camargue';
        document.title = `${section} | ${baseTitle}`;
    }
}

// Initialisation de l'application
let app;
document.addEventListener('DOMContentLoaded', () => {
    // Chargement du thème
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn && currentTheme === 'dark') {
        themeToggleBtn.classList.add('theme-dark');
    }
    
    // Initialisation de l'app
    app = new RestaurantApp();
    
    // Mise à jour de la meta theme-color
    app.updateThemeMeta(currentTheme);
});

// Rendre l'application accessible globalement pour les onclick HTML
window.app = app;

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Gestion des promesses non catchées
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});