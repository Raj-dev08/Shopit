import { useEffect, useState } from "react";
import { Camera, Mail, Loader2,Pen,CaptionsIcon,DollarSign,List} from "lucide-react";
import toast from "react-hot-toast"
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import {Navigate}  from "react-router-dom"

const CreateProd = ({mode}) => {
  const { isCreatingProduct,uploadProduct,category,editProduct,setEditProduct,updateProduct,getUserProduct}=useProductStore();
  const {checkAuth}=useAuthStore();
  const [Product, setProduct] = useState({
    description: "",
    about:"",
    name:"",
    category:"",
    price:0,
    image:""
  });
  useEffect(()=>{
    if(mode=="update" && editProduct){
      setProduct({
        description: editProduct?.description||"",
        about:editProduct?.about||"",
        name:editProduct?.name||"",
        category:editProduct?.category||"",
        price:editProduct?.price||0,
        image:editProduct?.image||""
      })
    }
  },[mode,editProduct])

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(!checkAuth.isAdmin)
    return (
      <Navigate to="/"/>
    );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setProduct({ ...Product, image: base64Image });
    };
  };

  const validateForm = () => {
    if (!Product.name.trim()) return toast.error("product name is required");
    if (!Product.description.trim()) return toast.error("description is required");
    if (!Product.price && Product.price<=0 && Nan(Product.price)) return toast.error("price must be a number greater than 0");
    if (!Product.image) return toast.error("image is required");
    if (!Product.category) return toast.error("category is required");
    if(!Product.about) return toast.error("about is required");
    
    return true;
  };

  const handleDataChange=async(e)=>{
    e.preventDefault();

    validateForm();

    if(mode=="update"){
      await updateProduct(Product,editProduct._id);
      setEditProduct(null);
      getUserProduct();
    }else if(mode=="create"){
    await uploadProduct(Product);
    }
  }

  return (
    
    <div className="min-h-screen pt-20">

      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Your Post</h1>
          </div>

          {/* avatar upload section */}
          <form onSubmit={handleDataChange}>


          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={Product.image || "https://m.media-amazon.com/images/I/51RlhKn0R3L._SX522_.jpg"}
                alt="Post"
                className="w-[100%] object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isCreatingProduct ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isCreatingProduct}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isCreatingProduct ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

            <div className="space-y-6">
                    
            <div className="space-y-1.5 my-5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Pen className="w-4 h-4" />
              Product Name
              </div>
              <input
              type="text"
              className={`input input-bordered w-full pr-10 focus:outline-none h-[50px] `}
              placeholder="product name"
              value={Product.name}
              onChange={(e) => setProduct({ ...Product, name: e.target.value })
              }
            />
            </div>
           
            <div className="space-y-1.5 my-5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <CaptionsIcon className="w-4 h-4" />
                Category
              </div>
              <select  className="select select-bordered w-full text-zinc-400"
                  value={Product.category} // Bind the value to Product.category
                 onChange={(e) => setProduct({ ...Product, category: e.target.value })} // Update state on change
              >
                <option value="" disabled>
                    Select a category
                </option>
                {category.map((cat)=>{
                  return(
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className="space-y-1.5 my-5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Price
              </div>
              <input
              type="number"
              className={`input input-bordered w-full pr-10 focus:outline-none h-[50px] `}
              placeholder="$price"
              value={Product.price}
              onChange={(e) => setProduct({ ...Product, price: e.target.value })
              }
            />
            </div>

            <div className="space-y-1.5 my-5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Description
              </div>
              <textarea
              type="text"
              className={`input input-bordered w-full pr-10 focus:outline-none h-[100px] `}
              placeholder="about your product"
              value={Product.description}
              onChange={(e) => setProduct({ ...Product, description: e.target.value })
              }
            />
            </div>

            <div className="space-y-1.5 my-5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <List className="w-4 h-4" />
                About
              </div>
              <textarea
              type="text"
              className={`input input-bordered w-full pr-10 focus:outline-none h-[100px] `}
              placeholder="give some products it will be seperated by a semicolon ' , '"
              value={Product.about}
              onChange={(e) => setProduct({ ...Product, about: e.target.value })
              }
            />
            </div>
            

            <button type="submit" className="btn btn-primary w-full mt-10" disabled={isCreatingProduct}>
              {isCreatingProduct ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                mode=="update"?"UPDATE":"CREATE"
                
              )}
               
            </button>

          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateProd
