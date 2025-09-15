
const { Router } = require('express');
const CartManager = require('../../dao/managers/CartManager');

const router = Router();
const cartManager = new CartManager();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.render('cart', { error: 'Carrito no encontrado' });
        }
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).render('error', { message: 'Error al obtener el carrito' });
    }
});

module.exports = router;