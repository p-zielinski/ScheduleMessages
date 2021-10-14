import { Radio, Space } from "antd";
import { useState } from "react";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import ChangeUsername from "./ChangeUsername";
import EditContacts from "./EditContacts";

const Settings = () => {
  const [formType, setFormType] = useState(undefined);
  return (
    <div>
      <div className={"center mb"} style={{ width: "800", minWidth: 800 }}>
        <Radio.Group
          style={{ width: "800px" }}
          size={"large"}
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
        >
          <Radio.Button style={{ width: 800 }} value="email">
            Change your email
          </Radio.Button>
          <Radio.Button style={{ width: 800 }} value="password">
            Change your password
          </Radio.Button>
          <Radio.Button style={{ width: 800 }} value="username">
            Enter, delete or change your name
          </Radio.Button>
          <Radio.Button style={{ width: 800 }} value="contacts">
            Edit your contact list
          </Radio.Button>
          <Radio.Button style={{ width: 800 }} value="timezone">
            Change your default timezone
          </Radio.Button>
          <Radio.Button style={{ width: 800 }} value="bodyending">
            Change message ends texts
          </Radio.Button>
        </Radio.Group>
      </div>
      {formType === "email" && <ChangeEmail />}
      {formType === "password" && <ChangePassword />}
      {formType === "username" && <ChangeUsername />}
      {formType === "contacts" && <EditContacts />}
    </div>
  );
};

export default Settings;
