import { Input, Select } from "antd";
import { useEffect, useState } from "react";
import AddedContactSettings from "./AddedContactSettings";
import InputContactSettings from "./InputContactSettings";
import EditSingleContact from "./EditSingleContact";
import { useSelector } from "react-redux";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js/mobile";
import { useDispatch } from "react-redux";
import { setContactList } from "../../../store/actions/userDataActions";
import parse from "html-react-parser";

const { Option } = Select;

const EditContacts = () => {
  const [newContactList, setNewContactList] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [updateContacts, setUpdateContacts] = useState([]);
  const [
    updateNumberAndNumber_InputContact,
    setUpdateNumberAndNumber_InputContact,
  ] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [wantUpdate, setWantUpdate] = useState("");
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [optionsToParse, setOptionsToParse] = useState([]);

  const { token, contact_list, contact_list_is_updating } = useSelector(
    (state) => state.userData
  );

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

  useEffect(() => {
    setIsButtonDisabled(!checkForModifications());
  }, [wantUpdate, selectedRecipients, newContactList]);

  const checkIfTheUpdateWasSuccessfull = () => {
    setTimeout(() => {
      if (contact_list_is_updating === true) {
        alert("contact list was not updated");
        dispatch({
          type: "set_contact_list_is_updating",
          payload: false,
        });
      }
    }, 5000);
  };

  const updateContactList = async () => {
    dispatch({
      type: "set_contact_list_is_updating",
      payload: true,
    });
    checkIfTheUpdateWasSuccessfull();
    let fullNewList = [...options];
    let found;
    const selectedUpdateContacts = [];
    for (let i of selectedRecipients) {
      selectedUpdateContacts.push(updateContacts[parseInt(i)]);
    }
    for (const e of selectedUpdateContacts) {
      //sprawdzic czy numer jest poprawny
      if (e.delete === true) {
        for (let i in fullNewList) {
          if (fullNewList[i].number === e.origin) {
            fullNewList.splice(i, 1);
            break;
          }
        }
      } else if (e.modified === true) {
        if (e.origin === e.number && e.name.length >= 2) {
          for (let i in fullNewList) {
            if (fullNewList[i].number === e.origin) {
              fullNewList[i].name = e.name;
              break;
            }
          }
        } else {
          //upewnij sie ze nie ma go uzytego w bazie i ewentualnie zmien
          found = false;
          for (let i in fullNewList) {
            if (fullNewList[i].number === e.number) {
              found = true;
              break;
            }
          }
          if (found === false) {
            //nowy number nie uzycty
            for (let i in fullNewList) {
              if (
                fullNewList[i].number === e.origin &&
                isValidPhoneNumber(e.number) &&
                e.name.length >= 2
              ) {
                fullNewList[i].number = e.number;
                fullNewList[i].name = e.name;
              }
            }
          }
        }
      }
    }
    for (const e of newContactList) {
      found = false;
      for (let i in fullNewList) {
        if (fullNewList[i].number === e.number) {
          found = true;
          break;
        }
      }
      if (
        found === false &&
        isValidPhoneNumber(e.number) &&
        e.name.length >= 2
      ) {
        fullNewList.push({ name: e.name, number: e.number });
      }
    }
    const filteredNewContactList = [];
    for (const e of fullNewList) {
      filteredNewContactList.push({
        name: e.name,
        number: e.number,
      });
    }
    dispatch(setContactList(filteredNewContactList, token));
    setSelectedRecipients([]);
    setUpdateContacts([]);
    setNewContactList([]);
    setUpdateNumberAndNumber_InputContact([]);
    const _options = [];
    for (let i in filteredNewContactList) {
      _options.push({
        value: i,
        label: `${filteredNewContactList[i].name} (${filteredNewContactList[i].number})`,
        name: filteredNewContactList[i].name,
        number: filteredNewContactList[i].number,
      });
    }
    setOptions(_options);
  };

  const checkForModifications = () => {
    let fullNewList = [...options];
    let found;
    const selectedUpdateContacts = [];
    for (let i of selectedRecipients) {
      selectedUpdateContacts.push(updateContacts[parseInt(i)]);
    }
    for (const e of selectedUpdateContacts) {
      //sprawdzic czy numer jest poprawny
      if (e.delete === true) {
        return true;
        for (let i in fullNewList) {
          if (fullNewList[i].number === e.origin) {
            fullNewList.splice(i, 1);
            break;
          }
        }
      } else if (e.modified === true) {
        if (e.origin === e.number) {
          for (let i in fullNewList) {
            if (fullNewList[i].number === e.origin && e.name.length >= 2) {
              return true;
            }
          }
        } else {
          //upewnij sie ze nie ma go uzytego w bazie i ewentualnie zmien
          found = false;
          for (let i in fullNewList) {
            if (fullNewList[i].number === e.number) {
              found = true;
              break;
            }
          }
          if (found === false) {
            //nowy number nie uzycty
            for (let i in fullNewList) {
              if (
                fullNewList[i].number === e.origin &&
                isValidPhoneNumber(e.number) &&
                e.name.length >= 2
              ) {
                return true;
              }
            }
          }
        }
      }
    }
    for (const e of newContactList) {
      found = false;
      for (let i in fullNewList) {
        if (fullNewList[i].number === e.number) {
          found = true;
          break;
        }
      }
      if (
        found === false &&
        isValidPhoneNumber(e.number) &&
        e.name.length >= 2
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className={"center fullW"}>
      {!contact_list_is_updating ? (
        <>
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
                // options={options}
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
                    id={id}
                    key={id}
                    options={options}
                    newContactList={newContactList}
                    selectedRecipients={selectedRecipients}
                    updateContacts={updateContacts}
                    setUpdateContacts={setUpdateContacts}
                    setWantUpdate={setWantUpdate}
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
                  setUpdateNumberAndNumber_InputContact={
                    setUpdateNumberAndNumber_InputContact
                  }
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
                updateNumberAndNumber_InputContact={
                  updateNumberAndNumber_InputContact
                }
              />
            </div>
            <div className={"center flex-wrapper"} style={{ marginBottom: 10 }}>
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
            <div>
              <b>
                <p className={"center"}>
                  Allowing much more expensive letters may significantly
                  increase the
                </p>
                <p className={"center"}>
                  cost of sending messages in the future.
                </p>
                <p className={"center"}>
                  If You will use those names inside the messages.
                </p>
              </b>
              <p className={"center mb"} style={{ marginTop: 10 }}>
                Please double-check the changes and click the button below
              </p>
            </div>
          </div>

          <button
            className={"button"}
            type={"button"}
            style={{ fontSize: "2rem" }}
            disabled={isButtonDisabled}
            onClick={() => updateContactList()}
          >
            Edit
          </button>
        </>
      ) : (
        <h1 className={"center"}>Contact list is updating...</h1>
      )}
    </div>
  );
};

export default EditContacts;
