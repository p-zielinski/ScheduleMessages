import { Checkbox, Input, Space, Radio } from "antd";
import { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
const { SegmentedMessage } = require("sms-segments-calculator");

const ChangeUsername = () => {
  const [username, setUsername] = useState(undefined);

  const [isUsernameTooLong, setIsUsernameTooLong] = useState(false);
  const [inputName, setInputName] = useState("");
  const [UCS2encoded, setUCS2encoded] = useState(false);
  const [warningText, setWarningText] = useState("&nbsp;");
  const nameInputRef = useRef();
  const [whileNextTimeUpdateResetWarning, setWhileNextTimeUpdateResetWarning] =
    useState(false);
  const [foundWarningLetters, setFoundWarningLetters] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  ////
  const [typeDelete, setTypeDelete] = useState("");
  const [deleteOrChangeNameFormType, setDeleteOrChangeNameFormType] =
    useState();

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const didInputNameChanged = async (name) => {
    await timeout(4000);

    try {
      if (name === nameInputRef.current.state.value) {
        setWhileNextTimeUpdateResetWarning(true);
      }
    } catch (e) {}
  };

  useEffect(() => {
    setWarningText("&nbsp;");
    setFoundWarningLetters([]);
    updateName(inputName);
  }, [UCS2encoded]);

  const updateName = (name) => {
    if (name.length > 16) {
      setIsUsernameTooLong(true);
    } else {
      setIsUsernameTooLong(false);
    }
    let tempWarningLetters = foundWarningLetters;
    if (whileNextTimeUpdateResetWarning === true) {
      setWhileNextTimeUpdateResetWarning(false);
      setFoundWarningLetters([]);
      tempWarningLetters = [];
      setWarningText("&nbsp;");
    }
    let nonGSM7Characters;
    if (UCS2encoded === false) {
      nonGSM7Characters = [
        ...new Set([
          ...new SegmentedMessage(name)
            .getNonGsmCharacters()
            .map((e) => e.toLowerCase()),
          ...tempWarningLetters,
        ]),
      ];
      setFoundWarningLetters(nonGSM7Characters);
      if (nonGSM7Characters.length > 0) {
        setWarningText(
          `Letter${nonGSM7Characters.length > 1 ? "s" : ""} ${nonGSM7Characters
            .map((e) => `<b>${e}</b>`)
            .join(", ")} ${
            nonGSM7Characters.length > 1 ? "are" : "is"
          } available only if you allow much more expensive letters.`
        );
      }
    } else {
      nonGSM7Characters = [];
    }

    while (name.includes("  ")) {
      name = name.replace(/\ \ /g, " ");
    }

    name = name
      .split(" ")
      .map((word) => {
        if (word.length > 1) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
          return word.toUpperCase();
        }
      })
      .join(" ")
      .split("")
      .map((e) => (nonGSM7Characters.includes(e.toLowerCase()) ? null : e))
      .join("");
    if (name.length <= 16) {
      setInputName(name);
    }

    if (name.length > 1 && name.length <= 16) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
    didInputNameChanged(name);
  };

  const typeDeleteHandler = (text) => {
    const final = [];
    let checkXLetters = 6;
    if (text.length < 6) {
      checkXLetters = text.length;
    }
    for (let i = 0; i < checkXLetters; i++) {
      if (text[i] === "delete"[i]) {
        final.push(text[i]);
      } else {
        break;
      }
    }
    setTypeDelete(final.join(""));
  };

  return (
    <div className={"center"} style={{ width: 800 }}>
      <h2 className={"center mb"}>Change your name:</h2>

      <p className={"center mb"}>
        {username === undefined
          ? parse("Your name is <b>not defined</b>")
          : parse(`Your defined name is: <b>${username}</b>`)}
      </p>
      {username !== undefined && (
        <>
          <Radio.Group
            size={"large"}
            style={{ width: 800 }}
            className={"mb"}
            onChange={(e) => setDeleteOrChangeNameFormType(e.target.value)}
          >
            <Radio.Button style={{ width: 400 }} value="delete">
              Delete your name
            </Radio.Button>
            <Radio.Button style={{ width: 400 }} value="update">
              Change your name
            </Radio.Button>
          </Radio.Group>
          {deleteOrChangeNameFormType !== undefined && (
            <>
              <b>
                <p className={"center"} style={{ marginBottom: 10 }}>
                  This change will only apply to messages scheduled from the
                  moment of change
                </p>
              </b>
            </>
          )}
          {deleteOrChangeNameFormType === "delete" && (
            <>
              <p className={"center"} style={{ marginBottom: 5 }}>
                Type "delete" down below to unlock the delete button.
              </p>
              <Input
                maxLength={16}
                value={typeDelete}
                onChange={(e) =>
                  typeDeleteHandler(e.target.value.toLowerCase())
                }
                className={"mb"}
                size={"large"}
                placeholder='Type "delete"'
              />
              <button
                disabled
                className={"button"}
                type={"submit"}
                style={{ fontSize: "2rem" }}
              >
                Delete your name
              </button>
            </>
          )}
        </>
      )}
      {(username === undefined || deleteOrChangeNameFormType === "update") && (
        <>
          <>
            <p className={"center"} style={{ marginBottom: 5 }}>
              Please enter your name:
            </p>
            <div className={"fullW flex-wrapper"} style={{ marginBottom: 5 }}>
              <Input
                ref={nameInputRef}
                size={"large"}
                placeholder="Your name (minimum 2 characters, maximum 16 characters)"
                value={inputName}
                onChange={(input) => updateName(input.target.value)}
              />
              <Space direction={"horizontal"}>
                <div
                  className={"add_delete_icon"}
                  style={{
                    height: "40px",
                    width: "300px",
                    paddingLeft: "7px",
                    cursor: "pointer",
                    marginLeft: 7,
                  }}
                  onClick={() => setUCS2encoded(!UCS2encoded)}
                >
                  <p
                    className={"vertical-center test"}
                    style={{ fontSize: ".99rem" }}
                  >
                    <Checkbox
                      checked={UCS2encoded}
                      style={{ marginRight: "5px" }}
                    />
                    Allow much more expensive letters
                  </p>
                </div>
              </Space>
            </div>
            <p className={"warning-holder"} style={{ marginBottom: 10 }}>
              {isUsernameTooLong
                ? "Name cannot be longer than 16 characters. "
                : ""}
              {parse(warningText)}
            </p>

            <b>
              <p className={"center"}>
                Allowing much more expensive letters may significantly increase
                the
              </p>
              <p className={"center"}>
                cost of sending messages in the future.
              </p>
              <p className={"center"}>
                If You will use those names inside the messages.
              </p>
            </b>
            <p className={"center mb"} style={{ marginTop: 10 }}>
              Please double-check your name and click the button below
            </p>
            <button
              disabled={isButtonDisabled}
              className={"button"}
              type={"submit"}
              style={{ fontSize: "2rem" }}
            >
              {username === undefined && "Define"}
              {deleteOrChangeNameFormType === "update" && "Update"} your name
            </button>
          </>
        </>
      )}
    </div>
  );
};

export default ChangeUsername;