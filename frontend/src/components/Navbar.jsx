import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";
import { LogOut, ShoppingCart, ListFilter, User , Plus, LogIn, EllipsisVertical, Search, AArrowDown, ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { logout, authUser ,checkAuth} = useAuthStore();
  const { changeSearchFilter,category,changeSortBy,sortOptions} = useProductStore();
  const [textSearch,settextSearch] = useState('');
  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  const handleFrom  = (e) => {
    e.preventDefault();
    changeSearchFilter(textSearch);
  }

  const changeCategry = (cat) => {
    changeSearchFilter(cat);
  }

  const changeSort = (sort) =>{
    changeSortBy(sort);
  }
  
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/cart" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
            </Link>
            <Link to="/" className="text-2xl font-bold text-seconday">
              <h3 className="text-lg font-bold">ShopIt</h3>
            </Link>   
          </div>

          <form className="flex items-center gap-2 mx-9 w-full max-w-[1000px] " onSubmit={handleFrom}>
            <div className="relative w-full max-w-[1000px]">
              <input
                type="text"
                placeholder="Search..."
                value={textSearch}
                onChange={(e) => settextSearch(e.target.value)}
                className="input input-bordered w-full pr-10 focus:outline-none h-[50px]"
              />  
              <button className="absolute right-0 top-0 mt-2 mr-2" type="submit">
                <Search className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">

            

              
            

            {authUser? (
              <>
              <div className="dropdown dropdown-center">
                <div tabIndex={0} role="button" className="btn m-1">
                  <EllipsisVertical className="w-5 h-5" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52  p-2 shadow-sm">
                  <li>
                  <Link to={"/profile"} className={`flex gap-2 items-center`}>
                    <User className="size-6" />
                    <span className="inline">Profile</span>
                  </Link>
                  </li>
                  <li>
                  <Link to={"/create"} className={`flex gap-2 items-center`}>
                    <Plus className="size-6" />
                    <span className="inline">Upload(Admin)</span>
                  </Link>
                  </li>
                  <li>
                    <div className="dropdown dropdown-center">
                <div tabIndex={0} role="button" className="btn m-1">
                  <AArrowDown className="w-5 h-5" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52  p-2 shadow-sm">
                      {sortOptions.map((sort)=>{
                        return(
                          <li key={sort} className='flex flex-row gap-2 items-center' onClick={()=>changeSort(sort)}>
                            <span className="flex flex-row">
                              {sort.split(" ")[0]}       
                           
                            {sort.split(" ")[1] == "1"?(
                              <p>
                                <ArrowDown className="w-5 h-5"/>
                              </p>
                            ):(
                              <p>
                                <ArrowUp className="w-5 h-5"/>
                              </p>
                            )}
                            </span>
                          </li>
                        )
                      })}
                </ul>
              </div>
                  </li>
                  
                  <li>
                    <div className="dropdown dropdown-center">
                <div tabIndex={0} role="button" className="btn m-1">
                  <ListFilter className="w-5 h-5" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52  p-2 shadow-sm">
                      <li key="1" className='flex gap-2 items-center' onClick={()=>changeCategry("")}>
                        <span className="inline">all</span>
                      </li>
                  {category.map((cat)=>{
                    return(
                      <li key={cat} className='flex gap-2 items-center' onClick={()=>changeCategry(cat)}>
                        <span className="inline">{cat}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
                  </li>
      
                  <li>
                  <button className="flex gap-2 items-center" onClick={logout}>
                    <LogOut className="size-6" />
                    <span className="inline">Logout</span>
                  </button>
                  </li>
                </ul>
              </div>
              </>
            ):(
              <Link to={"/login"} className={`flex gap-2 items-center`}>
                <LogIn className="size-5" />
                <span className="inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
