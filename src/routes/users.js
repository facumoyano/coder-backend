import {Router} from 'express';
import UserController from '../dao/controllers/userControler.js';
import passport from 'passport';


const controller = new UserController();
const router = Router();

router.post("/register", passport.authenticate('register',{failureRedirect: '/register'}), controller.registerUser);

router.post("/login", passport.authenticate('login', {failureRedirect: '/login'}), controller.loginUser);

router.get("/logout", controller.logoutUser);


export default router;