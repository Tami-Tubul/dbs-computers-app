export const orderReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case "GET_ORDERS":
      return {
        ...state,
        orders: action.payload,
      };

    case "ADD_ORDER":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };

    case "EDIT_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
      };

    case "CLOSE_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
      };

    case "EDIT_CLOSED_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
      };

    case "DELETE_ORDER":
      return {
        ...state,
        orders: state.orders.filter((order) => order._id !== action.payload),
      };

    case "UPDATE_ORDERS_WITH_CUSTOMER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.customer._id === action.payload._id
            ? { ...order, customer: action.payload }
            : order
        ),
      };

    case "REOPEN_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
      };

    default:
      return state;
  }
};
