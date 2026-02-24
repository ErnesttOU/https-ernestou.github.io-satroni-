// ===== CONFIGURACIÓN (editá estos valores) =====
const whatsappNumber = "+595971636747"; // ← Cambiá por tu número real

// ===== WHATSAPP BUTTONS =====
document.querySelectorAll('.whatsapp').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const message = encodeURIComponent(this.dataset.message);
        window.open(`https://wa.me/${+595971636747}?text=${message}`, '_blank');
    });
});

// ===== TOGGLE NIGHT MODE =====
const toggleBtn = document.getElementById('toggle-theme');
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('night-mode');
    toggleBtn.textContent = document.body.classList.contains('night-mode') ? '☀️' : '🌙';
});

// ===== MODAL (descripción del producto) =====
const modal   = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalSpecs = document.getElementById('modal-specs');
const closeBtn   = document.getElementById('close-modal');

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
        // No abrir modal si se hizo clic en el botón de WhatsApp
        if (e.target.closest('.whatsapp')) return;

        const specs = card.getAttribute('data-specs');
        if (!specs) return;

        modalTitle.innerText = card.querySelector('h3').innerText;
        modalSpecs.innerText = specs;
        modal.classList.add('active');
    });
});

closeBtn.addEventListener('click', () => modal.classList.remove('active'));

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

// ===== ACCORDION =====
document.querySelectorAll('.accordion h3').forEach(item => {
    item.addEventListener('click', () => {
        const content = item.nextElementSibling;
        const isOpen  = content.style.display === 'block';

        // Cerrar todos
        document.querySelectorAll('.accordion .content').forEach(c => c.style.display = 'none');
        document.querySelectorAll('.accordion h3').forEach(h => h.setAttribute('aria-expanded', 'false'));

        // Abrir el clickeado si estaba cerrado
        if (!isOpen) {
            content.style.display = 'block';
            item.setAttribute('aria-expanded', 'true');
        }
    });
});