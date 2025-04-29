import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";


export const getProducts = async (req, res) => {
    try {
        const {query} = req.query||"";
        const limit=parseInt(req.query.limit)|| 10;
        const times=parseInt(req.query.times)||0;
        const skip = times * limit;
        const sortby=req.query.sort
        

        let obj={}

        let sortId=sortby.split(" ")[0]
        let opp=Number(sortby.split(" ")[1])


        obj[sortId]=opp

      

        // console.log("query",query);
        // console.log("limit",limit);
        // console.log("times",times);
        // console.log("skip",skip);

        
        const product = await Product.find({
            $or:[
                {name: {$regex: query||"" , $options: "i"}},
                {description: {$regex: query||"" , $options: "i"}},
                {category: {$regex: query||"" , $options: "i"}}, 
            ]
        }
        ).populate("user", "name email profilePic")
        .skip(skip)
        .limit(limit)
        .sort(obj);



        if(product.length===0){
            return res.status(200).json({ product: [], hasMore: false })
        }

        const totalproduct = await Product.countDocuments({
            $or:[
            {name: {$regex: query||"" , $options: "i"}},
            {description: {$regex: query||"" , $options: "i"}},
            {category: {$regex: query||"" , $options: "i"}},    
        ]});
        const hasMore = skip + product.length < totalproduct;    

        return res.status(200).json({product,hasMore});
    } catch (error) {
        console.log("Error in getProducts controller", error.message);  
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const createProduct = async (req, res) => {
    try {
        const {user}=req;

        const { name, description, price, category, image , about} = req.body;

        if(!user){
            return res.status(401).json({message: "must sign in"});
        }

        if(!name || !description || !price || !category || !image ||!about){
            return res.status(400).json({message: "All fields are required"});
        }
        if(price < 0||isNaN(price)){
            return res.status(400).json({message: "Price must be greater than 0"});
        }

        const uploadedResponse = await cloudinary.uploader.upload(image);


        const newProduct = new Product({
            name,
            description,
            about,
            price,
            image: uploadedResponse.secure_url,
            category,
            user: user._id
        });

        await newProduct.save()

        return res.status(201).json({message: "Product created successfully", product: newProduct});

    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export const deleteProduct = async (req,res) => {
    try {
        const {user}=req;
        const {productId}=req.params;

        if(!user){
            return res.status(401).json({message: "must sign in"});
        }

        if(!productId){
            return res.status(400).json({message: "Product id is required"});
        }
        

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.user.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this product" });
        }

        await Product.findByIdAndDelete(productId);

        return res.status(200).json({message: "Product deleted successfully"});
        
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getUserProducts = async (req,res) => {
    try {
        const {user}=req;

        // const cachedProducts = await redis.get(`user:${user._id}`);

        // if(cachedProducts) {
        //     console.log("got from cache",JSON.parse(cachedProducts))
        //     return res.status(200).json({products: JSON.parse(cachedProducts)});
        // }


        if(!user){
            return res.status(401).json({message: "must sign in"});
        }   

        const products = await Product.find({user: user._id}).sort({createdAt:-1}).populate("user", "name email profilePic");
       
        if(products.length===0){
            return res.status(200).json({ products: [] })
        }

        // await redis.set(`user:${user._id}`, JSON.stringify(products), "EX", 7*60*60*24);//cache for 7 days

        return res.status(200).json({products});

    } catch (error) {
        console.log("Error in getUserProducts controller", error.message); 
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateProduct = async (req,res) => {
    try {
        const {user}=req;
        const {productId}=req.params;

        if(!user){
            return res.status(401).json({message: "must sign in"});
        }
        if(!productId){
            return res.status(400).json({message: "Product id is required"});
        }

        const product = await Product.findById(productId).populate("user", "name email profilePic");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.user._id.toString() !== user._id.toString()) {

            console.log("user",user._id.toString())
            console.log("product.user",product.user._id.toString())
            return res.status(403).json({ message: "You are not authorized to update this product" });
        }

        const { name, description, about, price, category, image } = req.body;

        if(!name && !description && !price && !category && !image && !about){
            return res.status(400).json({message: "At least one field is required to update"});
        }

        if(price < 0||isNaN(price)){
            return res.status(400).json({message: "Price must be greater than 0 and a number"});
        }

        const updateData = {};
  
        // Handle profile picture upload
        if (image) {
          const uploadedResponse = await cloudinary.uploader.upload(image);
          updateData.image = uploadedResponse.secure_url;
        }
    
        // Handle description update
        if (description) {
          updateData.description = description;
        }
  
        if (name) {
          updateData.name = name;
        }

        if(price){
            updateData.price = price;
        }
        if(category){
            updateData.category = category;
        }

        if(about){
            updateData.about = about;
        }
    
        // Update user in the database
        const updateProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

        const cachedProduct = {
            ...product.toObject(),
            ...updateData,
        }


        redis.set(`product:${productId}`, JSON.stringify(cachedProduct), "EX", 60*60*24); //cache for 1 day
    
        if (!updateProduct) {
          return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({updateProduct});
    } catch (error) {
        console.log("Error in updateProduct controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const clickProduct = async (req,res) => {
    try {
        const {productId}=req.params;

        let cachedProduct = await redis.get(`product:${productId}`);
    
        if(cachedProduct) {
            return res.status(200).json({product: JSON.parse(cachedProduct)});
        }
        if(!productId){
            return res.status(400).json({message: "Product id is required"});
        }

        const product = await Product.findById(productId).populate("user", "name profilePic");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await redis.set(`product:${productId}`, JSON.stringify(product), "EX", 60*60*24); 

        product.views += 1;
        await product.save(product);

        return res.status(200).json({product});
    } catch (error) {
        console.log("Error in clickProduct controller", error.message); 
        res.status(500).json({message: "Internal Server Error"});
    }
}