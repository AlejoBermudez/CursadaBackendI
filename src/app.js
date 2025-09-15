
const express = require('express');
const { Server } = require('socket.io');
const http = require('http'); 
const handlebars = require('express-handlebars');
const path = require('path');
const ProductManager = require('./dao/managers/ProductManager');
const productsRouter = require('./routes/api/products.router.js');
const cartsRouter = require('./routes/api/carts.router.js');
const cartsViewRouter = require('./routes/views/carts.view.router');


const app = express();
const server = http.createServer(app); 
const io = new Server(server); 
const connectDB = require ('./config/mongodb.config.js')
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

async function startServer() {
    try {
        await connectDB(); 

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static(path.join(__dirname, 'public')));
        
        // Rutas de la API
        app.use('/api/products', productsRouter);
        app.use('/api/carts', cartsRouter);
        app.use('/carts', cartsViewRouter);

        // Rutas de las vistas
        app.get('/', (req, res) => {
            res.render('index', { message: 'Bienvenido a mi Tienda Online' });
        }); 
        app.get('/realtimeproducts', (req, res) => {
            res.render('realtimeProducts');
        });

        // WebSockets
        io.on('connection', async (socket) => {
            console.log('Nuevo cliente conectado');
            const products = await ProductManager.getProducts({}, { limit: 10, page: 1, lean: true });
            socket.emit('updateProducts', products.docs);
        });

        // Inicia el servidor
        server.listen(8080, () => {
            console.log('Servidor escuchando en el puerto 8080');
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1); 
    }
}

startServer();