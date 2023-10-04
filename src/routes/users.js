import {Router} from 'express';
import UserService from '../dao/services/user/userService.js';
import passport from 'passport';


const US = new UserService();
const router = Router();

router.post("/register", passport.authenticate('register',{failureRedirect: '/register'}), async (req, res) => {
    try {
        req.session.registerSuccess = true;
        res.redirect("/login");
    } catch (error) {
        req.session.registerFailed = true;
        res.redirect("/register");
        console.error(error)
    }
});

router.post("/login", passport.authenticate('login', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});


export default router;