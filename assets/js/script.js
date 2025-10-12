let cart = [];
const quantities = {};

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const muteBtn = document.getElementById('muteBtn');
    const audio = document.getElementById('bgAudio');
    const modal = document.getElementById('imageModal');
    const cartModal = document.getElementById('cartModal');
    const modalImage = document.getElementById('modalImage');
    const closeModalBtn = document.getElementById('closeModal');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItemsList = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    // Gestion du thème sombre/clair
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggleBtn.classList.add('theme-dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggleBtn.classList.toggle('theme-dark');
    });

    // Initialiser les quantités à 1
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        const id = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        quantities[id] = 1;
    });

    // Fonctions pour gérer les quantités dans le menu
    window.increaseQuantity = function(id) {
        quantities[id] = (quantities[id] || 1) + 1;
        document.getElementById(`${id}-quantity`).textContent = quantities[id];
    };

    window.decreaseQuantity = function(id) {
        quantities[id] = Math.max(1, (quantities[id] || 1) - 1);
        document.getElementById(`${id}-quantity`).textContent = quantities[id];
    };

    // Fonctionnalité commande
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const id = btn.previousElementSibling.previousElementSibling.id.replace('-quantity', '');
            const quantity = quantities[id] || 1;
            cart.push({ name, price, quantity });
            updateCart();
            btn.textContent = 'Ajouté !';
            setTimeout(() => {
                btn.textContent = btn.dataset.name.includes('(crème)') || btn.dataset.name.includes('(tomate)') || btn.dataset.name.includes('(Daim)') || btn.dataset.name.includes('(Oreo)') ? `Ajouter ${btn.dataset.name.match(/\(.*\)/)}` : 'Ajouter';
                quantities[id] = 1;
                document.getElementById(`${id}-quantity`).textContent = 1;
            }, 1000);
        });
    });

    // Mise à jour de la commande
    function updateCart() {
        cartItemsList.innerHTML = '';
        let total = 0;
        const groupedCart = cart.reduce((acc, item) => {
            const key = `${item.name}-${item.price}`;
            if (!acc[key]) {
                acc[key] = { ...item, quantity: 0 };
            }
            acc[key].quantity += item.quantity;
            return acc;
        }, {});
        Object.values(groupedCart).forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const li = document.createElement('li');
            li.className = 'cart-item flex items-center justify-between flex-wrap gap-2';
            li.innerHTML = `
                <span class="flex-1">${item.name} x${item.quantity} - ${itemTotal.toFixed(2)}€</span>
                <div class="flex space-x-2">
                    <button class="cart-action-btn bg-green-500 text-white" onclick="addCartItem('${item.name}', ${item.price})"><i class="fas fa-plus"></i></button>
                    <button class="cart-action-btn bg-yellow-500 text-white" onclick="decreaseCartItem('${item.name}', ${item.price})"><i class="fas fa-minus"></i></button>
                    <button class="cart-action-btn bg-red-500 text-white" onclick="removeCartItem('${item.name}', ${item.price})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsList.appendChild(li);
        });
        cartTotal.textContent = `Total: ${total.toFixed(2)}€`;
    }

    // Ajouter une unité dans la commande
    window.addCartItem = function(name, price) {
        cart.push({ name, price, quantity: 1 });
        updateCart();
    };

    // Diminuer une unité dans la commande
    window.decreaseCartItem = function(name, price) {
        const index = cart.findIndex(item => item.name === name && item.price === price);
        if (index !== -1 && cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    };

    // Supprimer un article de la commande
    window.removeCartItem = function(name, price) {
        cart = cart.filter(item => !(item.name === name && item.price === price));
        updateCart();
    };

    // Passer la commande
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Votre commande est vide !');
        } else {
            alert(`Commande passée ! Total: ${cartTotal.textContent}`);
            cart = [];
            updateCart();
            cartModal.classList.add('hidden');
            cartModal.classList.remove('show');
        }
    });

    // Bouton pour ouvrir la commande
    const openCartBtn = document.createElement('button');
    openCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Voir Commande';
    openCartBtn.className = 'open-cart-btn';
    openCartBtn.onclick = () => {
        updateCart();
        cartModal.classList.remove('hidden');
        cartModal.classList.add('show');
    };
    document.body.appendChild(openCartBtn);

    // Fermer la commande
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.add('hidden');
        cartModal.classList.remove('show');
    });

    // Fonctionnalité plein écran
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Erreur en passant en plein écran: ${err.message}`);
            });
            fullscreenBtn.classList.add('fullscreen');
        } else {
            document.exitFullscreen();
            fullscreenBtn.classList.remove('fullscreen');
        }
    });

    // Fonctionnalité son
    muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.classList.toggle('muted');
    });

    window.openModal = function(src, alt) {
        modalImage.src = src;
        modalImage.alt = alt;
        modal.classList.remove('hidden');
        modal.classList.add('show');
    };

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
        modalImage.src = '';
        modalImage.alt = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('show');
            modalImage.src = '';
            modalImage.alt = '';
        }
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
            cartModal.classList.remove('show');
        }
    });
});