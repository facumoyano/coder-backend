import userModel from "../../models/userModel.js";
import {createHash, isValidPassword} from '../../../utils/functions.js';

class UserService {

    async createUser(user) {
        try {
            user.password = createHash(user.password);
            return await userModel.create(user);
        } catch (error) {
            throw new Error(error.message.replace(/"/g, "'"));
        }
    }

    async login(username, password) {
        try {
            const user = await userModel.find({username: username});
            console.log(isValidPassword(user[0], password));

            if (user.length > 0 && isValidPassword(user[0], password)) {
                return user[0];
            }
            
            throw new Error('Login failed');

        } catch (error) {
            throw new Error(error.message.replace(/"/g, "'"));
        }
    }

}

export default UserService;