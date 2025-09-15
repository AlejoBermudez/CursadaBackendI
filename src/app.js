
const express = require('express');
const { Server } = require('socket.io');
const http = require('http'); // Importamos el módulo http
const handlebars = require('express-handlebars');
const path = require('path');
const ProductManager = require('./dao/managers/ProductManager'); // Asegúrate de que la ruta sea correcta
const productsRouter = require('./routes/api/products.router.js');
const cartsRouter = require('./routes/api/carts.router.js');
const cartsViewRouter = require('./routes/views/carts.view.router');


const app = express();
const server = http.createServer(app); // Creamos un servidor http
const io = new Server(server); // Creamos el servidor de WebSockets sobre el servidor http
const connectDB = require ('./config/mongodb.config.js')
// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middlewares
async function startServer() {
    try {
        await connectDB(); // Esperamos a que la base de datos se conecte

        // Middlewares
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static(path.join(__dirname, 'public')));
        
        // Rutas de la API
        app.use('/api/products', productsRouter);
        app.use('/api/carts', cartsRouter);
        app.use('/carts', cartsViewRouter);
        
        // Rutas de las vistas
        app.get('/realtimeproducts', (req, res) => {
            res.render('realtimeProducts');
        });

        // WebSockets
        io.on('connection', async (socket) => {
            console.log('Nuevo cliente conectado');
            const products = await ProductManager.getProducts({}, { limit: 10, page: 1, lean: true });
            socket.emit('updateProducts', products.docs);
        });

        // Inicia el servidor solo después de la conexión exitosa a la DB
        server.listen(8080, () => {
            console.log('Servidor escuchando en el puerto 8080');
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1); // Salir si hay un error
    }
}

startServer();