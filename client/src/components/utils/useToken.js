import { useState } from "react";

const useToken = () => {
  const getToken = () => {
    let tokenString = localStorage.getItem("token");
    if (tokenString) {
      tokenString = tokenString.replace(/"/g, "");
    }
    return tokenString;
  };
  const [token, setToken] = useState(getToken());
  const saveToken = (userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
  };
  return {
    setToken: saveToken,
    token,
  };
};

export default useToken;
