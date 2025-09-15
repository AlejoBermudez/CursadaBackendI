const ProductModel = require('../../models/product.model');

class ProductManager {
    constructor() {}

    async getProducts(filter, options) {
        try {
            return await ProductModel.paginate(filter, options);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw new Error('Error al obtener productos de la base de datos');
        }
    }

    async addProduct(newProduct) {
        try {
            return await ProductModel.create(newProduct);
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw new Error('Error al crear producto en la base de datos');
        }
    }

    async updateProduct(pid, updatedProduct) {
        try {
            return await ProductModel.findByIdAndUpdate(pid, updatedProduct, { new: true });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw new Error('Error al actualizar producto en la base de datos');
        }
    }

    async deleteProduct(pid) {
        try {
            return await ProductModel.findByIdAndDelete(pid);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw new Error('Error al eliminar producto de la base de datos');
        }
    }

    async findByIdAndUpdate(pid, updatedProduct) {
        try {
            return await ProductModel.findByIdAndUpdate(pid, updatedProduct, { new: true });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw new Error('Error al actualizar producto en la base de datos');
        }
    }

    async findByIdAndDelete(pid) {
        try {
            return await ProductModel.findByIdAndDelete(pid);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw new Error('Error al eliminar producto de la base de datos');
        }
    }
}

module.exports = new ProductManager();