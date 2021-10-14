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

const InputContact = ({
  options,
  selectedRecipients,
  setSelectedRecipients,
  newContactList,
  setNewContactList,
}) => {
  const [isNameInputDisabled, setIsNameInputDisabled] = useState(false);
  const [name, setName] = useState(null);
  const [number, setNumber] = useState(null);
  const [saveContact, setSaveContact] = useState(true);

  const generateId = () => {
    return nanoid(5) + new Date().getTime();
  };

  const AddContect = () => {
    const newContactNumber = number.split(" ").join("");
    let alreadyAdded = false;
    for (const contact of options) {
      if (newContactNumber === contact.number.split(" ").join("")) {
        if (!selectedRecipients.includes(contact.value)) {
          setSelectedRecipients([...selectedRecipients, contact.value]);
        } else {
          console.log("error: this contact was alredy added!");
        }
        alreadyAdded = true;
        break;
      }
    }

    if (alreadyAdded === false) {
      setNewContactList([
        ...newContactList,
        {
          id: generateId(),
          name: name,
          number: number,
          save: saveContact,
        },
      ]);
    }

    setNumber("");
    setName("");
    setIsNameInputDisabled(false);
  };

  const onChangeName = (e) => {
    setName(e);
  };

  function onChangeNumber(e) {
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

    const newContactNumber = e.split(" ").join("");
    let alreadyAdded = false;
    for (const contact of options) {
      if (newContactNumber === contact.number.split(" ").join("")) {
        setIsNameInputDisabled(true);
        setName(contact.name);
        if (!selectedRecipients.includes(contact.value)) {
          console.log("this number is in your contact list");
        } else {
          console.log("error: this contact was alredy added!");
        }
        alreadyAdded = true;
        break;
      }
      setIsNameInputDisabled(false);
    }

    if (isValidPhoneNumber(y) === false) {
      console.log("not valid");
    }

    try {
      if (
        validatePhoneNumberLength(y) === "TOO_LONG" ||
        (e.length > 10 && parsePhoneNumber(y) === undefined)
      ) {
        return 0;
      }
      setNumber(parsePhoneNumber(y).formatInternational());
    } catch (e) {
      setNumber(y);
    }
  }

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
      <div>
        <Space direction={"horizontal"}>
          <div>
            <Space direction={"horizontal"}>
              <div
                className={"add_delete_icon"}
                onClick={() => AddContect()}
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-plus vertical-center"></i>
              </div>
              <div
                className={"add_delete_icon"}
                style={{
                  width: "50px",
                  paddingLeft: "7px",
                }}
              >
                <PhoneInput
                  className={"vertical-center"}
                  flags={flags}
                  value={number}
                  onChange={(e) => onChangeNumber(e)}
                  international
                />
              </div>
            </Space>
            <p className={"warning-holder"}>&nbsp;</p>
          </div>
          <div>
            <Space direction={"horizontal"}>
              <Input
                onChange={(e) => onChangeNumber(e.target.value)}
                value={number}
                size={"large"}
                placeholder={"phone number"}
                style={{ width: "190px" }}
              />
            </Space>
            <p className={"warning-holder"}>&nbsp;</p>
          </div>
          <div>
            <Input
              maxLength={35}
              value={name}
              disabled={isNameInputDisabled}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder={"name"}
              size={"large"}
              style={{ width: "342px" }}
            />
            <p className={"warning-holder"}>&nbsp;</p>
          </div>
          <div>
            <Space direction={"horizontal"}>
              <div
                className={"add_delete_icon"}
                style={{
                  height: "40px",
                  width: "156px",
                  paddingLeft: "7px",
                  cursor: "pointer",
                }}
                onClick={() => setSaveContact(!saveContact)}
              >
                <p
                  className={"vertical-center test"}
                  style={{ fontSize: ".99rem" }}
                >
                  <Checkbox
                    checked={saveContact}
                    style={{ marginRight: "5px" }}
                  />
                  contact list
                </p>
              </div>
            </Space>
            <p className={"warning-holder"}>&nbsp;</p>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default InputContact;
