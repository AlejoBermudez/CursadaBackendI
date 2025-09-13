const { Router } = require('express');
const Cart = require('../../models/cart.model');

const router = Router();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).lean(); // .lean() para Handlebars
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }

        res.render('cart', { cart });

    } catch (error) {
        console.error('Error al obtener el carrito para la vista:', error);
        res.status(500).render('error', { message: 'Error al cargar el carrito.' });
    }
});

module.exports = router;