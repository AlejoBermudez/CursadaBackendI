const { Router } = require('express');
const Product = require('../../models/product.model');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true // Para que Handlebars pueda renderizar los objetos
        };

        const filter = {};
        if (query) {
            filter.$or = [
                { category: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } }
            ];
        }

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const products = await Product.paginate(filter, options);

        res.json({ status: 'success', payload: products });

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const product = await Product.create(newProduct);
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = req.body;
        const product = await Product.findByIdAndUpdate(pid, updatedProduct, { new: true });
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', payload: product });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findByIdAndDelete(pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});


module.exports = router;