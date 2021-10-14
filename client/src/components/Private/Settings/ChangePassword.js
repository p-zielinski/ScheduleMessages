import { Input } from "antd";
import { useState } from "react";

const ChangePassword = () => {
  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const ShowHideCurrentPassword = () => {
    if (currentPasswordType === "password") {
      setCurrentPasswordType("text");
    } else {
      setCurrentPasswordType("password");
    }
  };
  const ShowHideNewPassword = () => {
    if (newPasswordType === "password") {
      setNewPasswordType("text");
    } else {
      setNewPasswordType("password");
    }
  };
  return (
    <div className={"center"} style={{ width: 800 }}>
      <h2 className={"center mb"}>Change your email password:</h2>
      <p className={"center"} style={{ marginBottom: 5 }}>
        Please enter your <b>current</b> password down below:
      </p>
      <div className={"fullW flex-wrapper"}>
        <div
          className={"add_delete_icon"}
          style={{
            width: 150,
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
          placeholder="confirm your current password"
          type={currentPasswordType}
          style={{ marginBottom: 5 }}
          size={"large"}
        />
      </div>
      <p className={"center"} style={{ marginBottom: 5 }}>
        Please enter your <b>new</b> password down below:
      </p>
      <div className={"fullW flex-wrapper"}>
        <div style={{ width: 150, marginRight: 9 }}></div>
        <Input
          placeholder="confirm your new password"
          type={"password"}
          style={{ marginBottom: 5 }}
          size={"large"}
        />
      </div>
      <div className={"fullW flex-wrapper mb"}>
        <div
          className={"add_delete_icon"}
          style={{
            width: 150,
            fontSize: ".87rem",
            cursor: "pointer",
            marginRight: 9,
          }}
          onClick={() => ShowHideNewPassword()}
        >
          <p className={"vertical-center center"}>
            {newPasswordType === "password" ? "Show" : "Hide"} password
          </p>
        </div>
        <Input
          placeholder="confirm your new password"
          type={newPasswordType}
          style={{ marginBottom: 5 }}
          size={"large"}
        />
      </div>
      <button className={"button"} type={"submit"} style={{ fontSize: "2rem" }}>
        Continue
      </button>
    </div>
  );
};

export default ChangePassword;
