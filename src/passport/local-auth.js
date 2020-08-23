const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

require('dotenv').config();

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async(id, done) => {
    const usuario = await Usuario.findById(id);
    done(null, usuario);
})

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const usuarioverifica = await Usuario.findOne({ email: email })
    if (usuarioverifica) {
        return done(null, false, req.flash('signupMessage', 'El email ya existe'));
    } else {
        let body = req.body;
        const usuario = new Usuario(); // Creando un nuevo usuario
        usuario.nombres = body.nombres;
        usuario.apellidos = body.apellidos;
        usuario.email = email;
        usuario.image = null;
        usuario.ruta = null;
        usuario.password = bcrypt.hashSync(password, 10);
        await usuario.save();
        done(null, usuario);
    }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const usuario = await Usuario.findOne({ email: email })
    if (!usuario) {
        return done(null, false, req.flash('signinMessage', 'El correo o la contraseña no coinciden'));
    }
    if (!bcrypt.compareSync(password, usuario.password)) {
        return done(null, false, req.flash('signinMessage', 'La contraseña no coincide'));
    }

    done(null, usuario);

}));


// Google Authentication
passport.use(new GoogleStrategy({
        clientID: process.env.googleclientID,
        clientSecret: process.env.googleclientSecret,
        callbackURL: process.env.googlecallbackURL,
        proxy: true,
        // callbackURL: process.env.googlecallbackURL_LOCAL,
    },
    async(accessToken, refreshToken, profile, done) => {
        const usuarioverifica = await Usuario.findOne({ email: profile._json.email });
        if (usuarioverifica) {
            done(null, usuarioverifica);
        } else {
            console.log("Este es el perfil", profile);
            const usuariogoogle = new Usuario();
            usuariogoogle.nombres = profile._json.name;
            usuariogoogle.apellidos = profile._json.given_name;
            usuariogoogle.email = profile._json.email;
            usuariogoogle.password = ':)';
            usuariogoogle.image = profile._json.picture;
            usuariogoogle.ruta = profile._json.picture;
            console.log(usuariogoogle);
            await usuariogoogle.save();
            done(null, usuariogoogle);
            //console.log(usuariogoogle);
        }
    }
));


//Facebook Authenticacion
// passport.use(new FacebookStrategy({
//         clientID: '3147079262075089',
//         clientSecret: '561830cfc953e38fcde831f60c58f6a1',
//         callbackURL: "http://localhost:3000/auth/facebook/callback",
//         profileFields: ['id', 'emails', 'name', 'photos']
//     },
//     async(accessToken, refreshToken, profile, done) => {
//         const fbverifica = await Usuario.findOne({ email: profile._json.email });
//         if (fbverifica) {
//             done(null, fbverifica);
//         }
//         console.log("perfil:", profile._json);
//         let fotos = profile.photos[0].value;
//         const usuariofacebook = new Usuario();
//         usuariofacebook.nombres = profile._json.first_name;
//         usuariofacebook.apellidos = profile._json.last_name;
//         usuariofacebook.email = profile._json.email;
//         usuariofacebook.image = fotos;
//         usuariofacebook.ruta = fotos;
//         await usuariofacebook.save();
//         done(null, usuariofacebook);
//         // console.log("fotos", fotos);
//         console.log("datos:", usuariofacebook);
//         // done(null, )
//     }
// ));