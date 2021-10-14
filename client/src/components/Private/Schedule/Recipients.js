import { Select, Input } from "antd";
import AddedContact from "./AddedContact";
import InputContact from "./InputContact";
import { useEffect, useState } from "react";

const { Option } = Select;

const db = [
  ["Piotr ", "+1 224 551 1440"],
  ["Zychu", "+1 6546654440"],
  ["Piotr Zi4324i", "+1 4324321440"],
  ["Piotr ", "+1 224 551 1440"],
  ["Zychu", "+1 6546654440"],
  ["Piotr Zi4324i", "+1 4324321440"],
  ["Piotr ", "+1 224 551 1440"],
  ["Zychu", "+1 6546654440"],
  ["Piotr Zi4324i", "+1 4324321440"],
];

const Recipients = () => {
  const [newContactList, setNewContactList] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const options = [];
  for (let i in db) {
    options.push({
      value: i,
      label: `${db[i][0]} (${db[i][1]})`,
      name: db[i][0],
      number: db[i][1],
    });
  }

  return (
    <div className={"fullW"}>
      <div className={"center"}>
        <h2>recipients:</h2>
      </div>
      <div style={{ marginBottom: "-5px" }}>
        <Select
          value={selectedRecipients}
          onChange={(e) => {
            setSelectedRecipients(e);
          }}
          className={"fullW"}
          style={{ marginBottom: "15px" }}
          size={"large"}
          mode="multiple"
          placeholder="Your contact list"
          options={options}
          filterOption={(input, option) =>
            option.label
              .toLowerCase()
              .replace(/ /g, "")
              .indexOf(input.toLowerCase().replace(/ /g, "")) >= 0
          }
        />
      </div>
      <div>
        {newContactList.map((contact) => (
          <AddedContact
            id={contact.id}
            name={contact.name}
            number={contact.number}
            save={contact.save}
            newContactList={newContactList}
            setNewContactList={setNewContactList}
          />
        ))}
      </div>
      <InputContact
        options={options}
        selectedRecipients={selectedRecipients}
        setSelectedRecipients={setSelectedRecipients}
        newContactList={newContactList}
        setNewContactList={setNewContactList}
      />
    </div>
  );
};

export default Recipients;
