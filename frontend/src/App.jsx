import { Routes, Route ,Navigate } from "react-router-dom"
import { useEffect } from "react"

import { useAuthStore } from "./store/useAuthStore"

import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import Navbar from "./components/Navbar"
import Createprod from "./pages/Createprod"
import ProfilePage from "./pages/ProfilePage"
import ProductView from "./pages/ProductView"
import Cart from "./pages/Cart"

import { Toaster } from "react-hot-toast"
import { Loader } from "lucide-react"


function App() {
  const { authUser, isCheckingAuth ,checkAuth} = useAuthStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <div data-theme="dark"> 
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/"/>} />
          <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>} />
          <Route path="/create" element={authUser?<Createprod mode="create"/>:<Navigate to="/login" />} />
          <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login" />} />
          <Route path="/product/:id" element={<ProductView/>} />
          <Route path="/cart" element={authUser?<Cart/>:<Navigate to="/login" />} />
          <Route path="/edit" element={authUser.isAdmin?<Createprod mode="update"/>:<Navigate to="/"/>} />
      </Routes>
    </div>
    
  )
}

export default App
