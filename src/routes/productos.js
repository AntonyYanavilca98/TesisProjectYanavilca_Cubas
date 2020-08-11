const { isAuthenticated } = require('../authenticacion/authenticacion');
const express = require('express');
const Producto = require('../models/productos');
const Comentario = require('../models/comentarios');
const Usuario = require('../models/usuario');
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
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, prodencontrado) => {
        if (err) return console.log(err);
        prodencontrado.nombre = body.nombre;
        prodencontrado.descripcion = body.descripcion;
        prodencontrado.save();
    });
    res.redirect('/productos');
});
// --------------------------


// Agregar un producto
router.get('/addprod', isAuthenticated, (req, res, next) => {
    res.render('addprod');
});


router.post('/addproducto', isAuthenticated, async(req, res, next) => {
    let body = req.body;
    console.log(body);
    let producto = new Producto(body);
    producto.usuario = req.user._id; // => Esta por defecto como user no como usuario
    await producto.save();
    console.log('Estos ', producto);
    res.redirect('/productos');

});

// Eliminar Producto
router.get('/delprod/:id', isAuthenticated, async(req, res, next) => {
    let id = req.params.id;
    await Producto.remove({ _id: id });
    res.redirect('/productos');
});


// Ver Detalle y  (Editar) 
router.get('/producto/detalles/:id', isAuthenticated, async(req, res, next) => {
    let id = req.params.id;
    let data = await Producto.findById(id);
    console.log('Estos son los datos', data);
    res.render('Detalles', { data });
});

// Comentarios y Comentar



router.post('/producto/comentarios/:id', isAuthenticated, async(req, res, next) => {
    let body = req.body;
    let id = req.params.id;
    let saveComentario = new Comentario();
    saveComentario.descripcion = body.descripcion;
    saveComentario.usuario = req.user;
    saveComentario.producto = id;
    // console.log("Esta es la descee", saveComentario);
    // console.log("Esta es la descasdasd", id);
    await saveComentario.save();
    res.redirect(`/producto/comentarios/${id}`);
    // console.log("Esta es la id", id);
    // let comentarios = await comentarios
});


router.get('/producto/comentarios/:id', isAuthenticated, async(req, res, next) => {
    let { id } = req.params;
    let data = await Producto.findById(id);
    res.render('Comentarios', { data });
    // let post = await Comentario.find();
    // res.render('ProductoComentar', { post });
});

//  -------------------------

module.exports = router;



{
    /* <html>
    <form method="POST" action="/signup">

        <input type="text" name="nombres" placeholder="Nombres..." required>
        <input type="text" name="apellidos" placeholder="Apellidos..." required>
        <input type="email" name="email" placeholder="Insertar Email" required>
        <input type="password" name="password" placeholder="ingresa Clave" required>

        <% if( signupMessage.length > 0 ) { %>
            <p>
                <%= signupMessage  %>
            </p>
            <% }%>
                <button type="submit">
            registrar
        </button>
    </form>

    </html> */
}


{
    /* <form method="POST" action="/signin">

    <input type="email" name="email" placeholder="Email">
    <input type="password" name="password" placeholder="Clave">
    <% if( signinMessage.length > 0 ) { %>
        <p>
            <%= signinMessage  %>
        </p>
        <% }%>
            <button type="submit">Ingresar</button>

            <a href="/google">Ingresar por Google</a>

    </form> */
}


{
    /* <div>
            <p>Comentarios</p>
            <form method="GET" action="/comentarios">
                <% for (var i=0; i < post.length; i++){ %>
                    <div class="card" style="width: 18rem;">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=="
                            class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title"></h5>
                            <h1 class="card-text" aria-readonly="true">
                                <%= post[i].user.nombres %>
                            </h1>
                            <textarea class="btn btn-primary" name="descripcion" aria-readonly="true">
                            <%= post[i].descripcion %>
                        </textarea>
                        </div>
                    </div>
                    <% } %>
            </form>
        </div> */
}


{
    /* <p>-----------------------------------------------------------</p>
        <div>
            <p>Comentarios</p>
            <form method="POST" action="/comentar">
                <div class="card" style="width: 18rem;">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=="
                        class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title"></h5>
                        <p class="card-text">
                            <input type="text" class="btn btn-primary" required name="nombres" />
                        </p>
                        <textarea class="btn btn-primary" name="descripcion" required>
                        </textarea>
                    </div>
                </div>
                <input type="submit" value="Comentar" class="btn btn-danger">
            </form>
        </div> */
}