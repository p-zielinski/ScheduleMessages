import { Link, useHistory, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import queryString from "query-string";
import Info from "../Shared/Info";
import { passwordStrength } from "check-password-strength";

const ChangePasswordFinalReq = async (credentials) => {
  return await axios({
    method: "post",
    url: "/api/change_password_final_step",
    timeout: 1000 * 3, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: credentials,
  })
    .then((response) => response.data)
    .catch((error) => error.response.data);
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
    .catch((error) => error.response.status);
};

const GetRealEmail = async (credentials) => {
  return await axios({
    method: "post",
    url: "/api/get_real_email_change_password",
    timeout: 1000 * 3, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: credentials,
  })
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

const emailRegexp =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const ChangePassword = ({
  password,
  setPassword,
  Loading,
  email,
  setEmail,
  setToken,
}) => {
  let queries = queryString.parseUrl(useLocation().search).query;
  const [secretKey, setSecretKey] = useState("");
  const inputSecretKeyRef = useRef();
  const inputEmailRef = useRef();
  const secretKeyWarningRef = useRef();
  const emailWarningRef = useRef();
  const submitButtonRef = useRef();
  const inputPasswordRef = useRef();
  const passwordWarningRef = useRef();
  const [typeOfInfo, setTypeOfInfo] = useState(null);
  const [currentPasswordStrength, setCurrentPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (email === "" && secretKey === "") {
      setFormIsChecking(false);
    }
  }, [email, secretKey]);

  const [linkHolder, setLinkHolder] = useState("");
  const history = useHistory();

  const didPasswordChanged = async () => {
    await timeout(300);
    if (password === inputPasswordRef.current.value) {
      return false;
    } else {
      return true;
    }
  };

  const didEmailChanged = async () => {
    await timeout(1000);
    if (email === inputEmailRef.current.value) {
      return false;
    } else {
      return true;
    }
  };

  const didSecretKeyChanged = async (ms) => {
    await timeout(ms);
    if (secretKey === inputSecretKeyRef.current.value) {
      return false;
    } else {
      return true;
    }
  };

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  let lastEmailCheckedSuccessfully = null;
  let lastEmailCheckedSuccessfullyResponse = {};
  let emailResponse = {};
  const [wasAtCharacterSeen, setWasAtCharacterSeen] = useState(false);
  const [formIsChecking, setFormIsChecking] = useState(false);

  const checkForm = async () => {
    submitButtonRef.current.disabled = true;
    emailWarningRef.current.innerHTML = "&nbsp;";
    secretKeyWarningRef.current.innerHTML = "&nbsp;";
    passwordWarningRef.current.innerHTML = "&nbsp;";
    setLinkHolder("");
    setFormIsChecking(true);
    if (
      wasAtCharacterSeen ||
      secretKey.length > 0 ||
      email.indexOf("@") !== -1
    ) {
      setWasAtCharacterSeen(true);
      if (emailRegexp.test(email)) {
        emailWarningRef.current.innerHTML = "&nbsp;";
        if (!(await didEmailChanged())) {
          secretKeyWarningRef.current.innerHTML = "&nbsp;";
          if (email !== lastEmailCheckedSuccessfully) {
            emailResponse = await CheckEmailInDatabase(
              inputEmailRef.current.value
            );
            if (emailResponse === 500) {
              setTypeOfInfo("connection problem");
            }
          } else {
            emailResponse = lastEmailCheckedSuccessfullyResponse;
          }
          try {
            if (emailResponse.email === inputEmailRef.current.value) {
              if (emailResponse.available === false) {
                lastEmailCheckedSuccessfully = email;
                lastEmailCheckedSuccessfullyResponse = emailResponse;
                emailWarningRef.current.innerHTML = "&nbsp;";
                secretKeyWarningRef.current.innerHTML = "&nbsp;";
                if (!(await didSecretKeyChanged(500))) {
                  setFormIsChecking(false);
                  if (inputSecretKeyRef.current.value.length > 24) {
                    secretKeyWarningRef.current.innerHTML = "&nbsp;";
                    if (currentPasswordStrength !== "Too weak") {
                      submitButtonRef.current.disabled = false;
                      passwordWarningRef.current.innerHTML = "&nbsp;";
                    } else {
                      if (!(await didPasswordChanged())) {
                        passwordWarningRef.current.innerHTML =
                          "This password is too weak, please add some symbols or numbers if there is none yet.";
                      } else {
                        setFormIsChecking(false);
                      }
                    }
                  } else {
                    secretKeyWarningRef.current.innerHTML =
                      "This secret key doesn't match our record";
                  }
                }
              } else if (emailResponse.available === true) {
                setFormIsChecking(false);
                emailWarningRef.current.innerHTML =
                  "This email is not assigned to any account";
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
  }, [secretKey, email, password]);

  useEffect(async () => {
    setEmail("");
    try {
      if (queries.secretkey) {
        inputSecretKeyRef.current.value = queries.secretkey;
        setSecretKey(inputSecretKeyRef.current.value);
      }
      if (queries.hidden_email && queries.secretkey) {
        const respond = await GetRealEmail({
          hidden_email: queries.hidden_email,
        });
        if (typeof respond.email === "string") {
          inputEmailRef.current.value = respond.email;
          setEmail(respond.email);
          setFormIsChecking(false);
          lastEmailCheckedSuccessfullyResponse = respond.email;
        }
      } else {
        inputEmailRef.current.value = "";
        email = "";
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const tryToChangePassword = async () => {
    const credentials = {
      email: inputEmailRef.current.value,
      secret_key: inputSecretKeyRef.current.value,
      password: inputPasswordRef.current.value,
    };
    const response = await ChangePasswordFinalReq(credentials);
    if (response.success === true) {
      if (response.token) {
        history.push("/");
        setToken(response.token);
      } else {
        history.push("/");
      }
    } else {
      submitButtonRef.current.disabled = true;
      if (response.email) {
        emailWarningRef.current.innerHTML =
          "This account has not asked for a password change in the last 24 hours";
        secretKeyWarningRef.current.innerHTML = "&nbsp;";
      } else if (response.secret_key) {
        secretKeyWarningRef.current.innerHTML =
          "This secret key doesn't match our record";
        emailWarningRef.current.innerHTML = "&nbsp;";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitButtonRef.current.disabled) {
      tryToChangePassword();
    }
  };

  return (
    <div className="public-wrapper-tall">
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
        <h1 className={"title"}>Change your password</h1>
        <Link to={"/"}>
          <i className="fas fa-times"></i>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="floating" style={{ marginBottom: 0 }}>
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
            maxLength={120}
            id="input__secretKey"
            type="secretKey"
            className="floating__input"
            name="secretKey"
            placeholder="SecretKey"
            onChange={(e) => setSecretKey(e.target.value)}
            ref={inputSecretKeyRef}
          />
          <label
            htmlFor="input__secretKey"
            className="floating__label"
            data-content="Secret Key"
          >
            <span className="hidden--visually">Secret key</span>
          </label>
          <p className={"warning-holder"} ref={secretKeyWarningRef}>
            &nbsp;
          </p>
        </div>
        <div className={"flex-wrapper"}>
          <div className="floating" style={{ width: "100%" }}>
            <input
              id="input__password"
              type={!showPassword ? "password" : "text"}
              className="floating__input"
              name="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
                setCurrentPasswordStrength(
                  passwordStrength(e.target.value).value
                );
              }}
              ref={inputPasswordRef}
            />
            <label
              htmlFor="input__password"
              className="floating__label"
              data-content="Password"
            >
              <span className="hidden--visually">Password</span>
            </label>
          </div>
          <div
            className={"show-hide-button"}
            onClick={() => setShowPassword(!showPassword)}
          >
            <div className={"vertical-center"} style={{ whiteSpace: "nowrap" }}>
              {!showPassword ? "Show" : "Hide"} password
            </div>
          </div>
        </div>
        <p className={"warning-holder"} ref={passwordWarningRef}>
          &nbsp;
        </p>
        <div className={"flex-wrapper"} style={{ height: 25 }}>
          <div hidden={password.length > 0 ? false : true}>
            <p className={"vertical-center"}>
              <u>Password strength:</u>
            </p>
          </div>
          <p
            hidden={password.length > 0 ? false : true}
            style={{
              color:
                currentPasswordStrength === "Too weak"
                  ? "black"
                  : currentPasswordStrength === "Weak"
                  ? "black"
                  : currentPasswordStrength === "Medium"
                  ? "white"
                  : "white",
              background:
                currentPasswordStrength === "Too weak"
                  ? "rgb(249,235,215)"
                  : currentPasswordStrength === "Weak"
                  ? "rgb(255,221,87)"
                  : currentPasswordStrength === "Medium"
                  ? "rgb(50,152,220)"
                  : "rgb(73,199,118)",
              padding: "5px 12px 5px 12px",
              marginLeft: 10,
              borderRadius: 10,
            }}
          >
            {currentPasswordStrength}
          </p>
        </div>
        <div className={"holder"} style={{ marginTop: 10 }}>
          <Link to="/login">
            <p className={"form-link"}>Sign in instead</p>
          </Link>
          <Link to="/register">
            <p className={"form-link"}>Signup instead</p>
          </Link>
          <p className={"form-link"}>Send activation key again</p>//dorobic
          fukcje
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
                    margin={"10px"}
                    height={"-1.5rem"}
                    background={"rgba(0,1,255,0.62)"}
                  />
                ) : (
                  "confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
