import { Select, Input } from "antd";
import AddedContact from "./AddedContact";
import InputContact from "./InputContact";
import { useEffect, useRef, useState } from "react";
import EditSingleContact from "./EditSingleContact";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { setRecipientsAndContactToSave } from "../../../store/actions/scheduleDataActions";

const { Option } = Select;

const Recipients = () => {
  const [newContactList, setNewContactList] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [updateContacts, setUpdateContacts] = useState([]);
  const [
    updateNumberAndNumber_InputContact,
    setUpdateNumberAndNumber_InputContact,
  ] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionsToParse, setOptionsToParse] = useState([]);
  const [requestUpdate, setRequestUpdate] = useState("randomText");
  const EndOfViewRef = useRef(null);

  const scrollToBottom = () => {
    EndOfViewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { contact_list } = useSelector((state) => state.userData);

  const dispatch = useDispatch();

  useEffect(() => {
    const _options = [];
    for (let i in contact_list) {
      _options.push({
        value: i,
        label: `${contact_list[i].name} (${contact_list[i].number})`,
        name: contact_list[i].name,
        number: contact_list[i].number,
      });
    }
    setOptions(_options);
    scrollToBottom();
  }, []);

  useEffect(() => {
    const _options = [];
    for (let i in options) {
      _options.push(
        `<Select.Option key="${i}" value="${options[i].value}" number="${options[i].number}" name="${options[i].label}">${options[i].label}</Select.Option>`
      );
    }
    setOptionsToParse(_options);
  }, [options]);

  const getRecipients = () => {
    let finalSendingList = [];
    let listOfContactToSave = [];
    for (const e of selectedRecipients) {
      finalSendingList.push(updateContacts[parseInt(e)]);
    }
    for (const e of newContactList) {
      finalSendingList.push({
        number: e.number,
        name: e.name,
      });
      if (e.save === true) {
        listOfContactToSave.push({
          number: e.number,
          name: e.name,
        });
      }
    }

    dispatch(
      setRecipientsAndContactToSave(finalSendingList, listOfContactToSave)
    );
  };

  useEffect(() => {
    getRecipients();
  }, [selectedRecipients, requestUpdate, newContactList]);

  return (
    <div className={"fullW"}>
      <div className={"center"}>
        <h2>recipients:</h2>
      </div>
      <div className={"fullW"} style={{ marginBottom: 16 }}>
        <p className={"center"} style={{ textAlign: "center" }}>
          <b>Select contact or contacts you want to send message to:</b>
        </p>
        {selectedRecipients.length > 0 && (
          <p className={"center"} style={{ marginTop: 2 }}>
            Name changes will not apply in the future (unless changed in
            settings).
          </p>
        )}
        <div style={{ marginTop: 10, marginBottom: 10 }}>
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
          >
            {parse(optionsToParse.join(""))}
          </Select>
          <div>
            {selectedRecipients.map((id) => (
              <EditSingleContact
                setRequestUpdate={setRequestUpdate}
                id={id}
                key={id}
                options={options}
                newContactList={newContactList}
                selectedRecipients={selectedRecipients}
                setSelectedRecipients={setSelectedRecipients}
                updateContacts={updateContacts}
                setUpdateContacts={setUpdateContacts}
              />
            ))}
          </div>
        </div>

        <p className={"center"} style={{ marginBottom: 5 }}>
          Add a new contact:
        </p>
        <div>
          {newContactList.map((contact) => (
            <AddedContact
              setRequestUpdate={setRequestUpdate}
              key={contact.id}
              id={contact.id}
              name={contact.name}
              number={contact.number}
              save={contact.save}
              newContactList={newContactList}
              setNewContactList={setNewContactList}
              setUpdateNumberAndNumber_InputContact={
                setUpdateNumberAndNumber_InputContact
              }
            />
          ))}
        </div>
        <div className={"fullW mb"}>
          <InputContact
            updateNumberAndNumber_InputContact={
              updateNumberAndNumber_InputContact
            }
            options={options}
            selectedRecipients={selectedRecipients}
            setSelectedRecipients={setSelectedRecipients}
            newContactList={newContactList}
            setNewContactList={setNewContactList}
          />
        </div>
        <div className={"center flex-wrapper"} style={{ textAlign: "center" }}>
          <p style={{ marginBottom: 5 }}>
            <i className="fas fa-dollar-sign"></i>
            <i className="fas fa-dollar-sign"></i>
            <i className="fas fa-dollar-sign" style={{ marginRight: 4 }}></i>
            means <b>allow much more expensive letters</b>
          </p>
          <p>
            <i className="far fa-save" style={{ marginRight: 4 }}></i>
            means <b>save in contact list</b>
          </p>
        </div>
      </div>
      <div ref={EndOfViewRef} />
    </div>
  );
};

export default Recipients;
