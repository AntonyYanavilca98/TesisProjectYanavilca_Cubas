const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let valoresValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} No es un rol valido'
};


let usuarioSchema = new Schema({
    nombres: {
        type: String
    },
    apellidos: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: valoresValidos
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    //
    image: String,
    ruta: String
});

// usuarioSchema.methods.bcrypt = (password) => {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// };


usuarioSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
};



module.exports = mongoose.model('Usuario', usuarioSchema);