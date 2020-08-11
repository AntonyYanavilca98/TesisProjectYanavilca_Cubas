function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

let AuthAdmin_Role = (req, res, next) => {
    let usuario = req.user;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        // return res.json({
        //     ok: false,
        //     err: {
        //         message: 'No es administrador'
        //     }
        // })
        res.redirect('/profile');
    }

}


module.exports = {
    AuthAdmin_Role,
    isAuthenticated
}