const { Router } = require('express');
const Product = require('../../models/product.model');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true // Importante para pasar objetos a Handlebars
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

        const productsData = await Product.paginate(filter, options);

        // Construir links para paginación
        const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split('?')[0];
        const buildLink = (pageNumber) => {
            const queryParams = new URLSearchParams(req.query);
            queryParams.set('page', pageNumber);
            return `${baseUrl}?${queryParams.toString()}`;
        };

        const { docs, totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage } = productsData;

        res.render('products', {
            products: docs,
            totalPages,
            prevPage,
            nextPage,
            currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? buildLink(prevPage) : null,
            nextLink: hasNextPage ? buildLink(nextPage) : null,
            // Puedes pasar los query params para mantener los filtros en los links
            currentLimit: limit,
            currentSort: sort,
            currentQuery: query
        });

    } catch (error) {
        console.error('Error al obtener productos para la vista:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos.' });
    }
});

module.exports = router;