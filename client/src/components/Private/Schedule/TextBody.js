import { Checkbox, Input, Select, Radio } from "antd";
import { useEffect, useRef, useState } from "react";
import transliterate from "@sindresorhus/transliterate";
import { SegmentedMessage } from "sms-segments-calculator";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessageBody,
  setMessageEnds,
  setAllowExpensiveCharacters,
} from "../../../store/actions/scheduleDataActions";
import MessageEnds from "./MessageEnds";
import { ReactCodeJar, useCodeJar } from "react-codejar";

const highlight = (editor) => {
  let code = editor.textContent;
  code = code.replace(/\((\w+?)(\b)/g, '(<font color="#8a2be2">$1</font>$2');
  editor.innerHTML = code;
};

const { Option } = Select;

const { TextArea } = Input;

let messageEndsDB = [
  "This message was scheduled on ScheduleMessages.com, reply STOP to not receiving messages from this number in the future.",
  "This message was scheduled by {YOUR NAME}, reply STOP to not receiving messages from this number in the future.",
  "Reply STOP to not receiving messages from this number in the future.",
];

const TextBody = () => {
  const { name, messageBody } = useSelector((state) => state.userData);

  const [selected, setSelected] = useState(null);

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
  const [options, setOptions] = useState([]);
  const [optionsToParse, setOptionsToParse] = useState([]);
  const dispatch = useDispatch();
  const [sampleTextArea, setSampleTextArea] = useState(null);

  useEffect(() => {
    let temp = "";
    if (textArea !== "") {
      temp += textArea;
    }
    const lastLetter = temp.charAt(temp.length - 1);
    if (lastLetter !== " " && temp.length > 0) {
      temp += " ";
    }
    if (selected !== null) {
      if (allowExpensiveLetters === false) {
        temp += options[selected].replace(/{YOUR NAME}/g, transliterate(name));
      } else {
        temp += options[selected].replace(/{YOUR NAME}/g, name);
      }
    }
    if (temp === " " || temp === "") {
      setSampleTextArea(null);
    } else {
      setSampleTextArea(temp);
    }
    if (temp === " " || temp === "") {
      setSampleTextArea(null);
    } else {
      setSampleTextArea(temp);
    }
  }, [selected, textArea, allowExpensiveLetters]);

  useEffect(() => {
    const tempOptions = [...messageEndsDB];
    setOptions(tempOptions);
    if (messageBody === undefined) {
      setTextArea("");
    }
  }, []);

  useEffect(() => {
    dispatch(setAllowExpensiveCharacters(allowExpensiveLetters));
  }, [allowExpensiveLetters]);

  useEffect(() => {
    dispatch(setMessageBody(textArea));
  }, [textArea]);

  useEffect(() => {
    if (selected !== null) {
      if (allowExpensiveLetters === false) {
        dispatch(
          setMessageEnds(
            options[selected].replace(/{YOUR NAME}/g, transliterate(name))
          )
        );
      } else {
        dispatch(
          setMessageEnds(options[selected].replace(/{YOUR NAME}/g, name))
        );
      }
    }
  }, [selected, allowExpensiveLetters]);

  useEffect(() => {
    const tempOptions = [];
    let i = 0;
    for (let e of options) {
      if (e.includes("{YOUR NAME}") && name === "") {
        tempOptions.push({
          text: e,
          id: i,
          disabled: true,
        });
      } else {
        if (allowExpensiveLetters === false) {
          e = e.replace(/{YOUR NAME}/g, transliterate(name));
          tempOptions.push({
            text: e,
            id: i,
            disabled: false,
          });
        } else {
          e = e.replace(/{YOUR NAME}/g, name);
          tempOptions.push({
            text: e,
            id: i,
            disabled: false,
          });
        }
      }
      i += 1;
    }
    setOptionsToParse(tempOptions);
  }, [options, allowExpensiveLetters]);

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

  const updateTextArea = (text, options) => {
    const local_changeNonLation =
      typeof options === "object"
        ? options.latin !== undefined
          ? options.latin
            ? true
            : false
          : changeNonLatinToLatin
        : changeNonLatinToLatin;

    if (local_changeNonLation) {
      text = transliterate(text);
    }

    const local_allowExpensiveLetters =
      typeof options === "object"
        ? options.expensiveLetters !== undefined
          ? options.expensiveLetters
            ? true
            : false
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
  };

  return (
    <div className={"mb"}>
      <div className={"center"}>
        <h2>message body:</h2>
      </div>
      <div className={"fullW"} style={{ marginBottom: 9 }}>
        <div className={"input-contact-plus-save"} style={{ width: "100%" }}>
          <div className={"flex-wrapper input-contact-inner-plus-save"}>
            <div
              className={"add_icon"}
              style={{ minWidth: 30, marginRight: 9 }}
            >
              <p className={"vertical-center center"}>
                <i className="fas fa-info"></i>
              </p>
            </div>
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
        placeholder="Provide the message you want to schedule."
        autoSize={{ minRows: 2, maxRows: 12 }}
        value={textArea}
        onChange={(e) => updateTextArea(e.target.value)}
      />
      <p className={"warning-holder mb"} style={{ marginTop: -3 }}>
        {parse(textAreaWarningText)}
      </p>
      <h2 className={"center"}>message ends:</h2>
      <p className={"center"} style={{ marginBottom: 10 }}>
        select one
      </p>
      <div className={"fullW flex-wrapper"} style={{ flexDirection: "column" }}>
        {optionsToParse.map((e) => (
          <MessageEnds
            selected={selected}
            setSelected={setSelected}
            text={e.text}
            id={e.id}
            key={e.id}
            disabled={e.disabled}
          />
        ))}
      </div>
      {sampleTextArea !== null && (
        <>
          <h2 className={"center"} style={{ marginBottom: 10, marginTop: 20 }}>
            Sample
          </h2>
          <div
            className={"add_icon_disabled"}
            style={{
              width: "100%",
              height: "auto",
              marginTop: 10,
            }}
          >
            <p className={"fullW center"} style={{ padding: 10 }}>
              {sampleTextArea}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default TextBody;
