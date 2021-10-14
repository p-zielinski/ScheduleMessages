import { Input, Select } from "antd";
import { useEffect, useState } from "react";
import AddedContactSettings from "./AddedContactSettings";
import InputContactSettings from "./InputContactSettings";
import EditSingleContact from "./EditSingleContact";

const { Option } = Select;

const db = [
  ["Piotr ", "+1 224 551 1440"],
  ["Marta", "+1 224 551 1441"],
  ["Monika", "+1 224 551 1442"],
  ["Zbychu ", "+1 224 551 1443"],
  ["Zychu", "+1 224 551 1444"],
  ["Żaba", "+1 224 551 1445"],
];

const EditContacts = () => {
  const [newContactList, setNewContactList] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [updateContacts, setUpdateContacts] = useState([]);

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
    <div className={"center"} style={{ width: 800 }}>
      <h2 className={"center mb"}>Edit your contact list:</h2>
      <div className={"fullW mb"}>
        <p className={"center"} style={{ marginBottom: 5 }}>
          Select contact you want to edit or delete:
        </p>
        <div className={"mb"}>
          <Select
            disabled={false}
            value={selectedRecipients}
            onChange={(e) => {
              setSelectedRecipients(e);
            }}
            className={"fullW"}
            size={"large"}
            style={{ marginBottom: 10 }}
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
          <div>
            {selectedRecipients.map((id) => (
              <EditSingleContact
                id={id}
                key={id}
                options={options}
                newContactList={newContactList}
                selectedRecipients={selectedRecipients}
                updateContacts={updateContacts}
                setUpdateContacts={setUpdateContacts}
              />
            ))}
            {selectedRecipients.length > 0 && (
              <div
                className={"center flex-wrapper"}
                style={{ marginBottom: 40 }}
              >
                <p>
                  <i className="fas fa-dollar-sign"></i>
                  <i className="fas fa-dollar-sign"></i>
                  <i
                    className="fas fa-dollar-sign"
                    style={{ marginRight: 4 }}
                  ></i>
                  means <b>allow much more expensive letters</b>
                </p>
              </div>
            )}
          </div>
        </div>

        <p className={"center"} style={{ marginBottom: 5 }}>
          Add a new contact:
        </p>
        <div>
          {newContactList.map((contact) => (
            <AddedContactSettings
              key={contact.id}
              id={contact.id}
              name={contact.name}
              number={contact.number}
              save={contact.save}
              newContactList={newContactList}
              setNewContactList={setNewContactList}
            />
          ))}
        </div>
        <div className={"mb"}>
          <InputContactSettings
            options={options}
            selectedRecipients={selectedRecipients}
            setSelectedRecipients={setSelectedRecipients}
            newContactList={newContactList}
            setNewContactList={setNewContactList}
          />
        </div>
        <div>
          <b>
            <p className={"center"}>
              Allowing much more expensive letters may significantly increase
              the
            </p>
            <p className={"center"}>cost of sending messages in the future.</p>
            <p className={"center"}>
              If You will use those names inside the messages.
            </p>
          </b>
          <p className={"center mb"} style={{ marginTop: 10 }}>
            Please double-check the changes and click the button below
          </p>
        </div>
      </div>

      <button className={"button"} type={"submit"} style={{ fontSize: "2rem" }}>
        Update
      </button>
    </div>
  );
};

export default EditContacts;
