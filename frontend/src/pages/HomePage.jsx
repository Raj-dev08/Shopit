import { useState, useEffect, useRef } from "react";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { ShoppingBagIcon } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

const HomePage = () => {
  const {getProduct, isLoadingProduct, hasMoreProd, Product,searchFilter,sortBy} = useProductStore();
  const {addToCart} = useCartStore();
  const {authUser} = useAuthStore();
  const limit = 2;
  const observerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [times, setTimes] = useState(0);
  const [searchPage,setSearchPage] = useState(0);
  const [mode,setMode]=useState("browse");
  

useEffect(() => {
  if (mode === "browse") {
    getProduct(limit, times, () => setTimes((prev) => prev + 1));
  }
  else if (mode === "search") {
    getProduct(limit, searchPage, () => setSearchPage((prev) => prev + 1));
  }
}, [page, mode]);

useEffect(() => {
  if (searchFilter) {
    setMode("search");
    setSearchPage(0);    
    setPage(1);          
    setTimes(0);          
  } else {
    setMode("browse");
    setPage(1);           
    setSearchPage(0);     
    setTimes(0);
  }
}, [searchFilter,sortBy]);




  useEffect(() => {
    if (!hasMoreProd || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingProduct && hasMoreProd) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.2 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMoreProd, isLoadingProduct]);

  return (
    <div className="min-h-screen pt-16 container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        
        {Product.map((post) => (
          <div key={post._id} className="shadow-md rounded-lg overflow-hidden border-2">
            <div className="flex items-center p-4">
              <img
                src={post.user.profilePic || "/avatar.png"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
                <div className="ml-3">
                  <p className="font-semibold">{post.user.name.toUpperCase()}</p>
                  {/* <p className="text-sm">{new Date(post.createdAt).toLocaleString()}</p> */}
                </div>
            </div>

            <Link to={`${post.image}`}>
              <img src={post.image} alt="Post" className="w-full h-64 object-contain" />
            </Link>

            <Link to={`/product/${post._id}`}><p className="p-4 text-lg font-bold text-center text-blue-500 text underline">{post.name.toUpperCase()}</p></Link>
            <span className="p-4 flex justify-between">
              <p className="p-4 font-semibold"><del className="text-gray-500">${post.price+post.price*(9.231/100).toFixed(2)}</del> ${post.price}</p>
              <p className="p-4 text-gray-400">Delivered in 10 days</p>
            </span>
            <span className="p-2 flex justify-between flex-col items-center">
              {authUser&&(
                <button className="btn-primary w-90 rounded-md p-4 flex text-white font-semibold bg-orange-500 hover:bg-orange-800 transition duration-300 ease-in-out" onClick={()=>addToCart(post._id)}>
                <ShoppingBagIcon className="mr-3"></ShoppingBagIcon> Buy Now
              </button>
              )}
            </span>
           
          </div>
          
        ))}
      </div>
      {isLoadingProduct && <p className="text-center mt-4">Loading...</p>}
      {!hasMoreProd && <p className="text-center mt-4">No more products to load.</p>}
      <div ref={observerRef} className="h-10"></div>
    </div>
  );
};

export default HomePage;