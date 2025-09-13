const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
});

// Middleware para populate automático en find
cartSchema.pre('findOne', function(next) {
    this.populate('products.product');
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;