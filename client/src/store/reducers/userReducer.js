import authUser from "../../services/authUser";

const initialState = {
  users: [],
  token: authUser.getToken(),
  nameOfUser: authUser.getUser(),
  role: authUser.getRole(),
  userId: authUser.getUserId(),
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECT":
      authUser.saveToken(action.payload.token);
      authUser.saveUser(action.payload.connectedUser.nickName);
      authUser.saveRole(action.payload.connectedUser.role);
      authUser.saveUserId(action.payload.connectedUser._id);
      return {
        ...state,
        token: action.payload.token,
        nameOfUser: action.payload.connectedUser.nickName,
        role: action.payload.connectedUser.role,
        userId: action.payload.connectedUser._id,
      };
    case "GET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
};
