const express = require('express');
const handlebars = require('express-handlebars');
const connectDB = require('./config/mongodb.config');
require('dotenv').config();

const app = express();
const PORT = 8080;

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Importar rutas
const productsApiRouter = require('./routes/api/products.router');
const cartsApiRouter = require('./routes/api/carts.router');
const productsViewRouter = require('./routes/views/products.view.router');
const cartsViewRouter = require('./routes/views/carts.view.router');

// Rutas de la API
app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);

// Rutas de las vistas
app.use('/products', productsViewRouter);
app.use('/cart', cartsViewRouter);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});