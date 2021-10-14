import { Input, Space, Checkbox } from "antd";
import { useState } from "react";

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
      className={"fullW"}
      style={{
        position: "related",
        "margin-bottom": "10px",
        left: "0",
        right: "auto",
      }}
    >
      <Space direction={"horizontal"}>
        <div
          className={"add_delete_icon"}
          onClick={() => deleteAddedContact()}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-trash vertical-center"></i>
        </div>
        <Input
          value={number}
          disabled={true}
          size={"large"}
          style={{ width: "248px", cursor: "not-allowed" }}
        />
        <Input
          value={name}
          disabled={true}
          size={"large"}
          style={{ width: "342px" }}
        />
        <div
          className={"add_delete_icon"}
          style={{
            height: "40px",
            width: "156px",
            paddingLeft: "7px",
            cursor: "pointer",
          }}
          onClick={() => reverseSaveVerible()}
          // onClick={() => setSaveContact(!saveContact)}
        >
          <p className={"vertical-center test"} style={{ fontSize: ".99rem" }}>
            <Checkbox checked={save} style={{ marginRight: "5px" }} />
            contact list
          </p>
        </div>
      </Space>
    </div>
  );
};

export default AddedContact;
