const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ComentarioSchema = new Schema({

    descripcion: {
        type: String,
        required: true
    },
    usuario: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    producto: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    }]
});

module.exports = mongoose.model('Comentario', ComentarioSchema);