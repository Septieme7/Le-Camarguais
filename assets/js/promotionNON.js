document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const muteBtn = document.getElementById('muteBtn');
    const audio = document.getElementById('bgAudio');
    const promoDate = document.getElementById('promoDate');

    // Afficher la date actuelle
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    promoDate.textContent = `Vérifié le ${formattedDate}`;

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
});