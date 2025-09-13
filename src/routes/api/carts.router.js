const { Router } = require('express');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const router = Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await Cart.create({});
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Obtener un carrito por ID con populate
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).lean(); // .lean() para Handlebars
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Añadir un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        const productInCart = cart.products.find(p => p.product.toString() === pid);

        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        // Volver a poblar para la respuesta si es necesario, o la middleware ya lo hizo.
        const updatedCart = await Cart.findById(cid).lean();
        res.json({ status: 'success', payload: updatedCart });

    } catch (error) {
        console.error('Error al añadir producto al carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Actualizar todos los productos del carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const productsArray = req.body.products; // Espera un arreglo de { product: productId, quantity: number }

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = []; // Limpiar productos existentes
        for (const item of productsArray) {
            const productExists = await Product.findById(item.product);
            if (!productExists) {
                return res.status(404).json({ status: 'error', message: `Producto con ID ${item.product} no encontrado` });
            }
            cart.products.push({ product: item.product, quantity: item.quantity });
        }

        await cart.save();
        const updatedCart = await Cart.findById(cid).lean();
        res.json({ status: 'success', payload: updatedCart });

    } catch (error) {
        console.error('Error al actualizar el carrito con un arreglo de productos:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Actualizar SOLO la cantidad de ejemplares de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número positivo.' });
        }

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productInCart = cart.products.find(p => p.product.toString() === pid);

        if (!productInCart) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        productInCart.quantity = quantity;
        await cart.save();
        const updatedCart = await Cart.findById(cid).lean();
        res.json({ status: 'success', payload: updatedCart });

    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const initialLength = cart.products.length;
        cart.products = cart.products.filter(p => p.product.toString() !== pid);

        if (cart.products.length === initialLength) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        await cart.save();
        const updatedCart = await Cart.findById(cid).lean();
        res.json({ status: 'success', payload: updatedCart });

    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Eliminar TODOS los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = []; // Vaciar el array de productos
        await cart.save();
        const updatedCart = await Cart.findById(cid).lean();
        res.json({ status: 'success', payload: updatedCart });

    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});


module.exports = router;