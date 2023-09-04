import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
    }
});

const Message = mongoose.model('messages', messageSchema);

export default Message;