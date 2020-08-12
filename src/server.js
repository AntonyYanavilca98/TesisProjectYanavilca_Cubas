const express = require('express');
const morgan = require('morgan');
const engine = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');


// process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// let URI;
// if (process.env.NODE_ENV === 'dev') {
// let URI = 'mongodb://localhost:27017/ProjectFinal';
// } else {
let URI = 'mongodb+srv://strider:jp1RbPtIuXDhbZda@cluster0.4opld.mongodb.net/Tesis?retryWrites=true&w=majority'
    // }



const app = express();
require('./passport/local-auth');


// Configuraciones
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.resolve(__dirname, './public')));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage')
    app.locals.signinMessage = req.flash('signinMessage')
    app.locals.usuario = req.user;
    console.log(app.locals);
    next();
});
// Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/productos'));
app.use('/admin', require('./routes/adminauth'));
app.use('/', require('./routes/file-upload'));

// Conexion con el servidor

mongoose.connect(URI, { // Por si hay un error instalar npm i mongoose@5.2.8
        useNewUrlParser: true,
        //useUnifiedTopology: true
    })
    .then(db => console.log('Base de Datos MongoDB conectada'))
    .catch(err => console.log(err));

app.listen(app.get('port'), () => {
    console.log('Escuchando en el puerto', app.get('port'));
});