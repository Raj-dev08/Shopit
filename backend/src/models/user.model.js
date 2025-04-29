import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "No description provided",
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
    profilePic: {
        type: String,
        default: "https://m.media-amazon.com/images/I/51RlhKn0R3L._SX522_.jpg",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    cartItems:[
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity:{
                type: Number,
                default: 1,
            },
        },
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;