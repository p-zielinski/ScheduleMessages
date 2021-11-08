import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.css";
import { BrowserRouter, Route, useHistory } from "react-router-dom";
import NotLogged from "./components/Public/NotLogged";
import Logged from "./components/Private/Logged";
//token module
import useToken from "./components/utils/useToken";
import { useEffect, useState } from "react";
import {
  setTokenAndEmailInStorage,
  clearData,
} from "./store/actions/userDataActions";
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import axios from "axios";

function App() {
  const { token, setToken } = useToken();

  const dispatch = useDispatch();

  const verifyToken = async (token) => {
    return await axios
      .post("/api/is_token_valid", { token: token })
      .then((response) => response.data)
      .catch((error) => error.response.data);
  };

  useEffect(async () => {
    if (token) {
      if (token.length > 10) {
        const response = await verifyToken(token);
        if (response.valid) {
          const decoded = await jwt.decode(token);
          dispatch(setTokenAndEmailInStorage(token, decoded.email));
          localStorage.setItem("token", token);
        } else {
          LogOut();
          return 0;
        }
      }
    }
  }, [token]);

  const LogOut = () => {
    dispatch(clearData());
    localStorage.clear();
    setToken("");
  };

  if (!token) {
    return (
      <>
        <BrowserRouter>
          <Route path="/">
            <NotLogged setToken={setToken} />
          </Route>
        </BrowserRouter>
      </>
    );
  }

  return (
    <BrowserRouter>
      <Route path="/">
        <Logged token={token} setToken={setToken} LogOut={LogOut} />
      </Route>
    </BrowserRouter>
  );
}

export default App;
