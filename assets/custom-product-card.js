if (!customElements.get('custom-product-card')) {
  customElements.define(
    'custom-product-card',
    class CustomProductCard extends HTMLElement {
      constructor() {
        super();
        this.init();
      }

      init() {
        this.addEventListener('click', this.handleClick.bind(this));
      }

      handleClick(event) {
        if (!event.target.classList.contains('option-button')) return;

        const variantId = event.target.getAttribute('data-variant-id');
        if (!variantId) return;

        this.addToCart(variantId);
      }

      addToCart(variantId) {
        const cartNotification = document.querySelector('cart-notification') || document.querySelector('cart-drawer');

        fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: variantId,
            quantity: 1,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Trigger cart notification if it exists
            if (cartNotification) {
              cartNotification.renderContents(data);
            } else {
              alert('Added to cart successfully!');
            }
          })
          .catch((error) => {
            console.error('Error adding to cart:', error);
            const errorMessage = document.createElement('span');
            errorMessage.textContent =
              window.translations.addToCartError || 'There was an error adding the item to your cart.';

            if (cartNotification) {
              cartNotification.renderContents(errorMessage);
            } else {
              alert(errorMessage.textContent);
            }
          });
      }
    }
  );
}
