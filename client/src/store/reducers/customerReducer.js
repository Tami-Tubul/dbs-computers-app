export const customerReducer = (state = { customers: [] }, action) => {
  switch (action.type) {
    case "GET_CUSTOMERS":
      return {
        ...state,
        customers: action.payload,
      };
    case "ADD_CUSTOMER":
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };
    case "EDIT_CUSTOMER":
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer,
        ),
      };

    case "DELETE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer._id !== action.payload,
        ),
      };

    default:
      return state;
  }
};
