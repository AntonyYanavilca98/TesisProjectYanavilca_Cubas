const { isAuthenticated } = require('../authenticacion/authenticacion');
const express = require('express');
const Producto = require('../models/productos');
const Comentario = require('../models/comentarios');
const upload = require('../service/file-upload');
const router = express.Router();



//  ------------PRODUCTOS-------------



//Obtener listado de productos

router.get('/productos', isAuthenticated, async(req, res, next) => {
    let data = await Producto.find();
    res.render('productos', { data });
});

//Obtener listado por termino
router.get('/productos/buscar', isAuthenticated, async(req, res, next) => {
    let termino = req.query.busqueda;
    // let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    let data = await Producto.find({ nombre: regex });
    console.log(data);
    console.log('query', termino);
    res.render('prodtermino', { data });
});

//Editar producto
router.get('/producto/edit/:id', isAuthenticated, async(req, res, next) => {
    let id = req.params.id;
    let data = await Producto.findById(id);
    res.render('productoedit', { data });
});
router.post('/producto/edit/:id', isAuthenticated, (req, res, next) => {
    let singleUpload = upload.single('image');
    singleUpload(req, res, (err) => {
        if (err) {
            return console.log(err);
        }
        let id = req.params.id;
        let body = req.body;
        Producto.findById(id, (err, prodencontrado) => {
            if (err) return console.log(err);
            let Files = req.file;
            let filePath = req.file.key;

            console.log('ESTE ES EL PATH:', Files);
            let fileSplit = filePath.split('\.');


            console.log("Este es el path", filePath);

            console.log(fileSplit);

            let fileName = fileSplit[0];

            console.log('File name:', fileName);
            prodencontrado.nombre = body.nombre;
            prodencontrado.descripcion = body.descripcion;
            prodencontrado.precio = body.precio;
            prodencontrado.stock = body.stock;
            prodencontrado.estado = body.estado;
            prodencontrado.image = fileName;
            prodencontrado.ruta = filePath;


            prodencontrado.save();
            res.redirect('/productos');
        });

    });
});
// --------------------------


// Agregar un producto
router.get('/addprod', isAuthenticated, (req, res, next) => {
    res.render('addprod');
});


router.post('/addproducto', isAuthenticated, async(req, res, next) => {
    let body = req.body;
    let producto = new Producto();
    producto.nombre = body.nombre;
    producto.descripcion = body.descripcion;
    producto.usuario = req.user._id;
    producto.precio = body.precio;
    producto.stock = body.stock;
    producto.estado = body.estado;
    producto.image = null;
    producto.ruta = null;
    producto.medida.de = null;
    producto.medida.hasta = null;
    producto.color = null;
    producto.talla = null;
    let id = producto._id;
    await producto.save();
    res.redirect(`/addprod2/${id}`)
        // res.redirect('/productos');
});


router.get('/addprod2/:id', isAuthenticated, async(req, res, next) => {
    let id = req.params.id;
    let data = await Producto.findById(id);
    res.render('addprod2', { data });
});

router.post('/addprod2/:id', isAuthenticated, (req, res, next) => {
    let singleUpload = upload.single('image');
    singleUpload(req, res, (err) => {
        if (err) return res.json({ ok: false, err });
        let id = req.params.id;
        let body = req.body;
        Producto.findById(id, (err, prodencontrado) => {
            if (err) {
                res.redirect('/productos');
                return console.log(err);
            }
            let Files = req.file;
            let filePath = req.file.key;

            console.log('ESTE ES EL PATH:', Files);
            let fileSplit = filePath.split('\.');


            console.log("Este es el path", filePath);

            console.log(fileSplit);

            let fileName = fileSplit[0];

            console.log('File name:', fileName);
            prodencontrado.medida.de = body.de;
            prodencontrado.medida.hasta = body.hasta;
            prodencontrado.color = body.color;
            prodencontrado.talla = body.talla;
            prodencontrado.image = fileName;
            prodencontrado.ruta = filePath;


            prodencontrado.save();
            res.redirect('/productos');
        });

    });

});



router.get('/delprod/:id', isAuthenticated, async(req, res, next) => {
    let id = req.params.id;
    await Producto.remove({ _id: id });
    res.redirect('/productos');
});


// Ver Detalle y  (Editar) 
router.get('/producto/detalles/:id', isAuthenticated, async(req, res, next) => {
    let id = req.params.id;
    let data = await Producto.findById(id)
        .populate("usuario");

    let userPost = JSON.stringify(data.usuario._id);
    let usuario = JSON.stringify(req.user._id);

    console.log("usuarios id:", userPost);
    console.log("ID DE USUARIO", usuario);
    console.log('Estos son los datos', data);
    res.render('Detalles', { data, userPost, usuario });
});

// Comentarios y Comentar



router.post('/producto/comentarios/:id', isAuthenticated, async(req, res, next) => {
    let body = req.body;
    let id = req.params.id;
    let saveComentario = new Comentario();
    saveComentario.descripcion = body.descripcion;
    saveComentario.usuario = req.user;
    saveComentario.producto = id;
    // let idComentario = saveComentario._id;
    // Producto.findById(id, (err, comentarios) => {
    //     if (err) return console.log(err);
    //     comentarios.comentario = idComentario;
    //     comentarios.save();
    // });
    // console.log("Id de comentario:", idComentario);
    await saveComentario.save();
    res.redirect(`/producto/comentarios/${id}`);
});


router.get('/producto/comentarios/:id', isAuthenticated, async(req, res, next) => {
    let id = req.params.id;
    let data = await Producto.findById(id);
    let comment = await Comentario.find()
        .populate("usuario");
    let nombreUsuario = req.user.nombres;
    console.log("Nombre de Usuario:", nombreUsuario);
    res.render('Comentarios', { data, comment, id, nombreUsuario });
});




//  -------------------------

module.exports = router;