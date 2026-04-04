import axios from "axios";

const baseURL = process.env.REACT_APP_API_KEY;

const epLogin = (user) => {
  return axios.post(`${baseURL}/auth/login`, user);
};

const epLogout = (token) => {
  return axios.post(`${baseURL}/auth/logout`, {
    headers: { "x-access-token": token },
  });
};

const epGetUsers = (token) => {
  return axios.get(`${baseURL}/users`, {
    headers: { "x-access-token": token },
  });
};

const epGetUser = (userId, token) => {
  return axios.get(`${baseURL}/users/${userId}`, {
    headers: { "x-access-token": token },
  });
};

const epGetProducts = (token) => {
  return axios.get(`${baseURL}/products`, {
    headers: { "x-access-token": token },
  });
};

const epGetCategories = (token) => {
  return axios.get(`${baseURL}/products/categories`, {
    headers: { "x-access-token": token },
  });
};

const epGetOrders = (token) => {
  return axios.get(`${baseURL}/orders`, {
    headers: { "x-access-token": token },
  });
};

const epAddOrder = (newOrder, token) => {
  return axios.post(`${baseURL}/orders/addOrder`, newOrder, {
    headers: { "x-access-token": token },
  });
};

const epEditOrder = (updatedOrder, orderId, token) => {
  return axios.put(`${baseURL}/orders/editOrder/${orderId}`, updatedOrder, {
    headers: { "x-access-token": token },
  });
};

const epCloseOrder = (updatedOrder, orderId, token) => {
  return axios.put(`${baseURL}/orders/closeOrder/${orderId}`, updatedOrder, {
    headers: { "x-access-token": token },
  });
};

const epEditClosedOrder = (updatedClosedOrder, orderId, token) => {
  return axios.put(
    `${baseURL}/orders/editClosedOrder/${orderId}`,
    updatedClosedOrder,
    {
      headers: { "x-access-token": token },
    }
  );
};

const epDeleteOrder = (orderId, token) => {
  return axios.delete(`${baseURL}/orders/deleteOrder/${orderId}`, {
    headers: { "x-access-token": token },
  });
};

const epReopenOrder = (orderId, token) => {
  return axios.put(
    `${baseURL}/orders/reopenOrder/${orderId}`,
    {},
    {
      headers: { "x-access-token": token },
    }
  );
};

const epGetCustomers = (token) => {
  return axios.get(`${baseURL}/customers`, {
    headers: { "x-access-token": token },
  });
};

const epAddCustomer = (newCustomer, token) => {
  return axios.post(`${baseURL}/customers/addCustomer`, newCustomer, {
    headers: { "x-access-token": token },
  });
};

const epEditCustomer = (updatedCustomer, customerId, token) => {
  return axios.put(
    `${baseURL}/customers/editCustomer/${customerId}`,
    updatedCustomer,
    {
      headers: { "x-access-token": token },
    }
  );
};

const epGetTransactions = (token) => {
  return axios.get(`${baseURL}/transactions`, {
    headers: { "x-access-token": token },
  });
};

const epAddTransaction = (newTransaction, token) => {
  return axios.post(`${baseURL}/transactions/addTransaction`, newTransaction, {
    headers: { "x-access-token": token },
  });
};

const epEditTransaction = (updatedTransaction, transactionId, token) => {
  return axios.put(
    `${baseURL}/transactions/editTransaction/${transactionId}`,
    updatedTransaction,
    {
      headers: { "x-access-token": token },
    }
  );
};

const epDeleteTransaction = (transactionId, token) => {
  return axios.delete(
    `${baseURL}/transactions/deleteTransaction/${transactionId}`,
    {
      headers: { "x-access-token": token },
    }
  );
};

const epFinishTransaction = (transactionId, token) => {
  return axios.put(
    `${baseURL}/transactions/finishTransaction/${transactionId}`,
    {},
    {
      headers: { "x-access-token": token },
    }
  );
};

const api = {
  epLogin,
  epLogout,
  epGetUsers,
  epGetUser,
  epGetProducts,
  epGetCategories,
  epGetOrders,
  epAddOrder,
  epEditOrder,
  epCloseOrder,
  epEditClosedOrder,
  epDeleteOrder,
  epReopenOrder,
  epGetCustomers,
  epAddCustomer,
  epEditCustomer,
  epGetTransactions,
  epAddTransaction,
  epEditTransaction,
  epDeleteTransaction,
  epFinishTransaction,
};
export default api;
