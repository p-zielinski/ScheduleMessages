import Single from "./Single";
import Recurring from "./Recurring";
import { useState } from "react";
import { DatePicker, Radio, Space } from "antd";
import { nanoid } from "nanoid";

const Schedule = () => {
  const [type, setType] = useState(undefined);

  return (
    <div className={"schedule-form"}>
      <div className={"center"} style={{ width: "800", minWidth: 800 }}>
        <div className={"mb"}>
          <Radio.Group onChange={(e) => setType(e.target.value)} size={"large"}>
            <Radio.Button style={{ width: 400 }} value="single">
              Single time message
            </Radio.Button>
            <Radio.Button style={{ width: 400 }} value="recurring">
              Recurring message
            </Radio.Button>
          </Radio.Group>
        </div>
        {type === "single" && <Single />}
        {type === "recurring" && <Recurring />}
      </div>
    </div>
  );
};

export default Schedule;
