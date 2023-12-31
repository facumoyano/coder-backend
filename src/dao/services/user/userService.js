import userModel from "../../models/userModel.js";
import {createHash, isValidPassword} from '../../../utils/functions.js';


class UserService {

    async createUser(user) {
        try {
            return await userModel.create(user);
        } catch (error) {
            throw new Error(error.message.replace(/"/g, "'"));
        }
    }

    async login(email, password) {
        try {
            const user = await userModel.find({email: email});

            if (user.length > 0 && isValidPassword(user[0], password)) {
                return user[0];
            }
            
            throw new Error('Login failed');

        } catch (error) {
            throw new Error(error.message.replace(/"/g, "'"));
        }
    }

    async findOne(query) {
        return userModel.findOne(query);
    }

}

export default UserService;