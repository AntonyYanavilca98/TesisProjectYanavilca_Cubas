const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const upload = require('../service/file-upload');
const { isAuthenticated } = require('../authenticacion/authenticacion');



// Editando y cambiando imagen
router.get('/editar/profile/:id', isAuthenticated, async(req, res, next) => {
    let id = req.params.id;
    let data = await Usuario.findById(id);
    res.render('editprofile', { data });

});

// Editando Perfil de usuario
router.post('/editar/profile/:id', isAuthenticated, (req, res, next) => {
    let singleUpload = upload.single('image');
    singleUpload(req, res, (err) => {
        if (err) {
            return console.log(err);
        }
        let id = req.params.id;
        let body = req.body;
        Usuario.findById(id, (err, encontrado) => {
            if (err) return console.log(err);
            let Files = req.file;
            let filePath = req.file.key;

            console.log('ESTE ES EL PATH:', Files);
            let fileSplit = filePath.split('\.');


            console.log("Este es el path", filePath);

            console.log(fileSplit);

            let fileName = fileSplit[0];

            console.log('File name:', fileName);
            encontrado.nombres = body.nombres;
            encontrado.apellidos = body.apellidos;
            encontrado.email = body.email;
            encontrado.image = fileName;
            encontrado.ruta = filePath;
            encontrado.save();
            res.redirect('/profile')

        });


        // let fileSplit = filePath.split('\.');


        // console.log("Este es el path", filePath);

        // console.log(fileSplit);

        // let fileName = fileSplit[0];

        // console.log('File name:', fileName);

        // Usuario.findByIdAndUpdate(id, { image: fileName, ruta: filePath }, { new: true }, (err, userImage) => {
        //     if (err) return console.log(err);
        //     console.log("Esta es la imagen", userImage);
        //     console.log('body es:', body);

        // });


        // Usuario.findByIdAndUpdate(id, { nombres: body }, { new: true }, (err, userActualizado) => {
        //     if (err) return console.log(err);
        //     console.log(userActualizado);
        //     return res.redirect('/profile');

        // });
    });
    // let body = req.body;
    // console.log("Aquuiiiiii:", body);
    // let data = Usuario.findById(id, (err, ));
});


module.exports = router;