function auth(req, res, next) {
    if(req.session && req.session.user) {
        if(req.session.user.email === 'facumoyano44@gmail.com') {
            req.session.user.role = 'admin';
        } else {
            req.session.user.role = 'usuario';
        }
    }
    
    if(!req.session || !req.session.user) {
        return res.redirect('/login');
    }
    
    next();
}

export default auth;