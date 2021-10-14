import { Input } from "antd";
import { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";

const emailRegexp =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
// if(emailRegexp.test(e)){

const ChangeEmail = () => {
  const email1Ref = useRef();
  const [email1, setEmail1] = useState("");
  const [email1Warning, setEmail1Warning] = useState("&nbsp;");
  const email2Ref = useRef();
  const [email2, setEmail2] = useState("");
  const [email2Warning, setEmail2Warning] = useState("&nbsp;");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [password, setPassword] = useState("");
  const passwordRef = useRef();
  const [passwordType, setPasswordType] = useState("password");
  const [passwordWarning, setPasswordWarning] = useState("&nbsp;");

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    setIsButtonDisabled(true);
    if (
      email1 === email2 &&
      emailRegexp.test(email1) &&
      password.length >= 6 &&
      password.length <= 60
    ) {
      setIsButtonDisabled(false);
    }
  }, [email1, email2, password]);

  const updateEmailWarningText = () => {
    try {
      if (email1Ref.current.state.value.length > 0) {
        if (email1Ref.current.state.value.length > 200) {
          setEmail1Warning("This email cannot be longer than 200 characters");
        } else if (!emailRegexp.test(email1Ref.current.state.value)) {
          setEmail1Warning("This email is not valid");
        } else {
          if (email2Ref.current.state.value.length > 0) {
            if (email2Ref.current.state.value.length > 200) {
              setEmail2Warning(
                "This email cannot be longer than 200 characters"
              );
            } else if (!emailRegexp.test(email2Ref.current.state.value)) {
              setEmail2Warning("This email is not valid");
            } else if (
              email1Ref.current.state.value !== email2Ref.current.state.value
            ) {
              setEmail2Warning("This email does not match the email above.");
            }
          }
        }
      }
    } catch (e) {}
  };

  const didEmail1Changed = async (email) => {
    setEmail1Warning("&nbsp;");
    setEmail2Warning("&nbsp;");
    await timeout(1000);
    if (email === email1Ref.current.state.value) {
      updateEmailWarningText();
    }
  };

  const didEmail2Changed = async (email) => {
    setEmail1Warning("&nbsp;");
    setEmail2Warning("&nbsp;");
    await timeout(1000);
    if (email === email2Ref.current.state.value) {
      updateEmailWarningText();
    }
  };

  const ShowHidePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  const updatePassword = (e) => {
    setPassword(e);
    didPasswordChanged(e);
  };

  const didPasswordChanged = async (password) => {
    setPasswordWarning("&nbsp;");
    await timeout(1000);

    if (password === passwordRef.current.state.value) {
      updatePasswordWarningText();
    }
  };

  const updatePasswordWarningText = () => {
    try {
      if (passwordRef.current.state.value.length > 0) {
        if (
          passwordRef.current.state.value.length < 6 ||
          passwordRef.current.state.value.length > 60
        ) {
          setPasswordWarning("Invalid password");
        }
      }
    } catch (e) {}
  };

  return (
    <div className={"center"} style={{ width: 800 }}>
      <h2 className={"center mb"}>Change your email address:</h2>
      <p className={"center"} style={{ marginBottom: 5 }}>
        Please enter twice Your new email address down below:
      </p>
      <Input
        size={"large"}
        placeholder="Your new email address"
        value={email1}
        ref={email1Ref}
        onChange={(e) => {
          setEmail1(e.target.value.replace(/\ /g, ""));
          didEmail1Changed(e.target.value.replace(/\ /g, ""));
        }}
      />
      <p
        className={"warning-holder"}
        style={{
          fontSize: 13,
          marginTop: -3,
        }}
      >
        {parse(email1Warning)}
      </p>
      <Input
        size={"large"}
        placeholder="Reenter Your new email address"
        ref={email2Ref}
        value={email2}
        onChange={(e) => {
          setEmail2(e.target.value.replace(/\ /g, ""));
          didEmail2Changed(e.target.value.replace(/\ /g, ""));
        }}
      />
      <p
        className={"warning-holder"}
        style={{
          fontSize: 13,
          marginTop: -3,
          marginBottom: 15,
        }}
      >
        {parse(email2Warning)}
      </p>
      <p className={"center"} style={{ marginBottom: 5 }}>
        Please enter your password down below:
      </p>
      <div className={"fullW flex-wrapper"}>
        <div
          className={"add_delete_icon"}
          style={{
            width: 130,
            minWidth: 130,
            fontSize: ".87rem",
            cursor: "pointer",
            marginRight: 9,
          }}
          onClick={() => ShowHidePassword()}
        >
          <p
            className={"vertical-center center"}
            style={{ whiteSpace: "nowrap" }}
          >
            {passwordType === "password" ? "Show" : "Hide"} password
          </p>
        </div>
        <Input
          placeholder="Your password"
          type={passwordType}
          size={"large"}
          value={password}
          onChange={(e) => updatePassword(e.target.value)}
          ref={passwordRef}
        />
      </div>
      <p
        className={"warning-holder mb"}
        style={{
          paddingLeft: 140,
          fontSize: 13,
          marginTop: -3,
        }}
      >
        {parse(passwordWarning)}
      </p>
      <button
        disabled={isButtonDisabled}
        className={"button"}
        type={"submit"}
        style={{ fontSize: "2rem" }}
      >
        Continue
      </button>
    </div>
  );
};

export default ChangeEmail;
