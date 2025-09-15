const CartModel = require('../../models/cart.model');

class CartManager {
    constructor() {}

    async createCart() {
        try {
            return await CartModel.create({ products: [] });
        } catch (error) {
            console.error('Error al crear un carrito:', error);
            throw new Error('Error al crear el carrito en la base de datos');
        }
    }

    async getCartById(cartId) {
        try {
            return await CartModel.findById(cartId).populate('products.product').lean();
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw new Error('Error al obtener el carrito de la base de datos');
        }
    }

    async addProductToCart(cartId, productId) {
        try {
        
            const cart = await this.getCartById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            
            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

            if (productIndex > -1) {
                
                cart.products[productIndex].quantity++;
            } else {
               
                cart.products.push({ product: productId, quantity: 1 });
            }

           
            await CartModel.updateOne({ _id: cartId }, { products: cart.products });

            
            return await this.getCartById(cartId);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw new Error('Error al agregar producto al carrito');
        }
    }
    
    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

            if (productIndex > -1) {
                cart.products.splice(productIndex, 1);
                await CartModel.updateOne({ _id: cartId }, { products: cart.products });
                return await this.getCartById(cartId);
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }

        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            throw new Error('Error al eliminar producto del carrito');
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            
            cart.products = [];
            await CartModel.updateOne({ _id: cartId }, { products: [] });
            return await this.getCartById(cartId);
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw new Error('Error al vaciar el carrito');
        }
    }
}

module.exports = CartManager;