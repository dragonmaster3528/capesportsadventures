// Load shared header and footer
(function() {
    // Determine base path based on current location
    const basePath = window.location.pathname.includes('/pages/') ? '..' : '.';

    // Get current page name for active nav highlighting
    const currentPath = window.location.pathname;
    let currentPage = 'home';

    if (currentPath.includes('sports-tours')) currentPage = 'sports-tours';
    else if (currentPath.includes('events')) currentPage = 'events';
    else if (currentPath.includes('golf')) currentPage = 'golf';
    else if (currentPath.includes('fan-packages')) currentPage = 'fan-packages';
    else if (currentPath.includes('adventure')) currentPage = 'adventure';
    else if (currentPath.includes('tours')) currentPage = 'sports-tours';
    else if (currentPath === '/' || currentPath.includes('index')) currentPage = 'home';

    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('/includes/header.html')
            .then(response => response.text())
            .then(html => {
                headerPlaceholder.innerHTML = html;

                // Set active nav item
                const activeLink = document.querySelector(`[data-page="${currentPage}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.setAttribute('aria-current', 'page');
                    activeLink.style.backgroundColor = 'var(--primary-blue)';
                    activeLink.style.color = 'var(--text-light)';
                }

                // Re-initialize mobile menu toggle if main.js has already loaded
                if (typeof initializeMobileMenu === 'function') {
                    initializeMobileMenu();
                }
            })
            .catch(err => console.error('Error loading header:', err));
    }

    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('/includes/footer.html')
            .then(response => response.text())
            .then(html => {
                footerPlaceholder.innerHTML = html;
            })
            .catch(err => console.error('Error loading footer:', err));
    }
})();
