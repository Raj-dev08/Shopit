import { useCartStore } from "../store/useCartStore"
import { useEffect,useState } from "react"
import { Link } from "react-router-dom"
import { Loader } from "lucide-react"

const Cart = () => {
    const { getCartItems, cartItems, isLoadingCart ,removeFromCart,updateQuantity} = useCartStore();
    const [total,setTotal] = useState(0);
    useEffect(() => {
        getCartItems();
    }, [getCartItems, removeFromCart,updateQuantity]);

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            const calculatedTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
            setTotal(calculatedTotal);
        }
    }, [cartItems]);


    console.log(total)

    if (isLoadingCart) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }
    if(!cartItems) {
        return (
            <div className="flex items-center justify-center min-h-screen container mx-auto p-4 pt-20">
                <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
            </div>
        );
    }

 

  return (
    <div className="min-h-screen mx-auto p-4 container pt-20">
        <span className="flex felx-col justify-between">
            <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
            <button className="btn btn-error" onClick={()=>removeFromCart()}>Remove All</button>
        </span>
        {cartItems.map((cart)=>{
            return(
                <div key={cart._id} className="bg-base-300 p-4 rounded-lg mb-4">
                    <div className="flex items-center p-4">
                        <img
                            src={cart.user.profilePic || "/avatar.png"}
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-3">
                        <p className="font-semibold">{cart.user.name.toUpperCase()}</p>
                        </div>
                    </div>

                    <Link to={`${cart.image}`}>
                        <img src={cart.image} alt="Post" className="w-full h-64 object-contain" />
                    </Link>
                    <h2 className="text-xl font-semibold mt-2">{cart.name.toUpperCase()}</h2>
                    <p className="text-gray-500">Price: ${cart.price}</p>
                    <p className="text-gray-500">Quantity: {cart.quantity}</p>
                    <div className="flex justify-between items-center mt-4">
                        <button className="btn btn-error mt-4 shadow-md shadow-error border-none hover:shadow-none" onClick={()=>removeFromCart(cart._id)}>Remove from Cart</button>
                        
                        <div className="flex items-center">
                            <button className="btn btn-error bg-red-700 mt-4 ml-2 hover:bg-red-400 shadow-md shadow-red-400 border-none hover:shadow-none font-bold" onClick={()=>updateQuantity(cart._id,false)}>remove  -</button>
                            <button className="btn btn-success bg-green-600 mt-4 ml-2 hover:bg-green-400  shadow-md shadow-green-400 border-none hover:shadow-none font-bold" onClick={()=>updateQuantity(cart._id,true)}>add  +</button>
                        </div>
                    </div>
                </div>
            )
        })}
        <div className="bg-transparent backdrop-blur-md p-4 rounded-lg mt-4 flex flex-row justify-between sticky bottom-0 w-full">
            <h2 className="text-xl font-semibold">Total: ${total}</h2>
            <button className="btn btn-primary">Checkout</button>
        </div>
    </div>
  )
}

export default Cart