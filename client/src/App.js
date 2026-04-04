import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AddOrder from "./pages/order/addOrder";
import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "./services/api";
import EditOrder from "./pages/order/editOrder";
import authUser from "./services/authUser";
import OpenOrders from "./pages/order/openOrders";
import ClosedOrders from "./pages/order/closedOrders";
import CloseOrder from "./pages/order/closeOrder";
import EditClosedOrder from "./pages/order/editClosedOrder";
import Customers from "./pages/customer/customers";
import EditCustomer from "./pages/customer/editCustomer";
import AddCustomer from "./pages/customer/addCustomer";
import Transactions from "./pages/transaction/transactions";
import AddTransaction from "./pages/transaction/addTransaction";
import EditTransaction from "./pages/transaction/editTransaction";
import Products from "./pages/product/products";

function App() {
  const token = useSelector((state) => state.userReducer.token);
  const userRole = useSelector((state) => state.userReducer.role);
  const currentUser = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Fetching essential data first (products)
      const fetchInitialData = async () => {
        try {
          // Fetch products first as they are needed for the dashboard page
          const productsResp = await api.epGetProducts(token);
          if (productsResp.status === 200) {
            dispatch({
              type: "GET_PRODUCTS",
              payload: productsResp.data.products,
            });
          }

          // Fetch additional data (orders and customers) after products are loaded
          fetchAdditionalData();
        } catch (error) {
          console.error(error);
          alert(
            "אירעה תקלה. אנא בדקו את החיבור לאינטרנט או נסו שוב מאוחר יותר"
          );
          authUser.deleteToken();
          navigate("/login");
        }
      };

      // Fetch additional data in the background
      const fetchAdditionalData = async () => {
        try {
          const [ordersResp, customersResp, transactionsResp, usersResp] =
            await Promise.all([
              api.epGetOrders(token),
              api.epGetCustomers(token),
              api.epGetTransactions(token),
              token && userRole === "admin"
                ? api.epGetUsers(token)
                : api.epGetUser(currentUser.userId, token),
            ]);

          if (ordersResp.status === 200) {
            dispatch({ type: "GET_ORDERS", payload: ordersResp.data.orders });
          }
          if (customersResp.status === 200) {
            dispatch({
              type: "GET_CUSTOMERS",
              payload: customersResp.data.customers,
            });
          }
          if (transactionsResp.status === 200) {
            dispatch({
              type: "GET_TRANSACTIONS",
              payload: transactionsResp.data.transactions,
            });
          }
          if (usersResp.status === 200) {
            dispatch({ type: "GET_USERS", payload: usersResp.data.users });
          }
        } catch (error) {
          console.error("Failed to fetch additional data:", error);
        }
      };

      fetchInitialData();
    }
  }, [token, userRole, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={token ? <Home /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="addOrder" element={<AddOrder />} />
        <Route path="editOrder/:id" element={<EditOrder />} />
        <Route path="closeOrder/:id" element={<CloseOrder />} />
        <Route path="editClosedOrder/:id" element={<EditClosedOrder />} />
        <Route path="openOrders" element={<OpenOrders />} />
        <Route path="closedOrders" element={<ClosedOrders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="addCustomer" element={<AddCustomer />} />
        <Route path="editCustomer/:id" element={<EditCustomer />} />
        <Route path="products" element={<Products />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="addTransaction" element={<AddTransaction />} />
        <Route path="editTransaction/:id" element={<EditTransaction />} />
      </Route>
    </Routes>
  );
}

export default App;
