document.addEventListener('DOMContentLoaded', () => {
    // Función para agregar al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const productId = event.target.dataset.productId;
                // Asume un carrito con ID fijo para pruebas, o consíguelo de alguna manera (localStorage, session, user profile)
                // ¡IMPORTANTE!: En una aplicación real, el ID del carrito debería ser dinámico y estar asociado a la sesión/usuario.
                // Por ahora, usaremos un ID de ejemplo o uno que crees manualmente en MongoDB.
                const cartId = '6659f8a3c896940d9d6e81f1'; // <-- ¡CAMBIA ESTO POR UN ID DE CARRITO REAL QUE EXISTA EN TU DB!

                try {
                    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ quantity: 1 }) // Puedes modificar la cantidad si lo necesitas
                    });

                    const data = await response.json();
                    if (data.status === 'success') {
                        alert('Producto añadido al carrito!');
                        // Opcional: actualizar la interfaz de usuario para reflejar el cambio
                        // Por ejemplo, podrías hacer una pequeña animación o actualizar un contador del carrito.
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

    // Función para eliminar un producto del carrito
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
                    return; // El usuario canceló la eliminación
                }

                try {
                    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                        method: 'DELETE'
                    });

                    const data = await response.json();
                    if (data.status === 'success') {
                        alert('Producto eliminado del carrito!');
                        // Recargar la página para actualizar la vista del carrito
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

    // Función para vaciar el carrito completamente
    const clearCartButton = document.querySelector('.clear-cart-btn');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', async (event) => {
            const cartId = event.target.dataset.cartId;

            if (!cartId) {
                alert('ID de carrito no encontrado para vaciar.');
                return;
            }

            if (!confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
                return; // El usuario canceló la acción
            }

            try {
                const response = await fetch(`/api/carts/${cartId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();
                if (data.status === 'success') {
                    alert('Carrito vaciado completamente!');
                    // Recargar la página para mostrar el carrito vacío
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