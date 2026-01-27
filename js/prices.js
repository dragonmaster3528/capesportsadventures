/**
 * Price Loader for Cape Sports Adventures
 * Loads prices from /data/prices.json and updates elements with data-price attributes
 */

(function() {
    'use strict';

    // Determine base path based on current page location
    const isInPagesDir = window.location.pathname.includes('/pages/');
    const basePath = isInPagesDir ? '..' : '.';

    // Load and apply prices when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        loadPrices();
    });

    async function loadPrices() {
        try {
            const response = await fetch(`${basePath}/data/prices.json`);
            if (!response.ok) throw new Error('Failed to load prices');
            const prices = await response.json();
            applyPrices(prices);
        } catch (error) {
            console.warn('Price loader: Could not load prices.json, using default values.', error);
        }
    }

    function applyPrices(prices) {
        // Find all elements with data-price attribute
        const priceElements = document.querySelectorAll('[data-price]');

        priceElements.forEach(el => {
            const pricePath = el.dataset.price;
            const prefix = el.dataset.pricePrefix || '';
            const suffix = el.dataset.priceSuffix || '';

            const price = getNestedValue(prices, pricePath);
            if (price) {
                el.textContent = prefix + price + suffix;
            }
        });
    }

    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }
})();
