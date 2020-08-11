const { isAuthenticated, AuthAdmin_Role } = require('../authenticacion/authenticacion');
const express = require('express');
const Usuario = require('../models/usuario');
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




module.exports = router;