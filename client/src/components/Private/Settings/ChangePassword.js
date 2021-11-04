import { Input } from "antd";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../../utils/Loading";

const RequestPasswordChange = async (token) => {
  return await axios({
    method: "post",
    url: "/api/change_password_req",
    timeout: 1000 * 5, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: { token: token },
  })
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

const ChangePassword = () => {
  const { token } = useSelector((state) => state.userData);
  const [typeChangePassword, setTypeChangePassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const typeChangePasswordHandler = (text) => {
    text = text.toLowerCase();
    const final = [];
    let checkXLetters =
      "change password".length > text.length
        ? text.length
        : "change password".length;

    for (let i = 0; i < checkXLetters; i++) {
      if (text[i] === "change password"[i]) {
        final.push(text[i]);
      } else {
        break;
      }
    }
    const finalString = final.join("");
    setTypeChangePassword(finalString);
    if (finalString === "change password") {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const changePasswordInDBReq = async () => {
    setIsLoading(true);
    const respond = await RequestPasswordChange(token);
    console.log(respond);
    // setTypeChangePassword("");
    setIsLoading(false);
    // setIsButtonDisabled(true);
  };

  return (
    <div className={"center fullW"}>
      <div
        style={{
          zIndex: 2,
          left: 0,
          top: 0,
          position: "absolute",
          background: "rgba(255,255,255,0.8)",
          width: "100%",
          height: "100%",
        }}
        hidden={!isLoading}
      >
        <div className={"vertical-center center"}>
          <div style={{ paddingTop: 199 }}>
            <Loading
              size={"1.5rem"}
              margin={"1rem"}
              background={"rgba(0,1,255,0.62)"}
              height={"-3rem"}
            />
          </div>
        </div>
      </div>
      <h2 className={"center mb"}>Change your password:</h2>
      <p className={"center"} style={{ marginBottom: 5 }}>
        Type "change password" down below to unlock the continue button.
      </p>
      <Input
        maxLength={16}
        value={typeChangePassword}
        onChange={(e) =>
          typeChangePasswordHandler(e.target.value.toLowerCase())
        }
        size={"large"}
        placeholder='Type "change password"'
      />
      <p className={"center"} style={{ marginTop: 10 }}>
        Afterwords we will send you an email with an link to change your
        password.
      </p>
      <p className={"center mb"}>The link will be valid only 24 hours.</p>
      <button
        disabled={isButtonDisabled}
        onClick={() => changePasswordInDBReq()}
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
