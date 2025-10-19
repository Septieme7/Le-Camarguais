/* ==========================================================
    Fond animé doux et fluide - bgcanvas.js
    Optimisé pour le SEO et les performances
   ========================================================== */

class BackgroundAnimation {
    constructor() {
        this.canvas = document.getElementById("bgcanvas");
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext("2d");
        this.logos = [];
        this.isLoaded = false;
        
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        this.loadImage();
    }

    resizeCanvas() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        // Resize optimisé avec debounce
        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                this.repositionLogos();
            }, 250);
        });

        // Pause l'animation quand la page n'est pas visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.startAnimation();
            }
        });
    }

    loadImage() {
        this.logo = new Image();
        
        // Optimisation du chargement d'image
        this.logo.loading = 'lazy';
        this.logo.decoding = 'async';
        
        this.logo.onload = () => {
            this.isLoaded = true;
            this.createLogos();
            this.startAnimation();
        };
        
        this.logo.onerror = () => {
            console.warn('Logo de fond non chargé, utilisation de fallback');
            this.useFallbackAnimation();
        };
        
        this.logo.src = "assets/images/logo.png";
    }

    createLogos() {
        const NUM_LOGOS = 15;
        const MIN_SIZE = 5;
        const MAX_SIZE = 250;

        for (let i = 0; i < NUM_LOGOS; i++) {
            const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
            this.logos.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size,
                baseSize: size,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.2 + 0.05,
                pulse: Math.random() * Math.PI * 2,
            });
        }
    }

    repositionLogos() {
        this.logos.forEach(logo => {
            logo.x = Math.min(logo.x, this.width - logo.size);
            logo.y = Math.min(logo.y, this.height - logo.size);
        });
    }

    bounce(logo) {
        if (logo.x < 0 || logo.x + logo.size > this.width) logo.vx *= -1;
        if (logo.y < 0 || logo.y + logo.size > this.height) logo.vy *= -1;
    }

    detectCollisions() {
        for (let i = 0; i < this.logos.length; i++) {
            for (let j = i + 1; j < this.logos.length; j++) {
                const a = this.logos[i];
                const b = this.logos[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < (a.size + b.size) / 2) {
                    a.vx *= -1;
                    a.vy *= -1;
                    b.vx *= -1;
                    b.vy *= -1;
                }
            }
        }
    }

    animate() {
        if (!this.isLoaded || document.hidden) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.logos.forEach(logo => {
            // Déplacement
            logo.x += logo.vx;
            logo.y += logo.vy;
            this.bounce(logo);

            // Effet de respiration douce
            logo.pulse += 0.005;
            const scale = 1 + Math.sin(logo.pulse) * 0.1;
            const size = logo.baseSize * scale;
            const alpha = logo.opacity + Math.sin(logo.pulse) * 0.05;

            // Dessin avec optimisation
            this.ctx.globalAlpha = Math.max(0.02, Math.min(0.25, alpha));
            this.ctx.drawImage(this.logo, logo.x, logo.y, size, size);
        });

        this.detectCollisions();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        if (!this.animationFrame && this.isLoaded) {
            this.animate();
        }
    }

    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    useFallbackAnimation() {
        // Fallback simple si l'image ne charge pas
        console.log('Animation de fallback activée');
        this.isLoaded = true;
        this.createLogos();
        this.startAnimation();
    }

    // Nettoyage mémoire
    destroy() {
        this.stopAnimation();
        window.removeEventListener("resize", this.resizeCanvas);
    }
}

// Initialisation différée pour le SEO
document.addEventListener('DOMContentLoaded', () => {
    // Délai pour prioriser le contenu principal
    setTimeout(() => {
        new BackgroundAnimation();
    }, 1000);
});

// Export pour utilisation externe si nécessaire
window.BackgroundAnimation = BackgroundAnimation;