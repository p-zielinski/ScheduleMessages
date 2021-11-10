import { Checkbox, Input, Select, Radio } from "antd";
import { useEffect, useRef, useState } from "react";
import transliterate from "@sindresorhus/transliterate";
import { SegmentedMessage } from "sms-segments-calculator";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessageBody,
  setAllowExpensiveCharacters,
} from "../../../store/actions/scheduleDataActions";

const { Option } = Select;

const { TextArea } = Input;

const TextBody = ({ scheduleNow }) => {
  const { name, messageBody } = useSelector((state) => state.userData);

  const [textArea, setTextArea] = useState(messageBody);
  const [changeNonLatinToLatin, setChangeNonLatinToLatin] = useState(false);
  const [allowExpensiveLetters, setAllowExpensiveLetters] = useState(false);
  const [whileNextTimeUpdateResetWarning, setWhileNextTimeUpdateResetWarning] =
    useState(false);
  const [foundWarningLetters, setFoundWarningLetters] = useState([]);
  const [textAreaWarningText, setTextAreaWarningText] = useState("&nbsp;");
  const [wasEverTextLongerThan2Letters, setWasEverTextLongerThan2Letters] =
    useState(false);
  const textAreaRef = useRef();
  const dispatch = useDispatch();
  const EndOfViewRef = useRef(null);
  const [showDynamicFunctions, setShowDynamicFunctions] = useState(false);

  const scrollToBottom = () => {
    EndOfViewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    dispatch(setAllowExpensiveCharacters(allowExpensiveLetters));
  }, [allowExpensiveLetters]);

  useEffect(() => {
    dispatch(
      setMessageBody(
        typeof textArea === "string" ? textArea.replace(/\n/g, "<br />") : ""
      )
    );
  }, [textArea]);

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const didTextAreaChanged = async (text) => {
    await timeout(2000);
    try {
      if (text === textAreaRef.current.resizableTextArea.props.value) {
        if (text.length < 2 && wasEverTextLongerThan2Letters) {
          setWasEverTextLongerThan2Letters(true);
        }
        setWhileNextTimeUpdateResetWarning(true);
      }
    } catch (e) {}
  };

  const updateTextArea = async (text, options) => {
    if (text === undefined) {
      return 0;
    }
    const local_changeNonLation =
      typeof options === "object"
        ? options.latin !== undefined
          ? !!options.latin
          : changeNonLatinToLatin
        : changeNonLatinToLatin;

    if (local_changeNonLation) {
      text = transliterate(text);
    }

    const local_allowExpensiveLetters =
      typeof options === "object"
        ? options.expensiveLetters !== undefined
          ? !!options.expensiveLetters
          : allowExpensiveLetters
        : allowExpensiveLetters;

    let tempWarningLetters = foundWarningLetters;
    if (whileNextTimeUpdateResetWarning === true) {
      setWhileNextTimeUpdateResetWarning(false);
      setFoundWarningLetters([]);
      tempWarningLetters = [];
      setTextAreaWarningText("&nbsp;");
    }
    let nonGSM7Characters;
    if (local_allowExpensiveLetters === false) {
      nonGSM7Characters = [
        ...new Set([
          ...new SegmentedMessage(text)
            .getNonGsmCharacters()
            .map((e) => e.toLowerCase()),
          ...tempWarningLetters,
        ]),
      ];
      setFoundWarningLetters(nonGSM7Characters);
      if (nonGSM7Characters.length > 0) {
        setTextAreaWarningText(
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

    while (text.includes("  ")) {
      text = text.replace(/\ \ /g, " ");
    }

    while (text.includes("\n\n\n")) {
      text = text.replace(/\n\n\n/g, "\n\n");
    }

    text = text.split("");

    if (!local_allowExpensiveLetters) {
      text = text.map((e) =>
        nonGSM7Characters.includes(e.toLowerCase()) ? null : e
      );
    }

    text = text.join("");

    if (!wasEverTextLongerThan2Letters) {
      if (text.length > 0) {
        setWasEverTextLongerThan2Letters(true);
      }
    }

    didTextAreaChanged(text);

    setTextArea(text);
    if (text[text.length - 1] === "\n") {
      setTimeout(function () {
        scrollToBottom();
      }, 1000);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div className={"center"}>
        <h2>message body:</h2>
      </div>

      <div className={"fullW"} style={{ marginBottom: 9 }}>
        <div className={"input-contact-plus-save"} style={{ width: "100%" }}>
          <div className={"flex-wrapper input-contact-inner-plus-save"}>
            <div
              className={
                "add_icon left-cell-delete_contact-plus-save-with-border"
              }
              style={{
                background: "rgba(64, 169, 255, 0.15)",
                width: "100%",
                cursor: "pointer",
              }}
              onClick={() => {
                setChangeNonLatinToLatin(!changeNonLatinToLatin);
                setAllowExpensiveLetters(false);
                updateTextArea(textArea, {
                  latin: !changeNonLatinToLatin,
                  expensiveLetters: false,
                });
              }}
            >
              <p
                className={"vertical-center center"}
                style={{ whiteSpace: "nowrap" }}
              >
                <Checkbox
                  style={{ marginRight: 4 }}
                  checked={changeNonLatinToLatin}
                />
                Change non-latin letters to latin
              </p>
            </div>
          </div>
          <div
            className={
              "add_icon right-cell-delete_contact-plus-save-with-border margin-top-max-620px"
            }
            style={{
              width: "100%",
              background: "rgba(64, 169, 255, 0.15)",
              cursor: "pointer",
            }}
            onClick={() => {
              setChangeNonLatinToLatin(false);
              setAllowExpensiveLetters(!allowExpensiveLetters);
              updateTextArea(textArea, {
                latin: false,
                expensiveLetters: !allowExpensiveLetters,
              });
            }}
          >
            <p className={"vertical-center center"}>
              <Checkbox
                style={{ marginRight: 4 }}
                checked={allowExpensiveLetters}
              />
              Allow much more expensive letters
            </p>
          </div>
        </div>
      </div>
      <TextArea
        ref={textAreaRef}
        size={"large"}
        style={{ marginBottom: 9 }}
        placeholder="Provide the message you want to schedule."
        autoSize={{ minRows: 2, maxRows: 12 }}
        value={textArea}
        onChange={(e) => updateTextArea(e.target.value)}
      />
      <p
        className={"warning-holder"}
        style={{
          marginTop: -15,
          position: "relative",
          marginBottom: 0,
          fontSize: 15,
          zIndex: 99,
        }}
      >
        {parse(textAreaWarningText)}
      </p>
      <div className={"fullW"} style={{ marginBottom: 9 }}>
        <div
          className={showDynamicFunctions ? "add_icon_selected" : "add_icon"}
          style={{ minWidth: "100%", width: "100%", marginRight: 0 }}
          onClick={() => {
            setShowDynamicFunctions(!showDynamicFunctions);
            setTimeout(function () {
              scrollToBottom();
            }, 1000);
          }}
        >
          <div className={"vertical-center center"}>
            <div className={"flex-wrapper"} style={{ padding: "0 9px 0 9px" }}>
              <div style={{ width: "auto" }}>
                <div className={"vertical-center"}>
                  <i className="fas fa-info" style={{ marginRight: 9 }} />
                </div>
              </div>
              <p style={{ textAlign: "center", width: "100%" }}>
                Learn how to create dynamic messages
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={"fullW"}
        style={{ marginBottom: 9 }}
        hidden={!showDynamicFunctions}
      >
        <h2 className={"center"}>available functions:</h2>
        <div>
          <div
            style={{
              background:
                typeof name === "string"
                  ? name === ""
                    ? "rgba(199,199,199,0.3)"
                    : "none"
                  : "none",
              color:
                typeof name === "string"
                  ? name === ""
                    ? "rgba(0,0,0,0.45)"
                    : "none"
                  : "none",
            }}
          >
            <div>
              <hr
                style={{
                  border: "0.1px solid rgb(199,199,199)",
                  marginBottom: 10,
                  marginTop: 10,
                }}
              />
            </div>
            <div className={"flex-wrapper"}>
              <div style={{ minWidth: 20 }}>
                <p style={{ paddingLeft: 5 }}>1.</p>
              </div>
              <div style={{ fontWeight: "bold", width: "100%" }}>
                <p className={"center"}>{"<MY NAME NOW>"}</p>
              </div>
            </div>
            <div
              className={"center"}
              style={{ textAlign: "center", maxWidth: 650, paddingBottom: 10 }}
            >
              Your name at the moment of scheduling the message
              {typeof name === "string"
                ? name.length > 0
                  ? " - " + name
                  : parse(
                      "<br/><b style='color: rgba(0,0,0,0.75)'>The name can be defined in the settings.</b>"
                    )
                : "."}
            </div>
          </div>
          <div
            style={{
              background:
                typeof name === "string"
                  ? name === ""
                    ? "rgba(199,199,199,0.3)"
                    : "none"
                  : "none",
              color:
                typeof name === "string"
                  ? name === ""
                    ? "rgba(0,0,0,0.45)"
                    : "none"
                  : "none",
            }}
          >
            <div>
              <hr
                style={{ borderColor: "rgb(199,199,199)" }}
                style={{ marginBottom: 10 }}
              />
            </div>
            <div className={"flex-wrapper"}>
              <div style={{ minWidth: 20 }}>
                <p style={{ paddingLeft: 5 }}>2.</p>
              </div>
              <div style={{ fontWeight: "bold", width: "100%" }}>
                <p className={"center"}>{"<MY NAME>"}</p>
              </div>
            </div>
            <div
              className={"center"}
              style={{ textAlign: "center", maxWidth: 650, paddingBottom: 10 }}
            >
              Your name at the moment of sending the message, if you will delete
              the name in the meantime, the function will return your name at
              the moment of scheduling the message.
            </div>
          </div>
          <>
            <div>
              <hr
                style={{ borderColor: "rgb(199,199,199)" }}
                style={{ marginBottom: 10 }}
              />
            </div>
            <div className={"flex-wrapper"}>
              <div style={{ minWidth: 20 }}>
                <p style={{ paddingLeft: 5 }}>3</p>
              </div>
              <div style={{ fontWeight: "bold", width: "100%" }}>
                <p className={"center"}>{`<R NAME>`}</p>
              </div>
            </div>
            <div
              className={"center"}
              style={{ textAlign: "center", maxWidth: 650, paddingBottom: 10 }}
            >
              Recipient's name at the moment of scheduling the message.
            </div>
          </>
          <>
            <div>
              <hr
                style={{ borderColor: "rgb(199,199,199)" }}
                style={{ marginBottom: 10 }}
              />
            </div>
            <div className={"flex-wrapper"}>
              <div style={{ minWidth: 20 }}>
                <p style={{ paddingLeft: 5 }}>4</p>
              </div>
              <div style={{ fontWeight: "bold", width: "100%" }}>
                <p className={"center"}>
                  {parse(`<b>\{option 1|option 2|option 3...\}</b>`)}
                </p>
              </div>
            </div>
            <div
              className={"center"}
              style={{ textAlign: "center", maxWidth: 650, paddingBottom: 10 }}
            >
              At the moment of sending a message one option will be randomly
              selected to be sent. If the type of a message is recurring, an
              option will be selected each time (possibly each time different).
              For example <b>{parse(`{Hi <3 | Hello!}`)}</b> sometimes will
              return "Hi {parse(`<3`)}" and sometimes "Hello!".
            </div>
          </>
          <>
            <div>
              <hr
                style={{ borderColor: "rgb(199,199,199)" }}
                style={{ marginBottom: 10 }}
              />
            </div>
            <div className={"flex-wrapper"}>
              <div style={{ minWidth: 20 }}>
                <p style={{ paddingLeft: 5 }}>5</p>
              </div>
              <div style={{ fontWeight: "bold", width: "100%" }}>
                <p className={"center"}>
                  <b>{`<TO 2050>`}</b>
                </p>
              </div>
            </div>
            <div
              className={"center"}
              style={{ textAlign: "center", maxWidth: 650, paddingBottom: 10 }}
            >
              Number of years to chosen year at a moment of sending a message,
              in this case to 2050, also works with the past. For example{" "}
              <b>{`<TO 1950>`}</b> will return positive "71" if message sent in
              2021.
            </div>
          </>
          <>
            <div>
              <hr
                style={{ borderColor: "rgb(199,199,199)" }}
                style={{ marginBottom: 10 }}
              />
            </div>
            <div className={"flex-wrapper"}>
              <div style={{ minWidth: 20 }}>
                <p style={{ paddingLeft: 5 }}>6</p>
              </div>
              <div style={{ fontWeight: "bold", width: "100%" }}>
                <p className={"center"}>
                  <b>{`<TO {DATE} {OPTIONS}>`}</b>
                </p>
              </div>
            </div>
            <div
              className={"center"}
              style={{ textAlign: "center", maxWidth: 650, paddingBottom: 10 }}
            >
              <b>{`{DATE}`}</b> must be selected as follow:
              <br />
              <b>Year="2050"</b> or/and <b>Month="2"</b>
              or/and <b>Day="2" </b>
              require at least 1 value. Valid ranges:
              <br />
              Year: from 1950 to 2100; Month: from 1 to 12; Day: from
              (negative)-31 to 31; If day is negative that means selected day
              from the end of a month. For example day "-1" means last day of a
              month.
              <br />
              <b>{`{OPTIONS}`}</b> can be selected as follow:
              <br />
              <b>Y</b> (years) or/and <b>M</b> (months) or/and <b>W</b> (weeks)
              or/and <b>D</b> (days), if no options selected, we will use{" "}
              <b>YMWD</b> as options.
              <br />
              1. If only Year is provided as a date, function will return a
              number of years to the desired year from the moment of sending the
              message plus year/years. If past, will return a positive number.
              No mater what are the options.
              <br />
              2. If only month is provided, automatically day will be added as
              "1". If options includes "Y", it will be ignored.
              <br />
              3. If only day is provided, function will return a number of days
              or/and weeks to the next closest desired day. If options includes
              "Y" or "M", function will ignore them.
              <br />
              4. If Year and Day are provided, but no Month, function will be{" "}
              <b>not valid</b>.
            </div>
          </>
        </div>
      </div>
      <button
        onClick={() => scheduleNow()}
        className={"button"}
        disabled={
          textArea === undefined
            ? true
            : typeof textArea === "string"
            ? !textArea.length > 0
            : false
        }
        style={{ fontSize: "2rem", marginBottom: 50 }}
      >
        Schedule now
      </button>
      <div ref={EndOfViewRef} />
    </div>
  );
};

export default TextBody;
