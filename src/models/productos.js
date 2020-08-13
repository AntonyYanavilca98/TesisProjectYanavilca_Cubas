const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        require: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    usuario: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    CreateAt: {
        type: Date,
        default: Date.now()
    },
    image: String,
    ruta: String,
});


module.exports = mongoose.model('Producto', ProductoSchema);