const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

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
        return done(null, false, req.flash('signinMessage', 'El correo no existe'));
    }
    if (!bcrypt.compareSync(password, usuario.password)) {
        return done(null, false, req.flash('signinMessage', 'La contraseña no coincide'));
    }

    done(null, usuario);

}));


// Google Authentication
passport.use(new GoogleStrategy({
        clientID: '115698199407-72tmnaqeq9kdjssks80ilp2cslckmf9l.apps.googleusercontent.com',
        clientSecret: 'iAd3e0ho1rxCIDiPFRTTbI4E',
        callbackURL: "https://tesisapp.herokuapp.com/google/callback",
        // callbackURL: "http://localhost:3000/google/callback",
        proxy: true
    },
    async(accessToken, refreshToken, profile, done) => {
        const usuarioverifica = await Usuario.findOne({ email: profile._json.email })
        if (usuarioverifica) {
            done(null, usuarioverifica);
        } else {
            console.log(profile);
            const usuariogoogle = new Usuario();
            usuariogoogle.nombres = profile.name.familyName;
            usuariogoogle.apellidos = profile.name.givenName;
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