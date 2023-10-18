import UserService from "../services/user/userService.js";

class UserController {
  constructor() {
    this.UserService = new UserService();
  }

  registerUser = async (req, res) => {
    try {
      req.session.registerSuccess = true;
      res.redirect("/login");
    } catch (error) {
      req.session.registerFailed = true;
      res.redirect("/register");
      console.error(error);
    }
  };

  loginUser = async (req, res) => {
    try {
      req.session.user = req.user;
      res.redirect("/");
    } catch (error) {
      console.error(error);
    }
  };

  logoutUser = async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      console.error(error);
    }
  };
}

export default UserController;
