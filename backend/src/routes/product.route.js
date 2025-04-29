import express from "express";
import { getProducts,
        createProduct,
        deleteProduct,
        getUserProducts,
        updateProduct,
        clickProduct } from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/create-product", protectRoute, createProduct);
router.get("/user", protectRoute, getUserProducts);
router.delete("/delete/:productId", protectRoute, deleteProduct);
router.get("/:productId", clickProduct);
router.put("/update/:productId", protectRoute, updateProduct);

export default router;