import { Radio, Space } from "antd";
import { useEffect, useState } from "react";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import ChangeUsername from "./ChangeUsername";
import EditContacts from "./EditContacts";

const Settings = () => {
  const [formType, setFormType] = useState(undefined);

  return (
    <div>
      <div className={"fullW center"}>
        <Radio.Group
          size={"large"}
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
        >
          <Radio.Button
            style={{
              width: "100%",
            }}
            value="email"
          >
            Change your email
          </Radio.Button>
          <Radio.Button
            value="password"
            style={{
              width: "100%",
            }}
          >
            Change your password
          </Radio.Button>
          <Radio.Button
            style={{
              width: "100%",
            }}
            value="username"
          >
            Enter, delete or change your name
          </Radio.Button>
          <Radio.Button
            style={{
              width: "100%",
            }}
            value="contacts"
          >
            Edit your contact list
          </Radio.Button>
          <Radio.Button
            style={{
              width: "100%",
            }}
            value="timezone"
          >
            Change your default timezone
          </Radio.Button>
        </Radio.Group>
      </div>
      {formType !== undefined && <div style={{ height: 20 }}></div>}
      {formType === "email" && <ChangeEmail />}
      {formType === "password" && <ChangePassword />}
      {formType === "username" && <ChangeUsername />}
      {formType === "contacts" && <EditContacts />}
    </div>
  );
};

export default Settings;
