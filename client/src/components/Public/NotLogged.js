import { Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Login/Login";
import ConfirmEmail from "./ConfirmEmail/ConfirmEmail";
import Register from "./Register/Register";
import Home from "./Home/Home";
import Loading from "../utils/Loading";
import ChangePassword from "./ChangePassword/ChangePassword";
import ChangeEmail from "./ChangeEmail/ChangeEmail";

const NotLogged = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [justRegister, setJustRegister] = useState(false); //zmienic na false
  return (
    <>
      <Route path="/register">
        <Register
          Loading={Loading}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          setJustRegister={setJustRegister}
        />
      </Route>
      <Route path="/login">
        <Login
          Loading={Loading}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          setToken={setToken}
        />
      </Route>
      <Route path="/confirm_email">
        <ConfirmEmail
          Loading={Loading}
          email={email}
          setEmail={setEmail}
          justRegister={justRegister}
          setJustRegister={setJustRegister}
          setToken={setToken}
        />
      </Route>
      <Route path="/change_password">
        <ChangePassword
          Loading={Loading}
          password={password}
          setPassword={setPassword}
          email={email}
          setEmail={setEmail}
          setToken={setToken}
        />
      </Route>
      <Route path="/change_email">
        <ChangeEmail
          Loading={Loading}
          password={password}
          setPassword={setPassword}
          email={email}
          setEmail={setEmail}
          setToken={setToken}
        />
      </Route>
      <Route>
        <Home />
      </Route>
    </>
  );
};

export default NotLogged;
