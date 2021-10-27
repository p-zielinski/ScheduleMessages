import { Input } from "antd";
import { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";

const ChangePassword = () => {
  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [currentPassword, setCurrentPassword] = useState("");
  const currentPasswordRef = useRef();
  const [currentPasswordWarning, setCurrentPasswordWarning] =
    useState("&nbsp;");

  const [newPasswordType, setNewPasswordType] = useState("password");
  const [newPassword1, setNewPassword1] = useState("");
  const newPassword1Ref = useRef();
  const [newPassword1Warning, setNewPassword1Warning] = useState("&nbsp;");
  const [newPassword2, setNewPassword2] = useState("");
  const newPassword2Ref = useRef();
  const [newPassword2Warning, setNewPassword2Warning] = useState("&nbsp;");

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    setIsButtonDisabled(true);
    if (
      currentPassword.length >= 6 &&
      currentPassword.length <= 60 &&
      newPassword1 === newPassword2 &&
      newPassword1.length >= 6 &&
      newPassword1.length <= 60
    ) {
      setIsButtonDisabled(false);
    }
  }, [newPassword1, newPassword2, currentPassword]);

  const updateCurrentPassword = (password) => {
    setCurrentPassword(password);
    didCurrentPasswordChanged(password);
  };

  const didCurrentPasswordChanged = async (password) => {
    setCurrentPasswordWarning("&nbsp;");
    await timeout(1000);
    try {
      if (password === currentPasswordRef.current.state.value) {
        if (currentPasswordRef.current.state.value.length > 0) {
          if (
            currentPasswordRef.current.state.value.length < 6 ||
            currentPasswordRef.current.state.value.length > 60
          ) {
            setCurrentPasswordWarning("Invalid password");
          }
        }
      }
    } catch (e) {}
  };

  const ShowHideCurrentPassword = () => {
    if (currentPasswordType === "password") {
      setCurrentPasswordType("text");
    } else {
      setCurrentPasswordType("password");
    }
  };

  const updateNewPassword1 = (password) => {
    setNewPassword1(password);
    didNewPassword1Changed(password);
  };

  const didNewPassword1Changed = async (password) => {
    setNewPassword1Warning("&nbsp;");
    setNewPassword2Warning("&nbsp;");
    await timeout(1000);
    try {
      if (password === newPassword1Ref.current.state.value) {
        updatePasswordWarningTexts();
      }
    } catch (e) {}
  };

  const updateNewPassword2 = (password) => {
    setNewPassword2(password);
    didNewPassword2Changed(password);
  };

  const didNewPassword2Changed = async (password) => {
    setNewPassword1Warning("&nbsp;");
    setNewPassword2Warning("&nbsp;");
    await timeout(1000);
    try {
      if (password === newPassword2Ref.current.state.value) {
        updatePasswordWarningTexts();
      }
    } catch (e) {}
  };

  const updatePasswordWarningTexts = () => {
    if (newPassword1Ref.current.state.value.length > 0) {
      if (newPassword1Ref.current.state.value.length > 60) {
        setNewPassword1Warning("Password cannot be longer than 60 characters");
      } else if (newPassword1Ref.current.state.value.length < 6) {
        setNewPassword1Warning("Password cannot be shorter than 6 characters");
      } else {
        if (newPassword2Ref.current.state.value.length > 0) {
          if (newPassword2Ref.current.state.value.length > 60) {
            setNewPassword2Warning(
              "Password cannot be longer than 60 characters"
            );
          } else if (newPassword2Ref.current.state.value.length < 6) {
            setNewPassword2Warning(
              "Password cannot be shorter than 6 characters"
            );
          } else if (
            newPassword1Ref.current.state.value !==
            newPassword2Ref.current.state.value
          ) {
            setNewPassword2Warning(
              "This password does not match the password above."
            );
          }
        }
      }
    }
  };

  const ShowHideNewPassword = () => {
    if (newPasswordType === "password") {
      setNewPasswordType("text");
    } else {
      setNewPasswordType("password");
    }
  };

  const changePasswordInDB = () => {};

  return (
    <div className={"center fullW"}>
      <h2 className={"center mb"}>Change your password:</h2>
      <p className={"center"} style={{ marginBottom: 5 }}>
        Please enter your <b>current</b> password down below:
      </p>
      <div className={"fullW flex-wrapper"}>
        <div
          className={"add_delete_icon"}
          style={{
            minWidth: 130,
            width: 130,
            fontSize: ".87rem",
            cursor: "pointer",
            marginRight: 9,
          }}
          onClick={() => ShowHideCurrentPassword()}
        >
          <p className={"vertical-center center"}>
            {currentPasswordType === "password" ? "Show" : "Hide"} password
          </p>
        </div>
        <Input
          value={currentPassword}
          onChange={(e) => updateCurrentPassword(e.target.value)}
          ref={currentPasswordRef}
          placeholder="confirm your current password"
          type={currentPasswordType}
          size={"large"}
        />
      </div>
      <p
        className={"warning-holder"}
        style={{
          paddingLeft: 140,
          fontSize: 13,
          marginTop: -3,
        }}
      >
        {parse(currentPasswordWarning)}
      </p>
      <p className={"center"} style={{ marginTop: 10 }}>
        Afterwords we will send you an email with an link to change your
        password.
      </p>
      <p className={"center mb"}>The link will be valid only 24 hours.</p>
      {/*<div className={"fullW flex-wrapper"}>*/}
      {/*  <Input*/}
      {/*    value={newPassword1}*/}
      {/*    onChange={(e) => updateNewPassword1(e.target.value)}*/}
      {/*    ref={newPassword1Ref}*/}
      {/*    placeholder="enter Your new password"*/}
      {/*    type={"password"}*/}
      {/*    style={{ marginLeft: 139 }}*/}
      {/*    size={"large"}*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<p*/}
      {/*  className={"warning-holder"}*/}
      {/*  style={{*/}
      {/*    paddingLeft: 140,*/}
      {/*    fontSize: 13,*/}
      {/*    marginTop: -3,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {parse(newPassword1Warning)}*/}
      {/*</p>*/}
      {/*<div className={"fullW flex-wrapper"}>*/}
      {/*  <div*/}
      {/*    className={"add_delete_icon"}*/}
      {/*    style={{*/}
      {/*      width: 130,*/}
      {/*      minWidth: 130,*/}
      {/*      fontSize: ".87rem",*/}
      {/*      cursor: "pointer",*/}
      {/*      marginRight: 9,*/}
      {/*    }}*/}
      {/*    onClick={() => ShowHideNewPassword()}*/}
      {/*  >*/}
      {/*    <p className={"vertical-center center"}>*/}
      {/*      {newPasswordType === "password" ? "Show" : "Hide"} password*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*  <Input*/}
      {/*    value={newPassword2}*/}
      {/*    onChange={(e) => updateNewPassword2(e.target.value)}*/}
      {/*    ref={newPassword2Ref}*/}
      {/*    placeholder="confirm Your new password"*/}
      {/*    type={newPasswordType}*/}
      {/*    size={"large"}*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<p*/}
      {/*  className={"warning-holder mb"}*/}
      {/*  style={{*/}
      {/*    paddingLeft: 140,*/}
      {/*    fontSize: 13,*/}
      {/*    marginTop: -3,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {parse(newPassword2Warning)}*/}
      {/*</p>*/}
      <button
        disabled={isButtonDisabled}
        onClick={() => changePasswordInDB()}
        className={"button"}
        type={"button"}
        style={{ fontSize: "2rem" }}
      >
        Continue
      </button>
    </div>
  );
};

export default ChangePassword;
