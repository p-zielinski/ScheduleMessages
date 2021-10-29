import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Info from "../Shared/Info";
import styled from "styled-components";
import jwt from "jsonwebtoken";
import { useDispatch } from "react-redux";
import { setTokenAndEmailInStorage } from "../../../store/actions/userDataActions";

const LoginUser = async (credentials) => {
  return await axios({
    method: "post",
    url: "/api/sign_in",
    timeout: 1000 * 3, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: credentials,
  })
    .then((response) => response.data)
    .catch((error) => error.response);
};

const CheckEmailInDatabase = async (email) => {
  return await axios({
    method: "post",
    url: "/api/check_email",
    timeout: 1000 * 3, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      email: email,
    },
  })
    .then((response) => response.data)
    .catch((error) => error.response);
};

const emailRegexp =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const Login = ({
  Loading,
  email,
  setEmail,
  password,
  setPassword,
  setToken,
}) => {
  const inputPasswordRef = useRef();
  const inputEmailRef = useRef();
  const passwordWarningRef = useRef();
  const emailWarningRef = useRef();
  const submitButtonRef = useRef();
  const redirectToConfirm = (
    <Link to="/confirm_email" id={"form-link"}>
      <b>here</b>
    </Link>
  );
  const [linkHolder, setLinkHolder] = useState("");
  const [typeOfInfo, setTypeOfInfo] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  const didEmailChanged = async () => {
    await timeout(1000);
    if (email === inputEmailRef.current.value) {
      return false;
    } else {
      return true;
    }
  };

  const didPasswordChanged = async (ms) => {
    await timeout(800);
    if (password === inputPasswordRef.current.value) {
      return false;
    } else {
      return true;
    }
  };

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  let [lastEmailCheckedSuccessfully, setLastEmailCheckedSuccessfully] =
    useState(null);
  let [
    lastEmailCheckedSuccessfullyResponse,
    setLastEmailCheckedSuccessfullyResponse,
  ] = useState({});
  let emailResponse = {};
  const [wasAtCharacterSeen, setWasAtCharacterSeen] = useState(false);
  const [formIsChecking, setFormIsChecking] = useState(false);

  useEffect(() => {
    if (email === "" && password === "") {
      setFormIsChecking(false);
    }
  }, [email, password]);

  useEffect(() => {
    if (email === "" && password === "") {
      setFormIsChecking(false);
    }
    setTimeout(function () {
      if (
        inputPasswordRef.current.value === "" &&
        inputEmailRef.current.value === ""
      ) {
        setFormIsChecking(false);
      }
    }, 1000);
  }, []);

  const checkForm = async () => {
    submitButtonRef.current.disabled = true;
    emailWarningRef.current.innerHTML = "&nbsp;";
    setLinkHolder("");
    passwordWarningRef.current.innerHTML = "&nbsp;";
    setFormIsChecking(true);
    if (
      wasAtCharacterSeen ||
      password.length > 0 ||
      email.indexOf("@") !== -1
    ) {
      setWasAtCharacterSeen(true);
      if (emailRegexp.test(email)) {
        emailWarningRef.current.innerHTML = "&nbsp;";
        if (!(await didEmailChanged())) {
          if (email !== lastEmailCheckedSuccessfully) {
            emailResponse = await CheckEmailInDatabase(
              inputEmailRef.current.value
            );
            if (emailResponse.status) {
              //dodane
              if (emailResponse === 500) {
                setTypeOfInfo("connection problem");
              }
            }
          } else {
            emailResponse = lastEmailCheckedSuccessfullyResponse;
          }
          try {
            if (emailResponse.email === inputEmailRef.current.value) {
              if (emailResponse.status === "pending") {
                emailWarningRef.current.innerHTML =
                  "This address email is not confirmed, please do it";
                setLinkHolder(redirectToConfirm);
                setFormIsChecking(false);
              } else if (emailResponse.available === false) {
                setLastEmailCheckedSuccessfully(email);
                setLastEmailCheckedSuccessfullyResponse(emailResponse);
                emailWarningRef.current.innerHTML = "&nbsp;";
                if (!(await didPasswordChanged(500))) {
                  setFormIsChecking(false);
                  if (
                    inputPasswordRef.current.value.length >= 6 &&
                    inputPasswordRef.current.value.length <= 60
                  ) {
                    passwordWarningRef.current.innerHTML = "&nbsp;";
                    submitButtonRef.current.disabled = false;
                  } else if (inputPasswordRef.current.value.length > 0) {
                    passwordWarningRef.current.innerHTML =
                      "Password length has to be at least 6 characters long, but no longer than 60.";
                  }
                }
              } else if (emailResponse.available === true) {
                emailWarningRef.current.innerHTML =
                  "This email is not assigned to any account";
                setFormIsChecking(false);
              }
            }
          } catch (e) {
            //do nothing
          }
        }
      } else {
        if (!(await didEmailChanged())) {
          setFormIsChecking(false);
          emailWarningRef.current.innerHTML = "Invalid email";
        }
      }
    }
  };

  useEffect(async () => {
    try {
      await checkForm();
    } catch (e) {
      console.log(e);
    }
  }, [email, password]);

  useEffect(async () => {
    try {
      inputPasswordRef.current.value = password;
      inputEmailRef.current.value = email;
      await timeout(300);
      await checkForm();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const recoverPasswordHandle = async () => {
    if (inputEmailRef.current.value === lastEmailCheckedSuccessfully) {
      setTypeOfInfo("password recovery email was sent");
      console
        .log
        //send request if sccess, let him know about it.
        ();
    } else {
      setTypeOfInfo("email not valid");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitButtonRef.current.disabled) {
      let response = await LoginUser({
        email,
        password,
      });
      if (response.data) {
        //dodane
        response = response.data;
      }
      if (response.success === true) {
        if (response.token) {
          history.push("/");
          setToken(response.token);
        }
      } else {
        if (response.password) {
          passwordWarningRef.current.innerHTML =
            "Password doesn't match our record";
          submitButtonRef.current.disabled = true;
        }
        if (response.email === "not confirmed") {
          emailWarningRef.current.innerHTML =
            "This address email is not confirmed, please do it";
          setLinkHolder(redirectToConfirm);
          submitButtonRef.current.disabled = true;
        } else if (response.email) {
          emailWarningRef.current.innerHTML =
            "This email is not assigned to any account";
          submitButtonRef.current.disabled = true;
        }
      }
    }
  };

  useEffect(() => {
    inputPasswordRef.current.value = password;
    inputEmailRef.current.value = email;
  }, []);

  return (
    <div className="public-wrapper">
      {typeOfInfo === "email not valid" && (
        <Info
          setTypeOfInfo={setTypeOfInfo}
          text={
            'Please enter a valid email address down below, and click the "Recover Password" link again'
          }
        />
      )}
      {typeOfInfo === "password recovery email was sent" && (
        <Info
          setTypeOfInfo={setTypeOfInfo}
          text={`Password recovery email was sent to ${email}`}
        />
      )}
      {typeOfInfo === "connection problem" && (
        <Info
          setTypeOfInfo={setTypeOfInfo}
          text={
            "We have noticed that the connection between you and our server doesn't work properly. The website may not work."
          }
        />
      )}
      <div className={"holder"}>
        <div className={"flex-wrapper"}>
          <h1 className={"website-name"}>SCHEDULE</h1>
          <h1 className={"website-name"}>MESSAGES</h1>
          <h1 className={"website-name"}>.COM</h1>
        </div>
        <h1 className={"title"}>Log in here</h1>
        <Link to={"/"}>
          <i className="fas fa-times"></i>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="floating">
          <input
            maxLength={200}
            id="input__email"
            className="floating__input"
            name="email"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            ref={inputEmailRef}
          />
          <label
            maxLength={60}
            htmlFor="input__email"
            className="floating__label"
            data-content="E-mail"
          >
            <span className="hidden--visually">E-mail</span>
          </label>
          <div className={"flex-wrapper"}>
            <p className={"warning-holder"} ref={emailWarningRef}>
              &nbsp;
            </p>
            <p className={"link-holder"}>&nbsp;</p>
            <p className={"link-holder"}>{linkHolder}</p>
          </div>
        </div>
        <div className="floating">
          <input
            id="input__password"
            type="password"
            className="floating__input"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            ref={inputPasswordRef}
          />
          <label
            htmlFor="input__password"
            className="floating__label"
            data-content="Password"
          >
            <span className="hidden--visually">Password</span>
          </label>
          <p className={"warning-holder"} ref={passwordWarningRef}>
            &nbsp;
          </p>
        </div>

        <div className={"holder"}>
          <Link to="/register">
            <p className={"form-link"}>Register instead</p>
          </Link>
          <p className={"form-link"} onClick={() => recoverPasswordHandle()}>
            Recover password
          </p>
        </div>
        <div className={"holder"}>Not a robot checkbox here</div>
        <div className={"move-to-bottom"}>
          <div className={"fullW"}>
            <div style={{ marginLeft: 16, marginRight: 16 }}>
              <button
                className={"button center"}
                type={"submit"}
                ref={submitButtonRef}
                disabled
                style={{ fontSize: "2rem" }}
              >
                {formIsChecking ? (
                  <Loading
                    size={"1rem"}
                    margin={".72rem"}
                    background={"rgba(0,01,255,0.291)"}
                  />
                ) : (
                  "log in"
                )}
              </button>
            </div>
          </div>
        </div>
        <test />
      </form>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
