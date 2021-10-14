import parse from "html-react-parser";
import EveryWeek from "./Select/EveryWeek";
import EveryYear from "./Select/EveryYear";
import { Checkbox, DatePicker, Radio, Select, TimePicker } from "antd";
import { useState } from "react";
import Timezone from "./Timezone";
import EveryMonth from "./Select/EveryMonth";
import Recipients from "./Recipients";
import TextBody from "./TextBody";
import ScheduleButton from "./ScheduleButton";
const { RangePicker } = DatePicker;

const Recurring = () => {
  const [pickerType, setPickerType] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState([]);
  const [reverseMonth, setReverseMonth] = useState(false);
  const [selectedYear, setSelectedYear] = useState([]);

  const [country, setCountry] = useState(undefined);
  const [timezone, setTimezone] = useState(undefined);
  const [date, setDate] = useState("1");

  return (
    <div>
      <div className={"center mb"}>
        <div className={"center"} style={{ "margin-bottom": "0px" }}>
          <h2>deliver every:</h2>
        </div>
        <Radio.Group
          style={{ width: "800px" }}
          size={"large"}
          onChange={(e) => {
            setPickerType(e.target.value);
          }}
        >
          <Radio.Button value="day" style={{ width: "200px" }}>
            day
          </Radio.Button>
          <Radio.Button value="week" style={{ width: "200px" }}>
            week
          </Radio.Button>
          <Radio.Button value="month" style={{ width: "200px" }}>
            month
          </Radio.Button>
          <Radio.Button value="year" style={{ width: "200px" }}>
            year
          </Radio.Button>
        </Radio.Group>
      </div>
      {pickerType === "week" && (
        <EveryWeek
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
      )}

      {pickerType === "month" && (
        <EveryMonth
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          reverseMonth={reverseMonth}
          setReverseMonth={setReverseMonth}
        />
      )}
      {pickerType === "year" && (
        <EveryYear
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      )}
      <>
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
        <div className={"mb"}>
          <Timezone
            country={country}
            setCountry={setCountry}
            timezone={timezone}
            setTimezone={setTimezone}
          />
          {date && timezone && (
            <div
              className={"center"}
              style={{ "margin-top": "7px", "margin-bottom": "2px" }}
            >
              <Checkbox>Set this timezone as a default</Checkbox>
            </div>
          )}
        </div>
        <div className={"center"}>
          <div className={"center"}>
            <h2>time range:</h2>
          </div>
          <RangePicker
            showToday={true}
            size={"large"}
            style={{
              width: "800px",
            }}
          />
          <div style={{ marginTop: 5 }} className={"mb"}>
            <p className={"center"} style={{ fontSize: ".92rem" }}>
              Both dates included
            </p>
          </div>
        </div>
      </>
      <div className={"center mb"} style={{ width: 800 }}>
        <Recipients />
      </div>
      <TextBody />
      <ScheduleButton />
    </div>
  );
};

export default Recurring;
