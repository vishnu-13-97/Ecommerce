import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Public pages
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Testimonial from "./pages/Testimonial";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import ProductDetails from "./components/ProductDetails";
import VerifyOtp from "./pages/VerifyOtp";

// Layouts
import Spinner from "./components/Spinners";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchModal from "./components/SearchModal";
import BackToTopButton from "./components/BackToTopButton";

// Admin imports
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoutes";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Brands from "./pages/admin/Brands";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";
import BrandForm from "./pages/admin/AdminBranForm";
import CategoryForm from "./pages/admin/AdminCategoryForm";
import ProductForm from "./pages/admin/AdminProductForm";
import EditProfile from "./pages/EditProfile";
import AddressesList from "./pages/AddressList";
import AddAddress from "./pages/AddAddress";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
        <ToastContainer position="top-center" autoClose={2000} />
      <Spinner />
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <SearchModal />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit-profile" element={<EditProfile/>}/>
          <Route path="/profile/addresses" element={<AddressesList />} />
          <Route path="/profile/addresses/add" element={<AddAddress/>}/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="*" element={<NotFound />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="product" element={<Products />} />
                   <Route path="product/new" element={<ProductForm />} />
                    <Route path="product/edit/:productId" element={<ProductForm />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="brand" element={<Brands />} />
                  <Route path="brand/new" element={<BrandForm/>}/>
                   <Route path="brand/edit/:brandId" element={<BrandForm/>}/>
                  <Route path="category" element={<Categories />} />
                     <Route path="category/new" element={<CategoryForm />} />
                        <Route path="category/edit/:categoryId" element={<CategoryForm />} />
                  <Route path="user" element={<Users />} />
                </Routes>
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
      </Routes>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BackToTopButton />}
       
    </>
  );
};

export default App;
