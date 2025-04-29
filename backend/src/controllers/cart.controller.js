import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";

export const getCartProducts = async (req, res) => {
	try {
        const {user}=req;

		const cachedCart = await redis.get(`cart:${user._id}`);

		if (cachedCart) {
			return res.json({ cartItems: JSON.parse(cachedCart) });
		}
        if(!user.cartItems || user.cartItems.length === 0) {
            return res.status(200).json([]);
        }
        if(!user){
            return res.status(401).json({message: "Unauthorized"});
        }
        const products = await Product.find({ _id: { $in: user.cartItems.map(item => item.id) } }).populate("user", "name email profilePic");

        // add quantity for each product
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id.toString() === product.id.toString());
            return { ...product.toJSON(), quantity: item.quantity };
        });

		await redis.set(`cart:${user._id}`, JSON.stringify(cartItems), "EX", 7 * 60 * 60 * 24); // cache for 7 days


		res.json({cartItems});
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const {user}= req;

		const existingItem = user.cartItems.find((item) => item.id === productId);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push(productId);
		}

		await redis.del(`cart:${user._id}`); // delete the cache for cart items

		await user.save();
		res.json({message: "Product added to cart", cartItems: user.cartItems});
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}

		await redis.del(`cart:${user._id}`); // delete the cache for cart items
		await user.save();
		res.json({ message: "Product removed from cart", cartItems: user.cartItems });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { increament } = req.body;
		const user = req.user;
		const existingItem = user.cartItems.find((item) => item.id.toString() === productId.toString());

		if (existingItem) {

			if (increament) {
				existingItem.quantity += 1;
			} 
			else if(!increament && existingItem.quantity > 0) {
				existingItem.quantity -= 1;
			}
			if (existingItem.quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await redis.del(`cart:${user._id}`);
				await user.save();
				return res.json(user.cartItems);
			}
			
			await redis.del(`cart:${user._id}`); // delete the cache for cart items

			await user.save();
			res.json({ message: "Product quantity updated", cartItems: user.cartItems });
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};