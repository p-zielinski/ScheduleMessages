import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
import { fetchData } from "../../store/actions/userDataActions";
import { useLocation } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Settings from "./Settings/Settings";
import Schedule from "./Schedule/Schedule";
import NavBar from "./Schared/NavBar";
import Messages from "./Messages/Messages";
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

const Logged = ({ LogOut, token }) => {
  const dispatch = useDispatch();
  const currentLocation = useLocation().pathname;
  const [prevLocation, setPrevLocation] = useState("");

  const watchTokenExp = async () => {
    const decoded = await jwt.decode(token);
    const expiresIn = await (new Date(0).setUTCSeconds(decoded.exp) -
      Date.now());
    console.log(expiresIn / 60000, "minutes");

    const howManyMinutesBeforeAskToExtendSession = 10;

    setTimeout(() => {
      // alert(
      //   `Your session will expire in ${
      //     (new Date(0).setUTCSeconds(decoded.exp) - Date.now()) / 60000
      //   } minutes`
      // );
      setTimeout(() => {
        LogOut();
      }, expiresIn);
    }, expiresIn - howManyMinutesBeforeAskToExtendSession * 60000);
  };

  useEffect(async () => {
    dispatch(fetchData());

    watchTokenExp();
  }, []);

  useEffect(() => {
    setPrevLocation(currentLocation);
    if (prevLocation === "/schedule") {
      dispatch({
        type: "clear_schedule",
      });
    }
  }, [currentLocation]);

  return (
    <div className={"main-area"}>
      <div className={"logged-nav-area"}>
        <NavBar LogOut={LogOut} />
      </div>
      <div className={"logged-work-area"}>
        {currentLocation === "/settings" ? (
          <Settings />
        ) : currentLocation === "/schedule" ? (
          <Schedule />
        ) : currentLocation === "/messages" ? (
          <Messages />
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
};

export default Logged;
