/* ==========================================================
    Fond animé doux et fluide - bgcanvas.js
   ========================================================== */

const canvas = document.getElementById("bgcanvas");
const ctx = canvas.getContext("2d");

let width, height;
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Image utilisée
const logo = new Image();
logo.src = "assets/images/logo.png";

// Configuration
const NUM_LOGOS = 15; // 🟢 plus de logos identiques
const logos = [];
const MIN_SIZE = 5;
const MAX_SIZE = 250;

// Création des objets logos
function createLogos() {
    for (let i = 0; i < NUM_LOGOS; i++) {
        const size = Math.random() * (MAX_SIZE + MIN_SIZE) + MIN_SIZE;
        logos.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        baseSize: size,
        vx: (Math.random() - 0.5) * 0.3, // vitesse douce
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.2 + 0.05, // opacité légère
        pulse: Math.random() * Math.PI * 2, // phase aléatoire
        });
    }
}

// Rebond sur les bords
function bounce(l) {
    if (l.x < 0 || l.x + l.size > width) l.vx *= -1;
    if (l.y < 0 || l.y + l.size > height) l.vy *= -1;
}

// Détection simple des collisions (rebond doux)
function detectCollisions() {
    for (let i = 0; i < logos.length; i++) {
        for (let j = i + 1; j < logos.length; j++) {
        const a = logos[i];
        const b = logos[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < (a.size + b.size) / 2) {
            // inversion douce des vitesses
            a.vx *= -1;
            a.vy *= -1;
            b.vx *= -1;
            b.vy *= -1;
        }
        }
    }
}

// Animation principale
function animate() {
    ctx.clearRect(0, 0, width, height);

    logos.forEach((l) => {
        // Déplacement
        l.x += l.vx;
        l.y += l.vy;
        bounce(l);

        // Effet de respiration douce
        l.pulse += 0.005;
        const scale = 1 + Math.sin(l.pulse) * 0.1;
        const size = l.baseSize * scale;
        const alpha = l.opacity + Math.sin(l.pulse) * 0.05;

        // Dessin
        ctx.globalAlpha = alpha;
        ctx.drawImage(logo, l.x, l.y, size, size);
    });

    detectCollisions();
    requestAnimationFrame(animate);
}

logo.onload = () => {
    createLogos();
    animate();
};
