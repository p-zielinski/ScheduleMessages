import { useState } from "react";

const MessageEnds = ({ text, id, disabled, selected, setSelected }) => {
  const [isDisabled] = useState(disabled ? "add_icon_disabled" : "add_icon");

  const selectThisOption = () => {
    if (!disabled) setSelected(id);
    console.log(selected);
  };

  return (
    <div
      className={
        disabled
          ? isDisabled
          : selected === id
          ? "add_icon_selected"
          : "add_icon"
      }
      style={{
        width: "100%",
        height: "auto",
        marginBottom: 10,
      }}
      onClick={() => selectThisOption()}
    >
      <p
        className={"fullW center"}
        style={{ padding: 10, textAlign: "center" }}
      >
        {text}
      </p>
    </div>
  );
};

export default MessageEnds;
