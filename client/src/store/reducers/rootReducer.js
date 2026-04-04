import { combineReducers } from "redux";
import { orderReducer } from "./orderReducer";
import { productReducer } from "./productReducer";
import { customerReducer } from "./customerReducer";
import { userReducer } from "./userReducer";
import { transactionReducer } from "./transactionReducer";

const rootReducer = combineReducers({
  customerReducer,
  orderReducer,
  productReducer,
  userReducer,
  transactionReducer,
});

export default rootReducer;
