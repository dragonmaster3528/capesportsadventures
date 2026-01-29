// =============================================
// Itinerary Cart - "Add to My Itinerary" Feature
// =============================================

(function() {
    const STORAGE_KEY = 'capesports_itinerary';

    // Initialize cart from localStorage
    let cart = loadCart();

    function loadCart() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (e) {
            console.warn('Could not save itinerary:', e);
        }
    }

    // Generate unique ID for a card based on its content
    function generateCardId(card) {
        const title = card.querySelector('h3, h4, .event-card__title, .offering-card h4')?.textContent?.trim() || '';
        const page = window.location.pathname.split('/').pop().replace('.html', '');
        return btoa(encodeURIComponent(page + ':' + title)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
    }

    // Get card details for storage
    function getCardDetails(card) {
        const title = card.querySelector('h3, h4, .event-card__title')?.textContent?.trim() || 'Unknown Item';
        const price = card.querySelector('.event-card__price, .price-from, .price-range, .offering-meta span:last-child')?.textContent?.trim() || '';
        const page = window.location.pathname.split('/').pop().replace('.html', '');
        const pageNames = {
            'events': 'Sports Events',
            'sports-tours': 'Sports Tours',
            'golf': 'Golf',
            'fan-packages': 'Fan Packages',
            'adventure': 'Adventure'
        };

        return {
            id: generateCardId(card),
            title: title,
            price: price,
            page: pageNames[page] || page,
            pageUrl: window.location.pathname,
            addedAt: new Date().toISOString()
        };
    }

    // Check if item is in cart
    function isInCart(cardId) {
        return cart.some(item => item.id === cardId);
    }

    // Add item to cart
    function addToCart(card) {
        const details = getCardDetails(card);
        if (!isInCart(details.id)) {
            cart.push(details);
            saveCart();
            updateCartCount();
            showToast('Added to your itinerary!', 'success');
        }
        return details.id;
    }

    // Remove item from cart
    function removeFromCart(cardId) {
        cart = cart.filter(item => item.id !== cardId);
        saveCart();
        updateCartCount();
        showToast('Removed from your itinerary', 'info');
    }

    // Toggle item in cart
    function toggleCartItem(card, button) {
        const cardId = generateCardId(card);

        if (isInCart(cardId)) {
            removeFromCart(cardId);
            updateButtonState(button, false);
            card.classList.remove('in-itinerary');
        } else {
            addToCart(card);
            updateButtonState(button, true);
            card.classList.add('in-itinerary');
        }
    }

    // Update button visual state
    function updateButtonState(button, inCart) {
        if (inCart) {
            button.textContent = 'Remove from My Itinerary';
            button.classList.add('itinerary-btn--added');
        } else {
            button.textContent = 'Add to My Itinerary';
            button.classList.remove('itinerary-btn--added');
        }
    }

    // Update cart count badge in nav
    function updateCartCount() {
        const badge = document.querySelector('.itinerary-badge');
        if (badge) {
            const count = cart.length;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }

        // Also update panel if open
        renderPanelItems();
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.itinerary-toast').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = `itinerary-toast itinerary-toast--${type}`;
        toast.innerHTML = `
            <span class="itinerary-toast__icon">${type === 'success' ? '✓' : 'ℹ'}</span>
            <span class="itinerary-toast__message">${message}</span>
        `;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('itinerary-toast--visible'), 10);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('itinerary-toast--visible');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // Create nav itinerary icon
    function createNavIcon() {
        const navMenu = document.querySelector('.nav__menu');
        if (!navMenu) return;

        // Check if icon already exists
        if (document.querySelector('.itinerary-nav')) return;

        const navItem = document.createElement('li');
        navItem.className = 'itinerary-nav';
        navItem.innerHTML = `
            <button class="itinerary-nav__btn" aria-label="View my itinerary" title="My Itinerary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span class="itinerary-badge" style="display: none;">0</span>
            </button>
        `;

        navMenu.appendChild(navItem);

        // Add click handler
        navItem.querySelector('.itinerary-nav__btn').addEventListener('click', togglePanel);

        updateCartCount();
    }

    // Create slide-out panel
    function createPanel() {
        if (document.querySelector('.itinerary-panel')) return;

        const panel = document.createElement('div');
        panel.className = 'itinerary-panel';
        panel.innerHTML = `
            <div class="itinerary-panel__overlay"></div>
            <div class="itinerary-panel__content">
                <div class="itinerary-panel__header">
                    <h3>My Itinerary</h3>
                    <button class="itinerary-panel__close" aria-label="Close panel">&times;</button>
                </div>
                <div class="itinerary-panel__body">
                    <div class="itinerary-panel__items"></div>
                </div>
                <div class="itinerary-panel__footer">
                    <p class="itinerary-panel__summary"><span class="item-count">0</span> items selected</p>
                    <button class="itinerary-panel__submit btn btn--primary">Submit Inquiry</button>
                    <button class="itinerary-panel__clear btn btn--secondary">Clear All</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Event listeners
        panel.querySelector('.itinerary-panel__overlay').addEventListener('click', closePanel);
        panel.querySelector('.itinerary-panel__close').addEventListener('click', closePanel);
        panel.querySelector('.itinerary-panel__submit').addEventListener('click', submitInquiry);
        panel.querySelector('.itinerary-panel__clear').addEventListener('click', clearCart);

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('itinerary-panel--open')) {
                closePanel();
            }
        });
    }

    // Toggle panel open/close
    function togglePanel() {
        const panel = document.querySelector('.itinerary-panel');
        if (panel) {
            if (panel.classList.contains('itinerary-panel--open')) {
                closePanel();
            } else {
                openPanel();
            }
        }
    }

    // Open panel
    function openPanel() {
        const panel = document.querySelector('.itinerary-panel');
        if (panel) {
            panel.classList.add('itinerary-panel--open');
            document.body.style.overflow = 'hidden';
            renderPanelItems();
        }
    }

    // Close panel
    function closePanel() {
        const panel = document.querySelector('.itinerary-panel');
        if (panel) {
            panel.classList.remove('itinerary-panel--open');
            document.body.style.overflow = '';
        }
    }

    // Render items in panel
    function renderPanelItems() {
        const container = document.querySelector('.itinerary-panel__items');
        const countEl = document.querySelector('.itinerary-panel__summary .item-count');
        const submitBtn = document.querySelector('.itinerary-panel__submit');

        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="itinerary-panel__empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <p>Your itinerary is empty</p>
                    <span>Browse our experiences and add items you're interested in</span>
                </div>
            `;
            if (submitBtn) submitBtn.disabled = true;
        } else {
            container.innerHTML = cart.map(item => `
                <div class="itinerary-panel__item" data-id="${item.id}">
                    <div class="itinerary-panel__item-info">
                        <span class="itinerary-panel__item-page">${item.page}</span>
                        <h4 class="itinerary-panel__item-title">${item.title}</h4>
                        ${item.price ? `<span class="itinerary-panel__item-price">${item.price}</span>` : ''}
                    </div>
                    <button class="itinerary-panel__item-remove" data-id="${item.id}" aria-label="Remove item">&times;</button>
                </div>
            `).join('');

            // Add remove handlers
            container.querySelectorAll('.itinerary-panel__item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    removeFromCart(id);

                    // Update button on page if visible
                    document.querySelectorAll('.itinerary-btn').forEach(cardBtn => {
                        const card = cardBtn.closest('.event-card, .offering-card, .package-card, .activity-card, [class*="-card"]');
                        if (card && generateCardId(card) === id) {
                            updateButtonState(cardBtn, false);
                            card.classList.remove('in-itinerary');
                        }
                    });
                });
            });

            if (submitBtn) submitBtn.disabled = false;
        }

        if (countEl) countEl.textContent = cart.length;
    }

    // Clear all items
    function clearCart() {
        if (cart.length === 0) return;

        if (confirm('Remove all items from your itinerary?')) {
            cart = [];
            saveCart();
            updateCartCount();

            // Update all buttons on page
            document.querySelectorAll('.itinerary-btn').forEach(btn => {
                updateButtonState(btn, false);
                const card = btn.closest('.event-card, .offering-card, .package-card, .activity-card, [class*="-card"]');
                if (card) card.classList.remove('in-itinerary');
            });

            showToast('Itinerary cleared', 'info');
        }
    }

    // Submit inquiry
    function submitInquiry() {
        if (cart.length === 0) {
            showToast('Please add items to your itinerary first', 'info');
            return;
        }

        // Build message for contact form
        const itemsList = cart.map(item => `- ${item.title} (${item.page})${item.price ? ' - ' + item.price : ''}`).join('\n');
        const message = `I'm interested in the following items for my trip:\n\n${itemsList}\n\nPlease provide more information and help me build a custom package.`;

        // Store for contact form
        sessionStorage.setItem('itinerary_inquiry', JSON.stringify({
            items: cart,
            message: message
        }));

        // Close panel
        closePanel();

        // Navigate to contact form
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        const contactUrl = isHomePage ? '#contact' : '../index.html#contact';

        if (isHomePage) {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                prefillContactForm(message);
            }
        } else {
            // Store message and redirect
            sessionStorage.setItem('prefill_message', message);
            window.location.href = contactUrl;
        }
    }

    // Prefill contact form
    function prefillContactForm(message) {
        setTimeout(() => {
            const messageField = document.querySelector('#message, textarea[name="message"]');
            if (messageField) {
                messageField.value = message;
                messageField.focus();
            }
        }, 500);
    }

    // Check for prefill on page load (for redirects)
    function checkPrefill() {
        const message = sessionStorage.getItem('prefill_message');
        if (message) {
            sessionStorage.removeItem('prefill_message');
            prefillContactForm(message);
        }
    }

    // Add itinerary buttons to cards
    function addButtonsToCards() {
        // Select all card types across pages
        const cardSelectors = [
            '.event-card',
            '.offering-card',
            '.package-card',
            '.activity-card',
            '.course-card',
            '.clinic-card'
        ];

        const cards = document.querySelectorAll(cardSelectors.join(', '));

        cards.forEach(card => {
            // Skip if button already added
            if (card.querySelector('.itinerary-btn')) return;

            const cardId = generateCardId(card);
            const inCart = isInCart(cardId);

            // Create button container
            const btnContainer = document.createElement('div');
            btnContainer.className = 'itinerary-btn-container';

            const btn = document.createElement('button');
            btn.className = 'itinerary-btn' + (inCart ? ' itinerary-btn--added' : '');
            btn.textContent = inCart ? 'Remove from My Itinerary' : 'Add to My Itinerary';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCartItem(card, btn);
            });

            btnContainer.appendChild(btn);
            card.appendChild(btnContainer);

            // Mark card if in cart
            if (inCart) {
                card.classList.add('in-itinerary');
            }
        });
    }

    // Initialize
    function init() {
        createNavIcon();
        createPanel();
        addButtonsToCards();
        checkPrefill();

        // Re-add buttons when DOM changes (for dynamically loaded content)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    setTimeout(addButtonsToCards, 100);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
