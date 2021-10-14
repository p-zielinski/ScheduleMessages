import { Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Login/Login";
import ConfirmEmail from "./ConfirmEmail/ConfirmEmail";
import Register from "./Register/Register";
import Home from "./Home/Home";
import Loading from "../utils/Loading";

const NotLogged = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [justRegister, setJustRegister] = useState(false); //zmienic na false
  return (
    <div>
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
      <Route>
        <Home />
      </Route>
    </div>
  );
};

export default NotLogged;
