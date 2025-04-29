import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		about:{
			type: String,
			default: "No about provided",
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		category: {
			type: String,
			required: true,
			enum:["electronics","food","fashion","sports","books","home","toys","health","video games","cars"],
		},
		user:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
        views:{
            type: Number,
            default: 1,
        }
		
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;