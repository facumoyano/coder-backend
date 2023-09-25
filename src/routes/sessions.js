import {Router} from 'express';
import passport from 'passport';

const router = Router();

router.get("/github", passport.authenticate('github', {scope: ['user:username']}), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

export default router;