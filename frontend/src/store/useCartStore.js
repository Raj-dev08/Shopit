import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useCartStore = create((set,get)=>({
    cartItems:[],
    isLoadingCart:false,
    isAddingToCart:false,
    isRemovingFromCart:false,
    isUpdatingQuantity:false,

    getCartItems:async()=>{
        set({isLoadingCart:true});
        try {
            const res = await axiosInstance.get("/cart");
            set({cartItems:res.data.cartItems});
        } catch (error) {
            console.log("Error in getCartItems:", error);
            toast.error(error.response?.data?.message||"something went wrong");
        } finally {
            set({isLoadingCart:false});
        }
    },

    addToCart:async(productId)=>{
        set({isAddingToCart:true});
        try {
            const response = await axiosInstance.post("/cart", { productId });
            set({ cartItems: response.data.cartItems });
            get().getCartItems();
            toast.success("Product added to cart");
        } catch (error) {
            console.log("Error in addToCart:", error);
            toast.error(error.response?.data?.message || "something went wrong");
        } finally {
            set({ isAddingToCart: false });
        }
    },

    updateQuantity:async(productId,inc)=>{
        set({isUpdatingQuantity:true});
        try {
            const response = await axiosInstance.put(`/cart/${productId}`, { increament: inc });
            set({ cartItems: response.data.cartItems });
            get().getCartItems();
            toast.success("Product quantity updated");
        } catch (error) {
            console.log("Error in updateQuantity:", error);
            toast.error(error.response?.data?.message || "something went wrong");
        }finally {
            set({ isUpdatingQuantity: false });
        }
    },
    removeFromCart:async(productId)=>{
        set({isRemovingFromCart:true});
        try {
            const response = await axiosInstance.delete("/cart", { data: { productId } });
            set({ cartItems: response.data.cartItems });
            get().getCartItems();
            toast.success("Product removed from cart");
        } catch (error) {
            console.log("Error in removeFromCart:", error);
            toast.error(error.response?.data?.message || "something went wrong");
        } finally {
            set({ isRemovingFromCart: false });
        }
    },
}))