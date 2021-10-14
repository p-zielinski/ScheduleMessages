import { Input, Space } from "antd";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";
import parsePhoneNumber, {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  validatePhoneNumberLength,
} from "libphonenumber-js/mobile";
import { Checkbox } from "antd";
import parse from "html-react-parser";
import { SegmentedMessage } from "sms-segments-calculator";

const InputContact = ({
  options,
  selectedRecipients,
  setSelectedRecipients,
  newContactList,
  setNewContactList,
}) => {
  const [inputName, setInputName] = useState("");
  const [number, setNumber] = useState("");
  const [numberAlreadyUsed, setNumberAlreadyUsed] = useState(false);
  const [assignedTo, setAssignedTo] = useState(null);
  const numberInputRef = useRef();
  const [numberValidationInfo, setNumberValidationInfo] = useState("&nbsp;");

  const [isUsernameTooLong, setIsUsernameTooLong] = useState(false);
  const [isUsernameTooShort, setIsUsernameTooShort] = useState(false);
  const [UCS2encoded, setUCS2encoded] = useState(false);
  const [warningText, setWarningText] = useState("&nbsp;");
  const nameInputRef = useRef();
  const [whileNextTimeUpdateResetWarning, setWhileNextTimeUpdateResetWarning] =
    useState(false);
  const [foundWarningLetters, setFoundWarningLetters] = useState([]);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isNumberValid, setIsNumberValid] = useState(false);
  const [addContactButtonClassName, setAddContactButtonClassName] =
    useState("add_icon_disabled");
  const [wasEverNameLongerThan2Letters, setWasEverNameLongerThan2Letters] =
    useState(false);

  const [nameBackground, setNameBackground] = useState("none");
  const [phoneNumberBackground, setPhoneNumberBackground] = useState("none");
  const [messageIsBeingEdited, setMessageIsBeingEdited] = useState(false);

  useEffect(() => {
    onChangeNumber(number);
  }, [selectedRecipients]);

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const didInputNumberChanged = async (number) => {
    setNumberValidationInfo("&nbsp;");
    await timeout(1000);
    try {
      if (number === numberInputRef.current.state.value) {
        if (isValidPhoneNumber(number)) {
          setNumberValidationInfo("&nbsp;");
        } else {
          if (typeof number === "string") {
            if (number.length > 1) {
              setNumberValidationInfo("This phone number is not valid.&nbsp;");
            }
          }
        }
      }
    } catch (e) {}
  };

  const didInputNameChanged = async (name) => {
    await timeout(2000);
    try {
      if (name === nameInputRef.current.state.value) {
        if (name.length < 2 && wasEverNameLongerThan2Letters) {
          setIsUsernameTooShort(true);
          console.log("jest za krotkie");
        }
        setWhileNextTimeUpdateResetWarning(true);
      }
    } catch (e) {}
  };

  const generateId = () => {
    return nanoid(5) + new Date().getTime();
  };

  const AddContact = async () => {
    if (addContactButtonClassName === "add_icon_disabled") {
      return 0;
    }

    if (numberAlreadyUsed === false) {
      setNewContactList([
        ...newContactList,
        {
          id: generateId(),
          name: inputName,
          number: number,
          save: true,
        },
      ]);
    } else if (typeof numberAlreadyUsed === "string") {
      console.log("test");
      setNumberAlreadyUsed(false);
      setNewContactList(
        newContactList.filter((element) => element.id !== numberAlreadyUsed)
      ); //numberAlreadyUsed is an ID
      updateName(inputName);
      setWasEverNameLongerThan2Letters(false);
      return 0;
    } else if (numberAlreadyUsed) {
      for (let contact of options) {
        if (contact.number.replace(/\ /g, "") === number.replace(/\ /g, "")) {
          setSelectedRecipients([...selectedRecipients, contact.value]);
        }
        break;
      }
    }
    setWasEverNameLongerThan2Letters(false);
    setAddContactButtonClassName("add_icon_disabled");
    setNameBackground("none");
    setPhoneNumberBackground("none");
    setIsNameValid(false);
    setIsNumberValid(false);
    setNumber("");
    setInputName("");
    setIsUsernameTooShort(false);
  };

  function onChangeNumber(e) {
    setNumberAlreadyUsed(false);
    setMessageIsBeingEdited(false);
    setIsUsernameTooLong(false);
    setWarningText("&nbsp;");

    let y;
    if (e.length >= 1) {
      y = "+";
    } else {
      y = "";
    }

    for (let x of e) {
      if (!isNaN(parseInt(x))) {
        y += x;
      }
    }

    let local_MessageIsBeingEdited = false;
    let found = false;
    for (let contact of options) {
      if (contact.number.replace(/\ /g, "") === y) {
        if (selectedRecipients.includes(contact.value)) {
          local_MessageIsBeingEdited = true;
          setMessageIsBeingEdited(true);
        }
        setNumberAlreadyUsed(true);
        setAssignedTo(contact.name);
        found = true;
        break;
      }
    }

    if (found === false) {
      for (let contact of newContactList) {
        if (contact.number.replace(/\ /g, "") === y) {
          found = true;
          setAssignedTo(contact.name);
          setNumberAlreadyUsed(contact.id); //id
          break;
        }
      }
    }

    try {
      if (
        validatePhoneNumberLength(y) === "TOO_LONG" ||
        (e.length > 10 && parsePhoneNumber(y) === undefined)
      ) {
        return 0;
      }
      let temp = parsePhoneNumber(y).formatInternational();
      setNumber(temp);
      didInputNumberChanged(temp);

      if (isValidPhoneNumber(temp)) {
        setIsNumberValid(true);
        setPhoneNumberBackground("rgba(64, 169, 255, 0.15)");
        if (isNameValid || found) {
          setAddContactButtonClassName("add_icon");
        } else {
          setAddContactButtonClassName("add_icon_disabled");
        }
      } else {
        setIsNumberValid(false);
        setPhoneNumberBackground("none");
        setAddContactButtonClassName("add_icon_disabled");
      }
    } catch (e) {
      setNumber(y);
      didInputNumberChanged(y);
      if (isValidPhoneNumber(y)) {
        setIsNumberValid(true);
        if (isNameValid) {
          setAddContactButtonClassName("add_icon");
        } else {
          setAddContactButtonClassName("add_icon_disabled");
        }
      } else {
        setIsNumberValid(false);
        setAddContactButtonClassName("add_icon_disabled");
      }
    }
    if (local_MessageIsBeingEdited)
      setAddContactButtonClassName("add_icon_disabled");
  }

  useEffect(() => {
    setWarningText("&nbsp;");
    setFoundWarningLetters([]);
    updateName(inputName);
  }, [UCS2encoded]);

  const updateName = (name) => {
    setIsUsernameTooShort(false);
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
      .split("");

    if (!UCS2encoded) {
      name = name.map((e) =>
        nonGSM7Characters.includes(e.toLowerCase()) ? null : e
      );
    }

    name = name.join("");
    if (!wasEverNameLongerThan2Letters) {
      if (name.length > 0) {
        setWasEverNameLongerThan2Letters(true);
      }
    }

    if (name.length <= 16) {
      setInputName(name);
      if (name.length > 1 && name.length <= 16) {
        setIsNameValid(true);
        setNameBackground(" rgba(64, 169, 255, 0.15)");
        if (isNumberValid) {
          setAddContactButtonClassName("add_icon");
        } else {
          setAddContactButtonClassName("add_icon_disabled");
        }
      } else {
        setIsNameValid(false);
        setNameBackground("none");
        setAddContactButtonClassName("add_icon_disabled");
      }
    }

    didInputNameChanged(name);
  };

  return (
    <div
      className={"fullW"}
      style={{
        position: "related",
        marginBottom: "-15px",
        left: "0",
        right: "auto",
      }}
    >
      <div className={"flex-wrapper"}>
        <div
          className={addContactButtonClassName}
          onClick={() => AddContact()}
          style={{ marginRight: 9, width: 30, minWidth: 30 }}
        >
          {numberAlreadyUsed ? (
            <i
              className="fas fa-edit vertical-center"
              style={{ marginLeft: 1 }}
            ></i>
          ) : (
            <i className="fas fa-plus vertical-center"></i>
          )}
        </div>
        <div
          className={"add_delete_icon"}
          style={{
            width: 50,
            minWidth: 50,
            paddingLeft: "7px",
            marginRight: 9,
            background: phoneNumberBackground,
          }}
        >
          <PhoneInput
            className={"vertical-center"}
            flags={flags}
            value={number}
            onChange={setNumber}
            international
          />
        </div>
        <div>
          <Input
            onChange={(e) => onChangeNumber(e.target.value)}
            ref={numberInputRef}
            value={number}
            size={"large"}
            placeholder={"phone number"}
            style={{
              width: 160,
              minWidth: 160,
              marginRight: 9,
              background: phoneNumberBackground,
            }}
          />
        </div>
        {console.log(numberAlreadyUsed)}
        {!numberAlreadyUsed ? (
          <div className={"flex-wrapper fullW"}>
            <Input
              size={"large"}
              placeholder={"name"}
              value={inputName}
              ref={nameInputRef}
              style={{ background: nameBackground }}
              onChange={(e) => updateName(e.target.value)}
            />
            <div
              onClick={() => setUCS2encoded(!UCS2encoded)}
              className={"add_icon fullW flex-wrapper"}
              style={{
                width: "auto",
                minWidth: "auto",
                marginLeft: 9,
                background: "none",
                cursor: "pointer",
              }}
            >
              <p
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  fontSize: ".99rem",
                  whiteSpace: "nowrap",
                  marginLeft: 9,
                  marginRight: 9,
                }}
              >
                <Checkbox
                  checked={UCS2encoded}
                  style={{ marginRight: "5px" }}
                />
                Allow much more expensive letters
              </p>
            </div>
          </div>
        ) : messageIsBeingEdited ? (
          <div className={"delete_contact"}>
            <p className={"vertical-center center"}>
              This number assigned to <b>{assignedTo}</b> is being edited
            </p>
          </div>
        ) : (
          <div className={"delete_contact"}>
            <p className={"vertical-center center"}>
              This number is already assigned to <b>{assignedTo}</b>
            </p>
          </div>
        )}
      </div>
      <p
        className={"warning-holder"}
        style={{
          paddingLeft: 88,
          fontSize: 13,
          marginTop: -3,
        }}
      >
        {parse(numberValidationInfo)}
        {isUsernameTooLong && "Name cannot be longer than 16 characters. "}
        {isUsernameTooShort && "Name must be at least 2 characters long. "}
        {parse(warningText)}
      </p>
    </div>
  );
};

export default InputContact;
