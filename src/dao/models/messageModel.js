import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

messageSchema.plugin(mongoosePaginate);

const Message = mongoose.model('messages', messageSchema);

export default Message;