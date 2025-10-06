window.onload = function () {
    generateGrid();
    generateButtons();
    const board = getBoardFromURL();
    prefillGrid(board);
};

// Mobile nav toggle: safe DOM queries and click-outside to close
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('open');
    };

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.classList.contains('active')) return;
        const target = e.target;
        if (!navLinks.contains(target) && !hamburger.contains(target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('open');
        }
    });
});
