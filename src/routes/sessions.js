import {Router} from 'express';
import passport from 'passport';

const router = Router();

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

router.get("/current", (req, res) => {
    if (req.session && req.session.user) {
        res.send(req.session.user);
    } else {
        res.status(401).send('No user is currently logged in');
    }
});

export default router;