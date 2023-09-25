import {Router} from 'express';
import UserService from '../dao/services/user/userService.js';

const US = new UserService();
const router = Router();

router.post("/register", async (req, res) => {
    try {
        await US.createUser(req.body);
        console.log(req.body)
        req.session.registerSuccess = true;
        res.redirect("/login");
    } catch (error) {
        req.session.registerFailed = true;
        res.redirect("/register");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password} = req.body;
        const { name } = await US.login(username, password);
        console.log(username, password)

        req.session.user = {username, name};
        req.session.loginFailed = false;
        res.redirect("/");
    } catch (error) {
        req.session.loginFailed = true;
        req.session.registerSuccess = false;
        res.redirect("/login");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});


export default router;