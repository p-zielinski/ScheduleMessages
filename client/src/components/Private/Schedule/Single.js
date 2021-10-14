import moment from "moment-timezone";
import iso3311a2 from "iso-3166-1-alpha-2";
import parse from "html-react-parser";
import { DatePicker, Select, Checkbox, TimePicker } from "antd";
import { useState } from "react";
import Recipients from "./Recipients";
import TextBody from "./TextBody";
import ScheduleButton from "./ScheduleButton";
import Timezone from "./Timezone";

const Single = () => {
  const [country, setCountry] = useState("PL");
  const [timezone, setTimezone] = useState(undefined);
  const [date, setDate] = useState(undefined);

  function disabledDate(current) {
    return current <= moment().subtract(1, "day");
  }

  return (
    <>
      <div className={"fullW mb"}>
        <div className={"center"}>
          <h2>deliver on:</h2>
        </div>
        <DatePicker
          style={{
            width: "100%",
          }}
          format="YYYY-MM-DD HH:mm"
          size={"large"}
          disabledDate={disabledDate}
          showTime
          showToday={false}
          showNow={false}
          placeholder="select date"
          onOk={(e) => setDate(e.format("YYYY-MM-DD HH:mm"))}
        />
      </div>
      <div className={"mb"}>
        <div className={"center"}>
          <h2>at:</h2>
        </div>
        <TimePicker
          showNow={false}
          size={"large"}
          style={{
            width: "800px",
          }}
          format={"HH:mm"}
        />
      </div>
      {date && (
        <Timezone
          country={country}
          setCountry={setCountry}
          timezone={timezone}
          setTimezone={setTimezone}
        />
      )}
      {date && timezone && (
        <div
          className={"center"}
          style={{ "margin-top": "7px", "margin-bottom": "24px" }}
        >
          <Checkbox>Set this timezone as a default</Checkbox>
        </div>
      )}
      <div className={"center mb"} style={{ width: 800 }}>
        <Recipients />
      </div>
      <TextBody />
      <ScheduleButton />
    </>
  );
};

export default Single;
