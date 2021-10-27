import { Input, Space, Checkbox } from "antd";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { SegmentedMessage } from "sms-segments-calculator";
import { nanoid } from "nanoid";

const AddedContact = ({
  id,
  name,
  number,
  save,
  newContactList,
  setNewContactList,
  setUpdateNumberAndNumber_InputContact,
  setRequestUpdate,
}) => {
  const deleteAddedContact = () => {
    setNewContactList(newContactList.filter((element) => element.id !== id));
  };

  const editAddedContact = () => {
    deleteAddedContact();
    setUpdateNumberAndNumber_InputContact([number, name]);
  };

  const checkboxHandler = () => {
    let _newContactList = [];
    for (let e of newContactList) {
      if (e.id === id) {
        e.save = !e.save;
        _newContactList.push(e);
      } else {
        _newContactList.push(e);
      }
    }
    setNewContactList(_newContactList);
    setRequestUpdate(nanoid(5) + new Date().getTime());
  };

  return (
    <>
      <div
        key={id}
        className={"fullW input-contact-plus-save margin-bottom-max-620px"}
        style={{
          position: "related",
          "margin-bottom": "10px",
          left: "0",
          right: "auto",
        }}
      >
        <div
          className={
            "fullW flex-wrapper input-contact-inner-no-right-margin-plus-save"
          }
        >
          <div
            className={"add_delete_icon"}
            onClick={() => deleteAddedContact()}
            style={{
              cursor: "pointer",
              width: 30,
              minWidth: 30,
              marginRight: 9,
            }}
          >
            <i className="fas fa-trash vertical-center"></i>
          </div>
          <div
            className={"delete_contact"}
            style={{
              width: 50,
              minWidth: 50,
              paddingLeft: "7px",
              marginRight: 9,
              background: "rgba(64, 169, 255, 0.15)",
              cursor: "not-allowed",
            }}
          >
            <PhoneInput
              style={{ cursor: "not-allowed" }}
              className={"vertical-center"}
              flags={flags}
              value={number}
              international
              disabled={true}
            />
          </div>
          <div
            className={"add_delete_icon"}
            onClick={() => editAddedContact()}
            style={{
              cursor: "pointer",
              width: 30,
              minWidth: 30,
              marginRight: 9,
            }}
          >
            <i
              style={{ marginLeft: 1 }}
              className="fas fa-edit vertical-center"
            ></i>
          </div>
          <div
            className={"delete_contact left-cell-delete_contact-plus-save"}
            style={{
              background: "rgba(64, 169, 255, 0.15)",
              cursor: "not-allowed",
            }}
          >
            <p className={"vertical-center center center-min-620px"}>
              Contact <b>{name}</b>
            </p>
          </div>
        </div>
        <div
          className={
            "flex-wrapper fullW margin-top-max-620px margin-bottom-max-620px-lrg"
          }
        >
          <div
            className={"delete_contact right-cell-delete_contact-plus-save"}
            style={{
              width: "100%",
              background: "rgba(64, 169, 255, 0.15)",
              cursor: "not-allowed",
            }}
          >
            <p className={"vertical-center center center2-min-620px"}>
              <b>({number})</b>
            </p>
          </div>
          <div
            onClick={() => checkboxHandler()}
            className={"delete_contact"}
            style={{
              width: "auto",
              background: "rgba(64, 169, 255, 0.15)",
              minWidth: "auto",
              marginLeft: 9,
              cursor: "pointer",
            }}
          >
            <p
              className={" vertical-center center"}
              style={{
                whiteSpace: "nowrap",
                paddingRight: 10,
                paddingLeft: 10,
              }}
            >
              <Checkbox style={{ marginRight: 4 }} checked={save} />
              <i className="far fa-save" style={{ fontSize: ".85rem" }}></i>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddedContact;
