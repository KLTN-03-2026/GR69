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


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
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
          <Route path="edit-product/:id" element={<EditProduct/>} />
          <Route path="orders-management" element={<OrdersManagement />} />
          <Route path="order-detail" element={<OrdersDetail />} />
          <Route path="users-management" element={<UsersManagement />} />
          <Route path="category-management" element={<CatagoriesManagement />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="edit-category/:slug" element={<EditCategory/>} />
          <Route path="voucher-management" element={<VouchersManagement />} />
          <Route path="add-voucher" element={<AddVoucher />} />
          <Route path="edit-voucher/:id" element={<EditVoucher />} />
          <Route path="admin-profile" element={<AdminProfile />} />
        </Route>


        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;