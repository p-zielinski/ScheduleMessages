import { Link, useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Info from "../Shared/Info";

const RegisterUser = async (credentials) => {
  return await axios({
    method: "post",
    url: "/api/signup",
    timeout: 1000 * 3, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: credentials,
  })
    .then((response) => response.data)
    .catch((error) => error.response.status);
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

const emailRegexp =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const Register = ({
  Loading,
  email,
  setEmail,
  password,
  setPassword,
  setJustRegister,
}) => {
  const inputPasswordRef = useRef();
  const inputEmailRef = useRef();
  const passwordWarningRef = useRef();
  const emailWarningRef = useRef();
  const submitButtonRef = useRef();
  const [checkEmail, setCheckEmail] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [canCheckEmail, setCanCheckEmail] = useState(false);
  const redirectToLogin = (
    <Link to="/login" id={"form-link"}>
      <b>here</b>
    </Link>
  );
  const [linkHolder, setLinkHolder] = useState("");
  const [typeOfInfo, setTypeOfInfo] = useState(null);
  const history = useHistory();

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

  const redirectToConfirm = () => {
    history.push("/confirm_email");
  };

  const didEmailChanged = async () => {
    await timeout(1000);
    if (email === inputEmailRef.current.value) {
      return false;
    } else {
      return true;
    }
  };

  const didPasswordChanged = async (ms) => {
    await timeout(ms);
    if (password === inputPasswordRef.current.value) {
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

            if (emailResponse === 500) {
              setTypeOfInfo("connection problem");
            }
          } else {
            emailResponse = lastEmailCheckedSuccessfullyResponse;
          }
          try {
            if (emailResponse.email === inputEmailRef.current.value) {
              if (emailResponse.available === false) {
                emailWarningRef.current.innerHTML =
                  "This email was already confirmed, please log in";
                setLinkHolder(redirectToLogin);
                setFormIsChecking(false);
              } else if (emailResponse.available === true) {
                lastEmailCheckedSuccessfully = email;
                lastEmailCheckedSuccessfullyResponse = emailResponse;
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
              }
            }
          } catch (e) {
            //do nothing
          }
        }
      } else {
        if (!(await didEmailChanged())) {
          emailWarningRef.current.innerHTML = "Invalid email";
          setFormIsChecking(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitButtonRef.current.disabled) {
      const response = await RegisterUser({
        email,
        password,
      });
      if (response.success === true) {
        setJustRegister(true);
        redirectToConfirm();
      } else {
        setLinkHolder("");
        if (response.email === "already used") {
          emailWarningRef.current.innerHTML =
            "This email is already taken. If it's yours, please login"; //popraw
          setLinkHolder(redirectToLogin);
          submitButtonRef.current.disabled = true;
          setIsEmailValid(false);
        } else if (response.email) {
          emailWarningRef.current.innerHTML = "Invalid email address";
          submitButtonRef.current.disabled = true;
          setIsEmailValid(false);
        }
        if (response.password) {
          if (password.length < 6) {
            passwordWarningRef.current.innerHTML =
              "Password has to be at least 6 characters long";
          } else if (password.length > 60) {
            passwordWarningRef.current.innerHTML =
              "Password can not be longer than 60 characters";
          } else {
            passwordWarningRef.current.innerHTML =
              "Password has to be at least 6 characters long and max 60 characters long";
          }
          submitButtonRef.current.disabled = true;
        }
      }
    }
  };

  return (
    <div className="public-wrapper">
      {typeOfInfo === "connection problem" && (
        <Info
          setTypeOfInfo={setTypeOfInfo}
          text={
            "We have noticed that the connection between you and our server doesn't work properly. The website may not work."
          }
        />
      )}
      <div className={"uplift-public"}>
        <div className={"holder"}>
          <div className={"flex-wrapper"}>
            <h1 className={"website-name"}>SCHEDULE</h1>
            <h1 className={"website-name"}>MESSAGES</h1>
            <h1 className={"website-name"}>.COM</h1>
          </div>
          <h1 className={"title"}>Create your account here</h1>
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
            <Link to="/login">
              <p className={"form-link"}>Sign in instead</p>
            </Link>
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
                    "sign up"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
