const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://aebmbu:190919vj@cluster0.px7qdwa.mongodb.net/?retryWrites=true&w=majority&appName=Entrega3");
        console.log('Conexión a "MongoDB exitosa');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1); 
    }
};

module.exports = connectDB;