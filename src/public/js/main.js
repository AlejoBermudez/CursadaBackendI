document.addEventListener('DOMContentLoaded', async () => {
    // Código para agregar productos al carrito
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

    // Código para eliminar productos del carrito
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

    // Código para vaciar el carrito
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

    // Código para el formulario de filtrado
    const filterForm = document.querySelector('#filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const limit = document.querySelector('#limit').value;
            const sort = document.querySelector('#sort').value;
            const query = document.querySelector('#query').value;

            // La URL y la petición fetch están aquí, donde `limit`, `sort`, y `query` existen
            const url = `/api/products?limit=${limit}&sort=${sort}&query=${query}`;
            
            try {
                const response = await fetch(url);
                const data = await response.json(); 
                
                console.log(data);
                
                const productListContainer = document.querySelector('#products-list-container');
                if (productListContainer) {
                    productListContainer.innerHTML = '';
                    
                  if (data.payload.docs && data.payload.docs.length > 0) {
            data.payload.docs.forEach(product => {
                const productElement = document.createElement('div');
                // Asegúrate de que las propiedades del producto (title, price, etc.) sean correctas
                productElement.innerHTML = `
                    <h3>${product.title}</h3>
                    <p>Precio: $${product.price}</p>
                    <p>Categoría: ${product.category}</p>
                    <button class="add-to-cart-btn" data-product-id="${product._id}">Agregar al carrito</button>
                `;
                productListContainer.appendChild(productElement);
            });
        } else {
            productListContainer.textContent = 'No se encontraron productos.';
        }
    }

} catch (error) {
    console.error('Error al filtrar productos:', error);
}
        });
    }
});