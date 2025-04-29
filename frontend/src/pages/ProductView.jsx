import { useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";
import { Car , HeartHandshake , Repeat2,ArrowBigDown } from "lucide-react";
import { BsCashCoin } from "react-icons/bs";
const ProductView = () => {
    const {id} = useParams();
    const {clickProduct,clickedProduct} = useProductStore();

    useEffect(()=>{
        if(!id) return;
        clickProduct(id);
    },[id])

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="card w-full bg-base-300 shadow-xl mt-[100px]">
        <div className="card-body flex flex-col items-cente bg-base-300">
        <div className="flex items-center p-4">
              <img
                src={clickedProduct?.user.profilePic || "/avatar.png"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
                <div className="ml-3">
                  <p className="font-semibold">{clickedProduct?.user.name.toUpperCase()}</p>
                </div>
          </div>
          <figure className="w-full h-[300px] flex items-center justify-center">
            <img
              src={clickedProduct?.image}
              alt="Product"
              className="object-contain w-full h-full rounded-lg bg-base-100"
            />
          </figure>
        </div>
        <div className="card-body p-10">
          <h2 className="card-title p-10 flex flex-col items-center">{clickedProduct?.name.toUpperCase()}</h2>

          <h1 className="text-lg font-semibold my-10 flex">Price: 
            <del><p className="text-error mr-2 ml-1">${clickedProduct?.price + 12}</p></del>
            <p className="">${clickedProduct?.price}</p>
          </h1>

          <p className="text-lg font-bold hover:text-zinc-400 hover: cursor-pointer">{clickedProduct?.description.toUpperCase()}</p>

          <p className="text-lg font-bold hover:text-zinc-400 hover: cursor-pointer mt-4">Category: {clickedProduct?.category.toUpperCase()}</p>

          <p className="text-lg font-bold hover:text-zinc-400 hover: cursor-pointer mt-4">About this product   <ArrowBigDown className="inline hover:text-red-400"/> </p>
         
          <ol className="list-disc list-inside mt-4 text-sm ml-10">
            {clickedProduct?.about.split(',').map((item, index) => (
              <li key={index} className="text-lg hover:text-zinc-400 font-semibold hover:cursor-pointer">{item}</li>
            ))}
          </ol>

          <p className="text-lg font-bold hover:text-zinc-400 hover: cursor-pointer mt-4">Delivery Info <ArrowBigDown className="inline hover:text-red-400"/></p>


          <ol className="list-disc list-inside mt-4 text-sm ml-10">
            <li className="text-lg hover:text-zinc-400 font-semibold hover:cursor-pointer">Free Delivery <Car className="size-6 mx-2 inline-block hover:mx-4 transition-all hover:text-pink-300"/></li>
            <li className="text-lg hover:text-zinc-400 font-semibold hover:cursor-pointer">Customer care service upto 7 Days <HeartHandshake className="size-6 mx-2 inline-block hover:text-error"/></li>
            <li className="text-lg hover:text-zinc-400 font-semibold hover:cursor-pointer">Cash on delivery <BsCashCoin className="size-6 mx-2 inline-block hover:text-success"/></li>
            <li className="text-lg hover:text-zinc-400 font-semibold hover:cursor-pointer">Easy returns <Repeat2 className="size-6 mx-2 inline-block hover:text-success-content"/></li>
          </ol>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductView