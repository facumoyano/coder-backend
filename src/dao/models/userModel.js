import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        require: true
    },
    username: {
        type: String,
        minLength: 3,
        require: true
    },
    password: {
        type: String,
        require: true
    },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;