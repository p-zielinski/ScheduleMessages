import { Input, Checkbox } from "antd";
import { useRef, useState, useEffect } from "react";
import flags from "react-phone-number-input/flags";
import PhoneInput from "react-phone-number-input";
import parsePhoneNumber, {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  validatePhoneNumberLength,
} from "libphonenumber-js/mobile";
import { SegmentedMessage } from "sms-segments-calculator";
import parse from "html-react-parser";
import { nanoid } from "nanoid";

const EditSingleContact = ({
  id,
  selectedRecipients,
  options,
  newContactList,
  updateContacts,
  setUpdateContacts,
  allowNumberChange,
  setWantUpdate,
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
  const [wantDeleteClassName, setWantDeleteClassName] = useState("");

  const [wasEverNameLongerThan2Letters, setWasEverNameLongerThan2Letters] =
    useState(false);
  const [nameBackground, setNameBackground] = useState("none");
  const [phoneNumberBackground, setPhoneNumberBackground] = useState("none");

  useEffect(() => {
    let temp = updateContacts;
    temp[id] = {
      origin: options[id].number,
      number: number,
      name: name,
      modified:
        number === options[id].number && name === options[id].name
          ? false
          : true,
      delete: wantDelete,
    };
    setUpdateContacts(temp);
    setWantUpdate(nanoid(24));
  }, [number, name, wantDelete]);

  useEffect(() => {
    if (wantDelete === true) {
      setWarningText("&nbsp;");
      setWantDeleteClassName("width150prc");
    }
  }, [wantDelete]);

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
    <div className={"fullW"}>
      <div
        key={id}
        className={"input-contact"}
        style={{
          position: "related",
          left: "0",
          right: "auto",
        }}
      >
        <div
          className={
            wantDelete
              ? "flex-wrapper input-contact-inner-no-right-margin"
              : "flex-wrapper input-contact-inner"
          }
        >
          <div
            className={"add_delete_icon"}
            style={{ cursor: "pointer", marginRight: 9, minWidth: 30 }}
            onClick={() => setWantDelete(!wantDelete)}
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
                className={"add_delete_icon"}
                style={{
                  minWidth: 50,
                  paddingLeft: "7px",
                  marginRight: 9,
                  background: phoneNumberBackground,
                }}
              >
                <PhoneInput
                  onChange={(e) => onChangeNumber(e)}
                  className={"vertical-center"}
                  flags={flags}
                  key={number}
                  value={number}
                  international
                />
              </div>
              <Input
                onChange={(e) => onChangeNumber(e.target.value)}
                value={number}
                ref={numberInputRef}
                size={"large"}
                style={{
                  width: "100%",
                  background: phoneNumberBackground,
                }}
              />
            </>
          ) : (
            <div
              className={"delete_contact left-cell-delete_contact"}
              style={{ width: "100%" }}
            >
              <p className={"vertical-center center center-min-500px"}>
                Contact <b>{options[id].name}</b>
              </p>
            </div>
          )}
        </div>
        <div className={"flex-wrapper fullW margin-top-max-500px"}>
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
              className={"delete_contact right-cell-delete_contact"}
              style={{ minWidth: 270, width: "150%" }}
            >
              <p
                className={
                  "center vertical-center center2-min-500px right-cell"
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
          "warning-holder margin-bottom-max-500px padding-left-88px-min-width-500px"
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
  );

  // return (
  //   <div className={"fullW"}>
  //     <div
  //       key={id}
  //       className={"input-contact flex-wrapper"}
  //       style={{
  //         position: "related",
  //         left: "0",
  //         right: "auto",
  //       }}
  //     >
  //       <div className={"flex-wrapper input-contact-inner"}>
  //         <div
  //           className={"add_delete_icon"}
  //           style={{ cursor: "pointer", marginRight: 9, minWidth: 30 }}
  //           onClick={() => setWantDelete(!wantDelete)}
  //         >
  //           {!wantDelete ? (
  //             <i className="fas fa-trash vertical-center"></i>
  //           ) : (
  //             <i class="fas fa-trash-restore vertical-center"></i>
  //           )}
  //         </div>
  //       </div>
  //       {!wantDelete ? (
  //         <div>
  //           <div className={"flex-wrapper input-contact-inner"}>
  //             <div
  //               className={"add_delete_icon"}
  //               style={{
  //                 minWidth: 50,
  //                 paddingLeft: "7px",
  //                 marginRight: 9,
  //                 background: phoneNumberBackground,
  //               }}
  //             >
  //               <PhoneInput
  //                 onChange={(e) => onChangeNumber(e)}
  //                 className={"vertical-center"}
  //                 flags={flags}
  //                 key={number}
  //                 value={number}
  //                 international
  //               />
  //             </div>
  //
  //             <Input
  //               onChange={(e) => onChangeNumber(e.target.value)}
  //               value={number}
  //               ref={numberInputRef}
  //               size={"large"}
  //               style={{
  //                 minWidth: 160,
  //                 width: 160,
  //                 marginRight: 9,
  //                 background: phoneNumberBackground,
  //               }}
  //             />
  //           </div>
  //           <div className={"flex-wrapper fullW"}>
  //             {!numberAlreadyUsed ? (
  //               <>
  //                 <Input
  //                   size={"large"}
  //                   value={name}
  //                   style={{ background: nameBackground }}
  //                   ref={nameInputRef}
  //                   onChange={(input) => updateName(input.target.value)}
  //                 />
  //                 <div
  //                   className={"add_delete_icon"}
  //                   style={{
  //                     cursor: "pointer",
  //                     marginLeft: 9,
  //                     background: "none",
  //                     width: 60,
  //                     minWidth: 60,
  //                   }}
  //                   onClick={() => setUCS2encoded(!UCS2encoded)}
  //                 >
  //                   <div className={"flex-wrapper vertical-center center"}>
  //                     <Checkbox
  //                       style={{ marginRight: 3 }}
  //                       checked={UCS2encoded}
  //                     />
  //                     <i
  //                       className="fas fa-dollar-sign"
  //                       style={{ fontSize: ".85rem" }}
  //                     ></i>
  //                     <i
  //                       className="fas fa-dollar-sign"
  //                       style={{ fontSize: ".85rem" }}
  //                     ></i>
  //                     <i
  //                       className="fas fa-dollar-sign"
  //                       style={{ fontSize: ".85rem" }}
  //                     ></i>
  //                   </div>
  //                 </div>
  //                 {(name !== options[id].name ||
  //                   number.replace(/\ /g, "") !==
  //                     options[id].number.replace(/\ /g, "")) && (
  //                   <div
  //                     id={id}
  //                     className={"add_delete_icon"}
  //                     style={{
  //                       minWidth: "auto",
  //                       width: "auto",
  //                       marginLeft: 9,
  //                       cursor: "pointer",
  //                       background: "none",
  //                     }}
  //                     onClick={async () => {
  //                       const UCS2 =
  //                         (await new SegmentedMessage(
  //                           options[id].name
  //                         ).getNonGsmCharacters().length) > 0
  //                           ? true
  //                           : false;
  //                       if (UCS2) {
  //                         setUCS2encoded(true);
  //                       }
  //                       onChangeNumber(options[id].number);
  //                       updateName(options[id].name, UCS2);
  //                     }}
  //                   >
  //                     <p
  //                       className={"flex-wrapper"}
  //                       style={{
  //                         top: "50%",
  //                         float: "right",
  //                         "-ms-transform": "translate3d(0%,55%,0)",
  //                         transform: "translate3d(0%,55%,0)",
  //                         color: "rgba(0, 0, 0, 0.5)",
  //                         whiteSpace: "nowrap",
  //                         marginRight: 9,
  //                       }}
  //                     >
  //                       <i
  //                         className="fas fa-arrow-left"
  //                         style={{
  //                           paddingLeft: 9,
  //                           color: "rgba(0, 0, 0, 0.6)",
  //                           marginRight: 9,
  //                         }}
  //                       ></i>
  //                       {options[id].label}
  //                     </p>
  //                   </div>
  //                 )}
  //               </>
  //             ) : (
  //               <div className={"delete_contact"}>
  //                 <p className={"vertical-center center"}>
  //                   This number is already assigned to <b>{assignedTo}</b>
  //                 </p>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       ) : (
  //         <div className={"delete_contact"}>
  //           <p className={"vertical-center center"}>
  //             Contact <b>{options[id].label}</b> will be deleted
  //           </p>
  //         </div>
  //       )}
  //     </div>
  //     <p
  //       className={"warning-holder"}
  //       style={{
  //         paddingLeft: 88,
  //         fontSize: 13,
  //         marginTop: -3,
  //       }}
  //     >
  //       {parse(numberValidationInfo)}
  //       {isUsernameTooLong && "Name cannot be longer than 16 characters. "}
  //       {isUsernameTooShort && "Name must be at least 2 characters long. "}
  //       {parse(warningText)}
  //     </p>
  //   </div>
  // );
};

export default EditSingleContact;
