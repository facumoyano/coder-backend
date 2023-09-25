function auth(req, res, next) {
    if(req.session && req.session.user) {
        if(req.session.user.username === 'facumoyano') {
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