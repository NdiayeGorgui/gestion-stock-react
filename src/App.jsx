import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './components/admin/Admin';
import Dashboard from './components/admin/Dashboard';
import Products from './components/products/Products';
import Customers from './components/customers/Customers';
import CreateOrder from './components/orders/CreateOrder';
import Payment from './components/payments/Payment';
import Profile from './components/admin/Profile';
import Home from './components/home/Home';
import FooterComponent from './components/home/FooterComponent';
import ChatBot from './components/admin/ChatBot';
import Login from './components/home/Login';
import CreatedOrders from './components/orders/CreatedOrders';
import CompletedOrders from './components/orders/CompletedOrders';
import CanceledOrders from './components/orders/CanceledOrders';
import Ships from './components/ships/Ships';
import Delivers from './components/delivers/Delivers';
import Product from './components/products/Product';
import ProductDetails from './components/products/ProductDetails';
import Customer from './components/customers/Customer';
import CustomerDetails from './components/customers/CustomerDetails';
import Deliver from './components/delivers/Deliver';
import Ship from './components/ships/Ship';
import Bills from './components/bills/Bills';
import Bill from './components/bills/Bill';
import Payments from './components/payments/Payments';
import OrderDetails from './components/orders/OrderDetails';
import CreatePayment from './components/payments/CreatePayment';
import OrderCreatedDetails from './components/orders/OrderCreatedDetails';
import OrderEvents from './components/orders/OrderEvents';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import KeycloakProviderWrapper from './components/Keycloack/KeycloakProviderWrapper';


function App() {
 

  return (
    <KeycloakProviderWrapper>
    <BrowserRouter>
      <div className="app-layout">
        {/* Contenu principal */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/home" />} />
            <Route path="/admin" element={<Admin />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<Product />} />
              <Route path="edit-product/:id" element={<Product />} />
              <Route path="product-details/:id" element={<ProductDetails />} />
              <Route path="customers" element={<Customers />} />
              <Route path="add-customer" element={<Customer />} />
              <Route path="edit-customer/:id" element={<Customer />} />
              <Route path="customer-details/:id" element={<CustomerDetails />} />
              <Route path="create-order" element={<CreateOrder />} />
              <Route path="bills" element={<Bills />} />
              <Route path="bill/:id" element={<Bill />} />
              <Route path="payments" element={<Payments />} />
              <Route path="payment/:id" element={<Payment />} />
              <Route path="create-payment/:id" element={<CreatePayment />} />
              <Route path="profile" element={<Profile />} />
              <Route path="chat-bot" element={<ChatBot />} />
              <Route path="home" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="orderDetails/:id" element={<OrderDetails />} />
              <Route path="created-order-details/:id" element={<OrderCreatedDetails />} />
              <Route path="created-orders" element={<CreatedOrders />} />
              <Route path="completed-orders" element={<CompletedOrders />} />
              <Route path="canceled-orders" element={<CanceledOrders />} />
              <Route path="order-events" element={<OrderEvents />} />
              <Route path="ships" element={<Ships />} />
              <Route path="ship/:id" element={<Ship />} />
              <Route path="delivers" element={<Delivers />} />
              <Route path="deliver/:id" element={<Deliver />} />
            </Route>
          </Routes>

          {/* Footer toujours en bas, pleine largeur */}
          <FooterComponent />
        </div>
      </div>
    </BrowserRouter>
    </KeycloakProviderWrapper>
  );
}

export default App;
