const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ComentarioSchema = new Schema({

    descripcion: {
        type: String,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },
    CreateAt: {
        type: String
    },
    hora: {
        type: String
    }
});

module.exports = mongoose.model('Comentario', ComentarioSchema);