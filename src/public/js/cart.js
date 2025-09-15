// src/public/js/cart.js
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-container');
    const emptyCartBtn = document.getElementById('emptyCartBtn');
    const removeProductBtns = document.querySelectorAll('.remove-product-btn');
    const cartId = cartContainer ? cartContainer.getAttribute('data-cart-id') : null;

    if (emptyCartBtn && cartId) {
        emptyCartBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/carts/${cartId}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                console.log('Carrito vaciado:', result);
                alert('El carrito ha sido vaciado.');
                window.location.reload();
            } catch (error) {
                console.error('Error al vaciar el carrito:', error);
            }
        });
    }

    if (removeProductBtns.length > 0 && cartId) {
        removeProductBtns.forEach(btn => {
            btn.addEventListener('click', async (event) => {
                const productId = event.target.getAttribute('data-product-id');
                try {
                    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                        method: 'DELETE'
                    });
                    const result = await response.json();
                    console.log('Producto eliminado:', result);
                    alert('Producto eliminado del carrito.');
                    window.location.reload();
                } catch (error) {
                    console.error('Error al eliminar producto:', error);
                }
            });
        });
    }
});