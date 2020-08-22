const { isAuthenticated } = require('../authenticacion/authenticacion');
const express = require('express');
const Producto = require('../models/productos');
const Comentario = require('../models/comentarios');
const Usuario = require('../models/usuario');
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
    let date = new Date()

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let producto = new Producto();
    producto.nombre = body.nombre;
    producto.descripcion = body.descripcion;
    producto.usuario = req.user._id;
    producto.precio = body.precio;
    producto.stock = body.stock;
    producto.estado = body.estado;
    if (month < 10) {
        producto.CreateAt = `${day}-0${month}-${year}`;
    } else {
        producto.CreateAt = `${day}-${month}-${year}`;
    }
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


// Ver Detalle y(Editar)
// router.get('/producto/detalles/:id', isAuthenticated, async(req, res, next) => {
//     let id = req.params.id;
//     let data = await Producto.findById(id)
//         .populate("usuario");

//     let userPost = JSON.stringify(data.usuario._id);
//     let usuario = JSON.stringify(req.user._id);

//     console.log("usuarios id:", userPost);
//     console.log("ID DE USUARIO", usuario);
//     console.log('Estos son los datos', data);
//     res.render('Detalles', { data, userPost, usuario });
// });



// Comentarios y Comentar


// router.post('/producto/comentarios/:id', isAuthenticated, async(req, res, next) => {
//     let body = req.body;
//     let id = req.params.id;
//     let saveComentario = new Comentario();
//     saveComentario.descripcion = body.descripcion;
//     saveComentario.usuario = req.user;
//     saveComentario.producto = id;
//     await saveComentario.save();
//     res.redirect(`/producto/comentarios/${id}`);
// });


// router.get('/producto/comentarios/:id', isAuthenticated, async(req, res, next) => {
//     let id = req.params.id;
//     let data = await Producto.findById(id);
//     let comment = await Comentario.find()
//         .populate("usuario");
//     let nombreUsuario = req.user.nombres;
//     console.log("Nombre de Usuario:", nombreUsuario);
//     res.render('Comentarios', { data, comment, id, nombreUsuario });
// });


// Mezla de Comentarios y Productos
router.get('/producto/detalles/:id', isAuthenticated, async(req, res, next) => {
    let id = req.params.id;
    let data = await Producto.findById(id)
        .populate("usuario");
    let datos = await Producto.findById(id);
    let comment = await Comentario.find()
        .populate("usuario");
    let userPost = JSON.stringify(data.usuario._id);
    let usuario = JSON.stringify(req.user._id);
    let Estesoy = req.user;
    let idUsuarioLogeado = req.user._id;
    let nombreUsuario = req.user.nombres;
    console.log("usuarios id:", userPost);
    console.log("ID DE USUARIO", Estesoy);
    console.log('Estos son los datos', data);
    res.render('Detalles', { datos, data, userPost, idUsuarioLogeado, usuario, Estesoy, comment, id, nombreUsuario });
});


router.post('/producto/detalles/:id', isAuthenticated, async(req, res, next) => {
    let date = new Date()
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let body = req.body;
    let id = req.params.id;
    let saveComentario = new Comentario();
    saveComentario.descripcion = body.descripcion;
    saveComentario.usuario = req.user;
    if (month < 10) {
        saveComentario.CreateAt = `${day}-0${month}-${year}`;
    } else {
        saveComentario.CreateAt = `${day}-${month}-${year}`;
    }
    saveComentario.hora = strTime;
    saveComentario.producto = id;
    await saveComentario.save();
    res.redirect(`/producto/detalles/${id}`);
});

router.get('/delcoment/:id', isAuthenticated, async(req, res, next) => {
    let id = req.params.id;
    console.log("id de comentario:", id);
    let comentario = await Comentario.findById(id)
        .populate("producto", "_id");
    let idProd = comentario.producto._id;
    console.log("Comentarios buscar producto:", comentario);
    // console.log("Id de producto", idProd);
    await Comentario.remove({ _id: id });
    res.redirect(`/producto/detalles/${idProd}`);
});

// Mis Productos

router.get('/myproducts', isAuthenticated, async(req, res) => {

    let productos = await Producto.find()
        .populate("usuario", "_id");
    let usuario = req.user._id;
    // let idProd = productos[1].usuario._id;

    let usuarioT = JSON.stringify(usuario);
    // let idProdT = JSON.stringify(idProd);


    // if (usuarioT === idProdT) {
    //     console.log("Verdadeero");
    // } else {
    //     console.log("Falso");
    // }

    res.render('myproducts', { usuarioT, productos });
});

//  -------------------------

module.exports = router;