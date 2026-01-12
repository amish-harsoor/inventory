// Main entry point
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    loadData().then(() => {
        loadPage('items');
    });
});