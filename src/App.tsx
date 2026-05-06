import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Layouts
import MainLayout from './layouts/MainLayout';
// import AdminLayout from './layouts/AdminLayout';
import AdminLayout from './layouts/AdminLayout';

// Import Pages
import Home from './pages/main/Home';
import Dashboard from './pages/admin/Dashboard';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedAdmin from "./pages/auth/ProtectedAdmin";
import ProductManagement from './pages/admin/ProductManagement';
import AddProduct from './pages/admin/AddProduct';
import OrdersManagement from './pages/admin/OrdersManagement';
import OrdersDetail from './pages/admin/OrderDetail';
import UsersManagement from './pages/admin/UsersManagement';
import CatagoriesManagement from './pages/admin/CategoriesManagement';
import AddCategory from './pages/admin/AddCategory';
import EditCategory from './pages/admin/EditCategory';
import VouchersManagement from './pages/admin/VouchersManagement';
import AddVoucher from './pages/admin/AddVoucher';
import AdminProfile from './pages/admin/AdminProfile';
import EditProduct from './pages/admin/EditProduct';
import EditVoucher from './pages/admin/EditVoucher';
import CategoryPage from './pages/main/CategoryPage';
import ShopGrid from './pages/main/ShopGrid';
import ProductDetail from './pages/main/ProductDetail';
import AccountLayout from './layouts/AccountLayout';
import MyOrders from './pages/main/profile/MyOrders';
import MyAddress from './pages/main/profile/MyAddress';
import MyInfor from './pages/main/profile/MyInfor';
import MyPassword from './pages/main/profile/MyPassword';
import AddMyAddress from './pages/main/profile/AddMyAddress';
import Cart from './pages/main/Cart';
import Checkout from './pages/main/Checkout';
import OrderSuccess from './pages/main/OrderSuccess';
import MyDetailOrder from './pages/main/profile/MyDetailOrder';
import EditMyAddress from './pages/main/profile/EditMyAddress';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Contact from './pages/main/Contact';
import AboutUs from './pages/main/AboutUs';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="shop-grid" element={<ShopGrid />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/shoping-cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />

          

          {/* <Route path="contact" element={<Contact />} /> */}
        </Route>

        <Route path="/admin" element={
          <ProtectedAdmin>
            <AdminLayout />
          </ProtectedAdmin>
        }>
          <Route index element={<Dashboard />} />
          <Route path="product-management" element={<ProductManagement />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="orders-management" element={<OrdersManagement />} />
          <Route path="order-detail/:id" element={<OrdersDetail />} />
          <Route path="users-management" element={<UsersManagement />} />
          <Route path="category-management" element={<CatagoriesManagement />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="edit-category/:slug" element={<EditCategory />} />
          <Route path="voucher-management" element={<VouchersManagement />} />
          <Route path="add-voucher" element={<AddVoucher />} />
          <Route path="edit-voucher/:id" element={<EditVoucher />} />
          <Route path="admin-profile" element={<AdminProfile />} />
        </Route>


        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/account" element={<AccountLayout />}>
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="order-detail/:id" element={<MyDetailOrder />} />
          <Route path="my-address" element={<MyAddress />} />
          <Route path="add-address" element={<AddMyAddress />} />
          <Route path="edit-address/:id" element={<EditMyAddress />} />
          <Route path="my-info" element={<MyInfor />} />
          <Route path="my-password" element={<MyPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;