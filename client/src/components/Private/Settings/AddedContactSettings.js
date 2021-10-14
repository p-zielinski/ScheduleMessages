import { Input, Space, Checkbox } from "antd";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

const AddedContact = ({
  id,
  name,
  number,
  save,
  newContactList,
  setNewContactList,
}) => {
  const deleteAddedContact = () => {
    setNewContactList(newContactList.filter((element) => element.id !== id));
  };

  const reverseSaveVerible = async () => {
    setNewContactList(
      newContactList.map((e) => {
        if (e.id === id) {
          e.save = !e.save;
        }
        return e;
      })
    );
  };

  return (
    <div
      key={id}
      className={"fullW flex-wrapper"}
      style={{
        position: "related",
        "margin-bottom": "10px",
        left: "0",
        right: "auto",
      }}
    >
      <div
        className={"add_delete_icon"}
        onClick={() => deleteAddedContact()}
        style={{ cursor: "pointer", width: 30, minWidth: 30, marginRight: 9 }}
      >
        <i className="fas fa-trash vertical-center"></i>
      </div>
      <div
        className={"delete_contact"}
        style={{ background: "rgba(64, 169, 255, 0.15)" }}
      >
        <p className={"vertical-center center"}>
          Contact{" "}
          <b>
            {name} ({number})
          </b>
          &nbsp;will be added
        </p>
      </div>
      {/*<div className={"flex-wrapper fullW"}>*/}
      {/*  <div*/}
      {/*    className={"delete_contact"}*/}
      {/*    style={{*/}
      {/*      width: 50,*/}
      {/*      minWidth: 50,*/}
      {/*      paddingLeft: "7px",*/}
      {/*      background: "rgba(64, 169, 255, 0.1)",*/}
      {/*      marginLeft: 9,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <PhoneInput*/}
      {/*      disabled*/}
      {/*      className={"vertical-center"}*/}
      {/*      flags={flags}*/}
      {/*      value={number}*/}
      {/*      international*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*  <div*/}
      {/*    id={id}*/}
      {/*    className={"delete_contact"}*/}
      {/*    style={{*/}
      {/*      width: 160,*/}
      {/*      minWidth: 160,*/}
      {/*      background: "rgba(64, 169, 255, 0.1)",*/}
      {/*      marginLeft: 9,*/}
      {/*      cursor: "not-allowed",*/}
      {/*    }}*/}
      {/*    onClick={() => {}}*/}
      {/*  >*/}
      {/*    <p*/}
      {/*      className={"flex-wrapper"}*/}
      {/*      style={{*/}
      {/*        marginLeft: 9,*/}
      {/*        top: "50%",*/}
      {/*        "-ms-transform": "translate3d(0%,55%,0)",*/}
      {/*        transform: "translate3d(0%,55%,0)",*/}
      {/*        color: "rgba(0, 0, 0, 1)",*/}
      {/*        whiteSpace: "nowrap",*/}
      {/*        marginRight: 9,*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      {number}*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*  <div*/}
      {/*    id={id}*/}
      {/*    className={"delete_contact"}*/}
      {/*    style={{*/}
      {/*      background: "rgba(64, 169, 255, 0.1)",*/}
      {/*      marginLeft: 9,*/}
      {/*      cursor: "not-allowed",*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <p*/}
      {/*      style={{*/}
      {/*        marginLeft: 9,*/}

      {/*        top: "50%",*/}
      {/*        "-ms-transform": "translate3d(0%,55%,0)",*/}
      {/*        transform: "translate3d(0%,55%,0)",*/}
      {/*        color: "rgba(0, 0, 0, 1)",*/}
      {/*        whiteSpace: "nowrap",*/}
      {/*        marginRight: 9,*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      {name}*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default AddedContact;
