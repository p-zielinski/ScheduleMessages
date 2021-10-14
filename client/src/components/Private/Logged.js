import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Settings from "./Settings/Settings";
import Schedule from "./Schedule/Schedule";
import NavBar from "./Schared/NavBar";

const downloadMessages = async (token) => {
  return await axios
    .post("/api/messages", { token: token })
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

const Logged = ({ token, LogOut }) => {
  const [updateKey, setUpdateKey] = useState();
  const [messages, setMessages] = useState();
  const currentLocation = useLocation().pathname;

  useEffect(async () => {
    const response = await downloadMessages(token);
    if (response.errors) {
      LogOut();
    } else {
      setMessages(response.result);
    }
  }, []);

  return (
    <div>
      <div className={"main-area"}>
        <div className={"logged-nav-area"}>
          <NavBar LogOut={LogOut} />
        </div>
        <div className={"logged-work-area"}>
          {currentLocation === "/settings" ? (
            <Settings />
          ) : currentLocation === "/schedule" ? (
            <Schedule />
          ) : (
            <Dashboard
              token={token}
              setMessages={setMessages}
              messages={messages}
              updateKey={updateKey}
              setUpdateKey={setUpdateKey}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Logged;
