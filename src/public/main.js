document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const productId = event.target.dataset.productId;
                const cartId = '68c4de40738a9aa080cebeb3';

                try {
                    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ quantity: 1 }) 
                    });

                    const data = await response.json();
                    if (data.status === 'success') {
                        alert('Producto añadido al carrito!');
                       
                    } else {
                        alert('Error al añadir producto: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Hubo un error al conectar con el servidor.');
                }
            });
        });
    }

    const removeProductButtons = document.querySelectorAll('.remove-from-cart-btn');
    if (removeProductButtons) {
        removeProductButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const cartId = event.target.dataset.cartId;
                const productId = event.target.dataset.productId;

                if (!cartId || !productId) {
                    alert('Datos de carrito o producto incompletos para eliminar.');
                    return;
                }

                if (!confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
                    return; 
                }

                try {
                    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                        method: 'DELETE'
                    });

                    const data = await response.json();
                    if (data.status === 'success') {
                        alert('Producto eliminado del carrito!');
                        
                        location.reload();
                    } else {
                        alert('Error al eliminar producto: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Hubo un error al conectar con el servidor.');
                }
            });
        });
    }

    
    const clearCartButton = document.querySelector('.clear-cart-btn');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', async (event) => {
            const cartId = event.target.dataset.cartId;

            if (!cartId) {
                alert('ID de carrito no encontrado para vaciar.');
                return;
            }

            if (!confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
                return; 
            }

            try {
                const response = await fetch(`/api/carts/${cartId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();
                if (data.status === 'success') {
                    alert('Carrito vaciado completamente!');
                    
                    location.reload();
                } else {
                    alert('Error al vaciar carrito: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al conectar con el servidor.');
            }
        });
    }

});