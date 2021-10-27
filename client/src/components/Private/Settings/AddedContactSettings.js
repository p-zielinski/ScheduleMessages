import { Input, Space, Checkbox } from "antd";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { useSelector } from "react-redux";

const AddedContact = ({
  id,
  name,
  number,
  save,
  newContactList,
  setNewContactList,
  setUpdateNumberAndNumber_InputContact,
}) => {
  const deleteAddedContact = () => {
    setNewContactList(newContactList.filter((element) => element.id !== id));
  };

  const editAddedContact = () => {
    deleteAddedContact();
    setUpdateNumberAndNumber_InputContact([number, name]);
  };

  return (
    <>
      <div
        key={id}
        className={"fullW input-contact margin-bottom-max-500px"}
        style={{
          position: "related",
          "margin-bottom": "10px",
          left: "0",
          right: "auto",
        }}
      >
        <div className={"flex-wrapper input-contact-inner-no-right-margin"}>
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
            className={"delete_contact left-cell-delete_contact"}
            style={{
              background: "rgba(64, 169, 255, 0.15)",
              cursor: "not-allowed",
            }}
          >
            <p className={"vertical-center center center-min-500px"}>
              Contact <b>{name}</b>
            </p>
          </div>
        </div>
        <div
          className={
            "delete_contact right-cell-delete_contact margin-top-max-500px margin-bottom-max-500px-lrg"
          }
          style={{
            width: "100%",
            background: "rgba(64, 169, 255, 0.15)",
            cursor: "not-allowed",
          }}
        >
          <p className={"vertical-center center center2-min-500px"}>
            <b>({number}) will be added</b>
          </p>
        </div>
      </div>
    </>
  );
};

export default AddedContact;
