import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now()
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: Number
    }]
});

cartSchema.plugin(mongoosePaginate);

const Cart = mongoose.model('carts', cartSchema);

export default Cart;