import { Input, Checkbox } from "antd";
import { useRef, useState, useEffect } from "react";
import flags from "react-phone-number-input/flags";
import PhoneInput from "react-phone-number-input";
import parsePhoneNumber, {
  isValidPhoneNumber,
  validatePhoneNumberLength,
} from "libphonenumber-js/mobile";
import { SegmentedMessage } from "sms-segments-calculator";
import parse from "html-react-parser";
import { nanoid } from "nanoid";

const EditSingleContact = ({
  id,
  selectedRecipients,
  setSelectedRecipients,
  options,
  newContactList,
  updateContacts,
  setUpdateContacts,
  allowNumberChange,
  setRequestUpdate,
}) => {
  const [number, setNumber] = useState(options[id].number);
  const [name, setName] = useState(options[id].name);
  const [wantDelete, setWantDelete] = useState(false);
  const [numberAlreadyUsed, setNumberAlreadyUsed] = useState(false);
  const [dbOfNumber] = useState(options.map((e) => [e.number, e.name]));
  const [assignedTo, setAssignedTo] = useState(null);

  const [isUsernameTooLong, setIsUsernameTooLong] = useState(false);
  const [isUsernameTooShort, setIsUsernameTooShort] = useState(false);
  const [warningText, setWarningText] = useState("&nbsp;");
  const nameInputRef = useRef();
  const numberInputRef = useRef();
  const [whileNextTimeUpdateResetWarning, setWhileNextTimeUpdateResetWarning] =
    useState(false);
  const [foundWarningLetters, setFoundWarningLetters] = useState([]);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isNumberValid, setIsNumberValid] = useState(false);
  const [numberValidationInfo, setNumberValidationInfo] = useState("&nbsp;");
  const [UCS2encoded, setUCS2encoded] = useState(
    new SegmentedMessage(name).getNonGsmCharacters().length > 0 ? true : false
  );

  const [wasEverNameLongerThan2Letters, setWasEverNameLongerThan2Letters] =
    useState(false);
  const [nameBackground, setNameBackground] = useState("none");
  const [phoneNumberBackground, setPhoneNumberBackground] = useState("none");

  useEffect(() => {
    let temp = updateContacts;
    temp[id] = {
      number: number,
      name: name,
    };
    setUpdateContacts(temp);
    setRequestUpdate(nanoid(5) + new Date().getTime());
  }, [selectedRecipients, name]);

  const onDelete = () => {
    console.log(selectedRecipients);
    setSelectedRecipients(selectedRecipients.filter((e) => e !== id));
  };

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    onChangeNumber(number);
  }, [newContactList]);

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
        }
        setWhileNextTimeUpdateResetWarning(true);
      }
    } catch (e) {}
  };

  useEffect(() => {
    setWarningText("&nbsp;");
    setFoundWarningLetters([]);
    updateName(name);
  }, [UCS2encoded]);

  const updateName = (name, UCS2) => {
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
    if (UCS2encoded === false && UCS2 !== true) {
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

    if (!UCS2encoded || UCS2) {
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
      setName(name);
      if (name.length > 1 && name.length <= 16) {
        setIsNameValid(true);
        setNameBackground("rgba(64, 169, 255, 0.15)");
      } else {
        setIsNameValid(false);
        setNameBackground("none");
      }
    }

    didInputNameChanged(name);
  };

  function onChangeNumber(e) {
    setPhoneNumberBackground("none");
    setNumberAlreadyUsed(false);
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

    if (e.replace(/\ /g, "") === options[id].number.replace(/\ /g, "")) {
      setNumber(options[id].number);
      setNumberValidationInfo("&nbsp;");
      setPhoneNumberBackground("rgba(64, 169, 255, 0.15)");
      return 0;
    }

    let local_numberAlreadyUsed = "";
    let found = false;
    for (let contact of options) {
      if (contact.number.replace(/\ /g, "") === y) {
        setNumberAlreadyUsed(contact.number);
        local_numberAlreadyUsed = contact.number;
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
          local_numberAlreadyUsed = contact.number;
          setNumberAlreadyUsed(contact.number); //id
          break;
        }
      }
    }

    if (
      isValidPhoneNumber(y) &&
      y !== local_numberAlreadyUsed.replace(/\ /g, "")
    )
      setPhoneNumberBackground("rgba(64, 169, 255, 0.15)");

    try {
      if (
        validatePhoneNumberLength(y) === "TOO_LONG" ||
        (e.length > 10 && parsePhoneNumber(y) === undefined)
      ) {
        onChangeNumber(number);
        return 0;
      }
      let temp = parsePhoneNumber(y).formatInternational();
      setNumber(temp);
      didInputNumberChanged(temp);
    } catch (e) {
      setNumber(y);
      didInputNumberChanged(y);
    }
  }

  return (
    <>
      <div className={"fullW"}>
        <div
          key={id}
          className={"input-contact-plus-save"}
          style={{
            position: "related",
            left: "0",
            right: "auto",
          }}
        >
          <div
            className={
              wantDelete
                ? "flex-wrapper input-contact-inner-no-right-margin-plus-save"
                : "flex-wrapper input-contact-inner-plus-save"
            }
          >
            <div
              className={"add_delete_icon"}
              style={{ cursor: "pointer", marginRight: 9, minWidth: 30 }}
              onClick={() => onDelete()}
            >
              {!wantDelete ? (
                <i className="fas fa-trash vertical-center"></i>
              ) : (
                <i class="fas fa-trash-restore vertical-center"></i>
              )}
            </div>
            {!wantDelete ? (
              <>
                <div
                  className={"add_icon_disabled"}
                  style={{
                    minWidth: 50,
                    paddingLeft: "7px",
                    marginRight: 9,
                  }}
                >
                  <PhoneInput
                    onChange={(e) => onChangeNumber(e)}
                    className={"vertical-center"}
                    flags={flags}
                    key={number}
                    value={number}
                    international
                    disabled={true}
                  />
                </div>
                <div
                  className={"add_icon_disabled"}
                  style={{
                    width: "100%",
                  }}
                >
                  <p className={"vertical-center"} style={{ paddingLeft: 9 }}>
                    {number}
                  </p>
                </div>
              </>
            ) : (
              <div
                className={"delete_contact left-cell-delete_contact-plus-save"}
                style={{ width: "100%" }}
              >
                <p className={"vertical-center center center-min-620px"}>
                  Contact <b>{options[id].name}</b>
                </p>
              </div>
            )}
          </div>
          <div className={"flex-wrapper fullW margin-top-max-620px"}>
            {!wantDelete ? (
              !numberAlreadyUsed ? (
                <>
                  <Input
                    size={"large"}
                    value={name}
                    style={{ background: nameBackground }}
                    ref={nameInputRef}
                    onChange={(input) => updateName(input.target.value)}
                  />
                  <div
                    className={"add_delete_icon"}
                    style={{
                      cursor: "pointer",
                      marginLeft: 9,
                      background: "none",
                      width: 60,
                      minWidth: 60,
                    }}
                    onClick={() => setUCS2encoded(!UCS2encoded)}
                  >
                    <div className={"flex-wrapper vertical-center center"}>
                      <Checkbox
                        style={{ marginRight: 3 }}
                        checked={UCS2encoded}
                      />
                      <i
                        className="fas fa-dollar-sign"
                        style={{ fontSize: ".85rem" }}
                      ></i>
                      <i
                        className="fas fa-dollar-sign"
                        style={{ fontSize: ".85rem" }}
                      ></i>
                      <i
                        className="fas fa-dollar-sign"
                        style={{ fontSize: ".85rem" }}
                      ></i>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={"delete_contact"}
                  style={{ minWidth: 270, width: "150%" }}
                >
                  <p className={"center vertical-center"}>
                    This number is assigned to <b>{assignedTo}</b>
                  </p>
                </div>
              )
            ) : (
              <div
                className={"delete_contact right-cell-delete_contact-plus-save"}
                style={{ minWidth: 270, width: "150%" }}
              >
                <p
                  className={
                    "center vertical-center center2-min-620px right-cell"
                  }
                >
                  <b>({options[id].number})</b> will be deleted
                </p>
              </div>
            )}
          </div>
        </div>
        <p
          className={
            "warning-holder margin-bottom-max-620px padding-left-88px-min-width-620px"
          }
          style={{
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
    </>
  );
};

export default EditSingleContact;
