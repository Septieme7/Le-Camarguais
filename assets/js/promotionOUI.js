document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const muteBtn = document.getElementById('muteBtn');
    const audio = document.getElementById('bgAudio');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModalBtn = document.getElementById('closeModal');

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

    // Gestion de la modale d'image
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
});