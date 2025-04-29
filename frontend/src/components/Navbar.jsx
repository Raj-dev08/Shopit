import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";
import {
  LogOut, ShoppingCart, ListFilter, User, Plus,
  LogIn, EllipsisVertical, Search, AArrowDown, ArrowDown, ArrowUp
} from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { logout, authUser, checkAuth } = useAuthStore();
  const { changeSearchFilter, category, changeSortBy, sortOptions } = useProductStore();
  const [textSearch, setTextSearch] = useState('');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleForm = (e) => {
    e.preventDefault();
    changeSearchFilter(textSearch);
  };

  const changeCategory = (cat) => {
    changeSearchFilter(cat);
  };

  const changeSort = (sort) => {
    changeSortBy(sort);
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40
      backdrop-blur-lg bg-base-100/80 overflow-x-auto">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full min-w-[640px]">
          {/* Left */}
          <div className="flex items-center gap-8">
            <Link to="/cart" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
            </Link>
            <Link to="/" className="text-2xl font-bold text-secondary">
              <h3 className="text-lg font-bold">ShopIt</h3>
            </Link>
          </div>

          {/* Search */}
          <form className="flex items-center gap-2 mx-9 w-full max-w-[1000px]" onSubmit={handleForm}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
                className="input input-bordered w-full pr-10 focus:outline-none h-[50px]"
              />
              <button className="absolute right-0 top-0 mt-2 mr-2" type="submit">
                <Search className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </form>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="dropdown dropdown-center">
              <button className="btn m-1">
                <AArrowDown className="w-5 h-5" />
              </button>
              <ul className="dropdown-content menu bg-base-100 rounded-box z-[999] w-52 p-2 shadow-sm">
                {sortOptions.map((sort) => (
                  <li key={sort} className='flex gap-2 items-center' onClick={() => changeSort(sort)}>
                    <span className="flex flex-row items-center gap-2">
                      {sort.split(" ")[0]}
                      {sort.split(" ")[1] === "1" ? (
                        <ArrowDown className="w-5 h-5" />
                      ) : (
                        <ArrowUp className="w-5 h-5" />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category Dropdown */}
            <div className="dropdown dropdown-center">
              <button className="btn m-1">
                <ListFilter className="w-5 h-5" />
              </button>
              <ul className="dropdown-content menu bg-base-100 rounded-box z-[999] w-52 p-2 shadow-sm">
                <li className='flex gap-2 items-center' onClick={() => changeCategory("")}>
                  <span className="inline">All</span>
                </li>
                {category.map((cat) => (
                  <li key={cat} className='flex gap-2 items-center' onClick={() => changeCategory(cat)}>
                    <span className="inline">{cat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Auth Buttons */}
            {authUser ? (
              <div className="dropdown dropdown-center">
                <button className="btn m-1">
                  <EllipsisVertical className="w-5 h-5" />
                </button>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-[999] w-52 p-2 shadow-sm">
                  <li>
                    <Link to="/profile" className="flex gap-2 items-center">
                      <User className="size-6" />
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/create" className="flex gap-2 items-center">
                      <Plus className="size-6" />
                      <span>Upload (Admin)</span>
                    </Link>
                  </li>
                  <li>
                    <button className="flex gap-2 items-center" onClick={logout}>
                      <LogOut className="size-6" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="flex gap-2 items-center">
                <LogIn className="size-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
