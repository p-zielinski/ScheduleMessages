import { Input } from "antd";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../../utils/Loading";

const RequestEmailChange = async (token) => {
  return await axios({
    method: "post",
    url: "/api/change_email_req",
    timeout: 1000 * 5, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: { token: token },
  })
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

const ChangeEmail = () => {
  const { token, email } = useSelector((state) => state.userData);
  const [typeChangeEmail, setTypeChangeEmail] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailWasSent, setEmailWasSent] = useState(false);

  const typeChangeEmailHandler = (text) => {
    text = text.toLowerCase();
    const final = [];
    let checkXLetters =
      "change email".length > text.length ? text.length : "change email".length;

    for (let i = 0; i < checkXLetters; i++) {
      if (text[i] === "change email"[i]) {
        final.push(text[i]);
      } else {
        break;
      }
    }
    const finalString = final.join("");
    setTypeChangeEmail(finalString);
    if (finalString === "change email") {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const changeEmailInDBReq = async () => {
    setIsLoading(true);
    const respond = await RequestEmailChange(token);
    console.log(respond);
    if (typeof respond === "object") {
      if (respond.success === true) {
        setEmailWasSent(true);
      } else if (respond.error === "sent within last 15 minutes") {
        setEmailWasSent(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className={"center fullW"}>
      <div hidden={!emailWasSent}>
        <h2 style={{ textAlign: "center" }}>Email was sent!</h2>
        <p style={{ textAlign: "center", marginBottom: 10 }}>
          Please check you email: <b>{email}</b>
        </p>
      </div>
      <div hidden={emailWasSent}>
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
                key={"changeEmailLoading"}
              />
            </div>
          </div>
        </div>
        <h2 className={"center mb"}>Change your email:</h2>
        <p className={"center"} style={{ marginBottom: 5 }}>
          Type "change email" down below to unlock the continue button.
        </p>
        <Input
          maxLength={16}
          value={typeChangeEmail}
          onChange={(e) => typeChangeEmailHandler(e.target.value.toLowerCase())}
          size={"large"}
          placeholder='Type "change email"'
        />
        <p className={"center"} style={{ marginTop: 10 }}>
          Afterwords we will send you an email with an link to change your email
          adress.
        </p>
        <p className={"center mb"}>The link will be valid only 24 hours.</p>
        <button
          disabled={isButtonDisabled}
          onClick={() => changeEmailInDBReq()}
          className={"button"}
          type={"button"}
          style={{ fontSize: "2rem" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ChangeEmail;
