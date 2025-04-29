import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProductStore= create((set,get)=>({
    Product:[],
    isLoadingProduct:false,
    isCreatingProduct:false,
    userProduct:[],
    isGettingUserProduct:false,
    hasMoreProd:true,
    clickedProduct:null,
    editProduct:null,
    searchFilter:"",
    sortBy:"price 1",
    sortOptions:["price 1","price -1","createdAt 1","createdAt -1","views 1","views -1"],
    category:["electronics","food","fashion","sports","books","home","toys","health","video games","cars"],

    
    changeSearchFilter:(filter)=>{
        set({searchFilter:filter}),
        set({Product:[],hasMoreProd:true})
    },

    changeSortBy:(filter)=>{
        set({sortBy:filter})
        set({Product:[],hasMoreProd:true})
    },

    setEditProduct:(product)=>{
        set({editProduct:product});
    },

    uploadProduct: async(data)=>{
        set({isCreatingProduct:true});
        
        try {
            const res=await axiosInstance.post("/products/create-product",data);
            toast.success("product created succesfully");
            set((state) => ({
                Product: [res.data.product, ...state.Product],
            }));
            console.log(get().Product);
            get().changeSearchFilter("");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response?.data?.message||"something went wrong");
        }finally{
            set({isCreatingProduct:false});
        }
    },

    getProduct: async(limit,times,incrementTimes)=>{
        if (get().isLoadingProduct) return;
        if(!get().hasMoreProd)return;

        set({isLoadingProduct:true});
        try {
            let res;
            if(get().searchFilter===""){
                res = await axiosInstance.get(`/products?limit=${limit}&times=${times}&sort=${get().sortBy}`);
            }
            else{
                res = await axiosInstance.get(`/products?limit=${limit}&times=${times}&query=${get().searchFilter}&sort=${get().sortBy}`);
            }
            // console.log(get().searchFilter);
        
            const existingProducts = new Set(get().Product.map((product) => product._id));
            const newProducts = res.data.product.filter((product) => !existingProducts.has(product._id));

            set((state) => ({
                Product: [...state.Product, ...newProducts], // Add only unique products
                hasMoreProd: res.data.hasMore,
                isLoadingProduct: false,
            }));
            if (incrementTimes) incrementTimes();
        } catch (error) {
            console.log("error in getproduct:", error);
            toast.error(error.response?.data?.message||"something went wrong");
            set({isLoadingProduct:false});
        }
    },

    getUserProduct: async()=>{
        set({isGettingUserProduct:true});
        try {
            const res= await axiosInstance.get("/products/user");
            set({userProduct: [...res.data.products]});
        } catch (error) {
            console.log("error in get user product:", error);
            toast.error(error.response?.data?.message||"something went wrong");
        }finally{
            set({isGettingUserProduct:false});
        }
    },
    deleteProduct: async(productId)=>{
        try {
            const res = await axiosInstance.delete(`/products/delete/${productId}`);
            toast.success(res.data.message);
            set((state) => ({
                Product: state.Product.filter((post) => post._id !== productId),
            }));
            set((state) => ({
                userProduct: state.userProduct.filter((post) => post._id !== productId),
            }));
            
        } catch (error) {
            console.log("error in delete product:", error);
            toast.error(error.response?.data?.message||"something went wrong")
        }
    },
    updateProduct:async(data,productId)=>{
        set({isCreatingProduct:true});
        try {
            const res = await axiosInstance.put(`/products/update/${productId}`,data);
            toast.success("product updated successfully");
            set((state) => ({
                Product: state.Product.map((post) => post._id === productId ? res.data.updateProduct : post),
            }));
            set((state) => ({
                userProduct: state.userProduct.map((post) => post._id === productId ? res.data.updateProduct : post),
            }));
            get().changeSearchFilter("");
        } catch (error) {
            console.log("error in update product:", error);
            toast.error(error.response?.data?.message||"something went wrong")
        }
        finally{
            set({isCreatingProduct:false});
        }
    },
    clickProduct:async(productId)=>{
        try {
            const res = await axiosInstance.get(`/products/${productId}`);
            set({clickedProduct: res.data.product});
        } catch (error) {
            console.log("error in click product:", error);
            toast.error(error.response?.data?.message||"something went wrong")
        }
    },

}));