
const socket = io();
const cartLink = document.getElementById('cartLink');
const createCartBtn = document.getElementById('createCartBtn');

document.addEventListener('DOMContentLoaded', () => {
    const storedCartId = localStorage.getItem('cartId');
    if (storedCartId) {
        if (createCartBtn) createCartBtn.disabled = true;
        console.log(`Carrito cargado desde localStorage: ${storedCartId}`);
    } else {
    }
});

createCartBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/carts', { method: 'POST' });
        const result = await response.json();
        if (result.status === 'success') {
            const newCartId = result.payload._id;
            localStorage.setItem('cartId', newCartId); 
            alert(`Carrito creado con ID: ${newCartId}`);
            createCartBtn.disabled = true;
            console.log('Carrito creado:', result.payload);
        }
    } catch (error) {
        console.error('Error al crear el carrito:', error);
    }
});


cartLink.addEventListener('click', (event) => {
    event.preventDefault();
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
        window.location.href = `/carts/${cartId}`;
    } else {
        alert('Por favor, crea un carrito primero.');
    }
});

socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = '<li>No hay productos disponibles.</li>';
    } else {
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${product.title} - $${product.price}
                <button class="add-to-cart-btn" data-product-id="${product._id}">Agregar al Carrito</button>
            `;
            productList.appendChild(li);
        });
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        const storedCartId = localStorage.getItem('cartId');

        addToCartBtns.forEach(btn => {
            if (!storedCartId) {
                btn.disabled = true;
            }

            btn.addEventListener('click', async (event) => {
                const cartId = localStorage.getItem('cartId');
                if (!cartId) {
                    alert('Por favor, crea un carrito primero.');
                    return;
                }

                const productId = event.target.getAttribute('data-product-id');
                try {
                    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                        method: 'POST'
                    });
                    const result = await response.json();
                    console.log('Producto agregado al carrito:', result);
                    alert('Producto agregado al carrito!');
                } catch (error) {
                    console.error('Error al agregar producto al carrito:', error);
                    alert('Error al agregar el producto.');
                }
            });
        });
    }
});