const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isAuthenticated } = require('../authenticacion/authenticacion');
const Producto = require('../models/productos');
const Usuario = require('../models/usuario');

router.get('/', (req, res, next) => {
    res.render('signin');
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', (req, res, next) => {
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
}));

//  ----------AUTENTICACION CON GOOGLE---------------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], failureRedirect: '/signin' }));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/signin'
    }),
    function(req, res) {
        res.redirect('/profile');
    });
//  -------------------------

// Verifica si esta autenticado
// router.use((req, res, next) => {
//     isAuthenticated(req, res, next);
//     next();
// });


router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
})

// Permite no ver perfil sin registrarse
// function isAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/');
// }

module.exports = router;