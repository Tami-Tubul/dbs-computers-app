const getToken = () => {
  return sessionStorage["token"];
};

const saveToken = (token) => {
  sessionStorage["token"] = token;
};

const deleteToken = () => {
  sessionStorage.clear();
};

const getUser = () => {
  return sessionStorage["user"];
};

const saveUser = (user) => {
  sessionStorage["user"] = user;
};

const getRole = () => {
  return sessionStorage["role"];
};

const saveRole = (role) => {
  sessionStorage["role"] = role;
};

const saveUserId = (id) => {
  localStorage.setItem("userId", id);
};

const getUserId = () => {
  return localStorage.getItem("userId");
};

const authUser = {
  saveToken,
  getToken,
  deleteToken,
  getUser,
  saveUser,
  getRole,
  saveRole,
  getUserId,
  saveUserId,
};

export default authUser;
