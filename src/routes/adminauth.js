const { isAuthenticated, AuthAdmin_Role } = require('../authenticacion/authenticacion');
const express = require('express');
const Usuario = require('../models/usuario');
const Producto = require('../models/productos');
const Comentario = require('../models/comentarios');
const router = express.Router();


router.get('/admin_user', [isAuthenticated, AuthAdmin_Role], (req, res, next) => {
    Usuario.find((err, usuariosDB) => {
        if (err) return console.log(err);
        res.render('admin_user', { data: usuariosDB });
    });

});


router.get('/ver_perfil/:id', [isAuthenticated, AuthAdmin_Role], (req, res, next) => {
    let id = req.params.id;
    console.log("Esta es la id : ", id);
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) return console.log(err);
        res.render('ver_perfil', { data: usuarioDB });
    });
});

router.get('/eliminar/:id', [isAuthenticated, AuthAdmin_Role], async(req, res, next) => {
    var idUsuarioBorrar = req.params.id;
    // await Usuario.findByIdAndRemove({ _id: id });

    let productos = await Producto.find()
        .populate("usuario", "_id");
    let comentarios = await Comentario.find()
        .populate("usuario", "_id");
    for (var k = 0; k < productos.length; k++) {
        var idUsuarioObt = productos[k].usuario._id;

        if (JSON.stringify(idUsuarioObt) === JSON.stringify(idUsuarioBorrar)) {
            let idProdUsuario = productos[k]._id;
            // let productosBorrar = await Producto.findByIdAndRemove({ _id: idProdUsuario });
            // let UsuarioBorradoCompleto = await Usuario.findByIdAndRemove({ _id: idUsuarioBorrar });
            await Producto.findByIdAndRemove({ _id: idProdUsuario });
            // await Usuario.findByIdAndRemove({ _id: idUsuarioBorrar });
            // console.log("Productos a borrar", productosBorrar);
            // console.log("id Producto de Usuario a borrar", idProdUsuario);
            // console.log("Se borro este usuario", UsuarioBorradoCompleto._id);
            // console.log("Es verdadero");

        }
        // } else {
        //     await Usuario.findByIdAndRemove({ _id: idUsuarioBorrar });
        //     console.log("No se puede borrar");
        //     console.log("Falso");
        // }

        // console.log("ID DE USUARIO :", k, " ", idUsuarioObt);
    }

    for (var l = 0; l < comentarios.length; l++) {
        var idUsuarioObtC = comentarios[l].usuario._id;

        // console.log("Aqui usuario commetn:", idUsuarioObtC);

        if (JSON.stringify(idUsuarioObtC) === JSON.stringify(idUsuarioBorrar)) {
            let idCommentUsuario = comentarios[l]._id;
            await Comentario.findByIdAndRemove({ _id: idCommentUsuario });
            await Usuario.findByIdAndRemove({ _id: idUsuarioBorrar });
        }
    }

    await Usuario.findByIdAndRemove({ _id: idUsuarioBorrar });

    // console.log("Comentarios es:", comentarios);


    // console.log("AQUI SON LOS PRODUCTOS", productos);

    res.redirect('/admin/admin_user')
});


router.get('/buscar/usuario', [isAuthenticated, AuthAdmin_Role], async(req, res, next) => {
    let usuarios = req.query.busquedaU;

    let regex = new RegExp(usuarios, 'i');
    let data = await Usuario.find({ nombres: regex })

    res.render('SearchUsuario', { data, usuarios });


});




module.exports = router;