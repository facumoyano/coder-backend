import mongoose, {Schema} from 'mongoose';

const cartSchema = new mongoose.Schema({
    timestamp: {
        type: String,
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: Number
    }]
});

const Cart = mongoose.model('carts', cartSchema);

export default Cart;