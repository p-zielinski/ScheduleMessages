import parse from "html-react-parser";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  setToken as setTokenRedux,
} from "../../store/actions/userDataActions";
import { useLocation } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Settings from "./Settings/Settings";
import Schedule from "./Schedule/Schedule";
import NavBar from "./Schared/NavBar";
import Messages from "./Messages/Messages";
import Logs from "./Logs/Logs";
import axios from "axios";
import Loading from "../utils/Loading";
const jwt = require("jsonwebtoken");

const ExtendSession = async (token) => {
  return await axios({
    method: "post",
    url: "/api/extend_session",
    timeout: 1000 * 5, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: { token: token },
  })
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

const Logged = ({ LogOut, token, setToken }) => {
  const dispatch = useDispatch();
  const tokenRef = useRef();
  const currentLocation = useLocation().pathname;
  const [prevLocation, setPrevLocation] = useState("");
  const [newestScheduledMessage, setNewestScheduledMessage] =
    useState(undefined);
  const [showExtendSessionButton, setShowExtendSessionButton] = useState(false);
  const [timeLeft, setTimeLeft] = useState("&nbsp;");
  const [isLoadingExtendSession, setIsLoadingExtendSession] = useState(false);

  const watchTokenExp = async (token) => {
    const decoded = await jwt.decode(token);
    const expiresIn = await (new Date(0).setUTCSeconds(decoded.exp) -
      Date.now());

    const howManyMinutesBeforeAskToExtendSession = 10;
    let secondsTotal = Math.round(expiresIn / 1000);
    const localToken = token;

    setTimeout(async () => {
      let index = 0;
      secondsTotal = Math.round(
        (new Date(0).setUTCSeconds(decoded.exp) - Date.now()) / 1000
      );

      const whileF = async () => {
        try {
          if (localToken !== tokenRef.current.value) {
            return 0; //stop
          }
        } catch (e) {}
        let _timeLeft = "";
        const minutes = Math.floor(secondsTotal / 60);
        if (minutes > 0) {
          _timeLeft += minutes + " minute";
        }
        if (minutes > 1) {
          _timeLeft += "s";
        }
        const seconds = secondsTotal % 60;
        if (seconds > 0 && minutes > 0) {
          _timeLeft += " ";
        }
        if (seconds > 0 || minutes === 0) {
          _timeLeft += seconds + " second";
        }
        if ((seconds !== 1 && seconds > 0) || minutes === 0) {
          _timeLeft += "s";
        }
        setTimeLeft(_timeLeft);
        setTimeout(() => {
          if (secondsTotal <= 0) {
            LogOut();
          } else {
            whileF();
            secondsTotal -= 1;
          }
        }, 1000);
      };
      if (index === 0) {
        whileF();
        setShowExtendSessionButton(true);
        index += 1;
      }
    }, expiresIn - howManyMinutesBeforeAskToExtendSession * 60000);
  };

  useEffect(async () => {
    tokenRef.current.value = token;
    await dispatch(fetchData());
    setTimeout(async () => {
      watchTokenExp(token);
    }, 3000);
  }, []);

  const extendSession = async () => {
    setIsLoadingExtendSession(true);
    const data = await ExtendSession(token);
    setIsLoadingExtendSession(false);
    if (typeof data.error !== "object") {
      setToken = data.token;
      localStorage.setItem("token", data.token);
      tokenRef.current.value = data.token;
      await dispatch(setTokenRedux(data.token));
      setShowExtendSessionButton(false);
      setTimeout(async () => {
        watchTokenExp(data.token);
      }, 3000);
    } else {
      alert("Error while extending the session occurred.");
    }
  };

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
      <input type="text" hidden={true} ref={tokenRef}></input>
      <div className={"logged-nav-area"}>
        <NavBar LogOut={LogOut} />
      </div>
      <div className={"logged-work-area"}>
        {showExtendSessionButton && (
          <div className={"session-timer-wrapper"}>
            <div className={"center session-timer-holder"}>
              <div>
                <i
                  className="fas fa-times"
                  style={{ marginTop: -5, marginRight: -5 }}
                  onClick={() => setShowExtendSessionButton(false)}
                ></i>
                {!isLoadingExtendSession ? (
                  <>
                    <p className={"center"} style={{ textAlign: "center" }}>
                      Your session will expire in
                    </p>
                    <p className={"center"} style={{ textAlign: "center" }}>
                      {parse(timeLeft)}
                    </p>
                    <p className={"center"} style={{ textAlign: "center" }}>
                      You will be automatically logged out,
                      <br />
                      unless you will click the button below.
                    </p>
                    <p
                      className={"center add_icon session-timer-button"}
                      style={{
                        width: "auto",
                        height: "auto",
                        minHeight: "auto",
                        padding: "5px 10px 5px 10px",
                        marginTop: 5,
                      }}
                      onClick={() => extendSession()}
                    >
                      EXTEND YOU SESSION
                    </p>
                  </>
                ) : (
                  <div style={{ marginTop: "3.65rem" }}>
                    <Loading
                      key={"static"}
                      size={"1.5rem"}
                      margin={"1rem"}
                      background={"rgba(0,1,255,0.62)"}
                      height={"-3rem"}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentLocation === "/settings" ? (
          <Settings />
        ) : currentLocation === "/schedule" ? (
          <Schedule setNewestScheduledMessage={setNewestScheduledMessage} />
        ) : currentLocation === "/messages" ? (
          <Messages />
        ) : currentLocation === "/logs" ? (
          <Logs />
        ) : (
          <Dashboard newestScheduledMessage={newestScheduledMessage} />
        )}
        <div className={"add-120px-if-mobile"}></div>
      </div>
    </div>
  );
};

export default Logged;
