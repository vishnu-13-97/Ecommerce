import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public pages
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Testimonial from "./pages/Testimonial";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import VerifyOtp from "./pages/VerifyOtp";
import NotFound from "./pages/NotFound";
import ProductDetails from "./components/ProductDetails";

// User pages
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddressesList from "./pages/AddressList";
import AddAddress from "./pages/AddAddress";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

// Layout components
import Spinner from "./components/Spinners";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchModal from "./components/SearchModal";
import BackToTopButton from "./components/BackToTopButton";

// Protected routes
import ProtectedUserRoute from "./components/user/ProtectedUserRoute";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoutes";

// Admin components
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

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <Spinner />

      {/* Show Navbar & Footer only for non-admin routes */}
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <SearchModal />}

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ================= USER PROTECTED ROUTES ================= */}
        <Route element={<ProtectedUserRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit-profile" element={<EditProfile />} />
          <Route path="/profile/addresses" element={<AddressesList />} />
          <Route path="/profile/addresses/add" element={<AddAddress />} />
          <Route path="/profile/addresses/edit/:id" element={<AddAddress />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* ================= ADMIN PROTECTED ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="product" element={<Products />} />
          <Route path="product/new" element={<ProductForm />} />
          <Route path="product/edit/:productId" element={<ProductForm />} />

          <Route path="orders" element={<Orders />} />

          <Route path="brand" element={<Brands />} />
          <Route path="brand/new" element={<BrandForm />} />
          <Route path="brand/edit/:brandId" element={<BrandForm />} />

          <Route path="category" element={<Categories />} />
          <Route path="category/new" element={<CategoryForm />} />
          <Route path="category/edit/:categoryId" element={<CategoryForm />} />

          <Route path="user" element={<Users />} />
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BackToTopButton />}
    </>
  );
};

export default App;
