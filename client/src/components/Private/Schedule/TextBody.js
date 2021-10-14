import { Checkbox, Input, Select } from "antd";
import { useState } from "react";

const { Option } = Select;

const { TextArea } = Input;

let messageEndsDB = [
  {
    label:
      "This message was sent automaticly, reply STOP to not receiving messages in the future.",
    disabled: true,
  },
  {
    label:
      "This message was scheduled on schedulemessages.com, reply STOP to not receiving messages in the future.",
    disabled: false,
  },
  {
    label:
      "This message is from (your name), reply STOP to not receiving messages in the future.",
    disabled: true,
  },
  {
    label:
      "This message was sent from (your name), reply STOP to not receiving messages in the future.",
    disabled: false,
  },
];

const TextBody = () => {
  const options = [];
  let defaultOption = null;
  let counter = 0;
  for (let i in messageEndsDB) {
    options.push({
      value: i,
      label: messageEndsDB[i].label,
      disabled: messageEndsDB[i].disabled,
    });
    if (defaultOption === null) {
      if (messageEndsDB[i].disabled === false) {
        defaultOption = i;
      }
    }
  }

  const [type, setType] = useState("static");
  const [name, setName] = useState("undefined");
  const [textArea, setTextArea] = useState("");
  const [select, setSelect] = useState(defaultOption);
  return (
    <div className={"mb"}>
      <div className={"center"}>
        <h2>message body:</h2>
      </div>
      <TextArea
        size={"large"}
        placeholder="Autosize height with minimum and maximum number of lines"
        autoSize={{ minRows: 2, maxRows: 12 }}
        value={textArea}
        onChange={(e) => setTextArea(e.target.value)}
        className={"mb"}
      />
      <div className={"center"}>
        <h2>message ends:</h2>
      </div>
      <Select
        value={select}
        onChange={setSelect}
        className={"fullW"}
        options={options}
      />
      <div className={"center mb"} style={{ "margin-top": "7px" }}>
        <Checkbox>Set this value as a default</Checkbox>
      </div>
      <div className={"center"}>
        <h2>sample:</h2>
      </div>
      <TextArea
        size={"large"}
        placeholder="Autosize height with minimum and maximum number of lines"
        autoSize={{ minRows: 2 }}
        value={textArea + " " + options[select].label}
        className={"mb"}
        disabled={true}
      />
    </div>
  );
};

export default TextBody;
