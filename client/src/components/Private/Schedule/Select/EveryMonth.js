import { Select } from "antd";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMonthDays,
  setReverseMonth,
} from "../../../../store/actions/scheduleDataActions";

const daysOfMonth = [];
for (let i = 1; i <= 31; i++) {
  if (i > 3 && i < 21) {
    daysOfMonth.push(`${i}th`);
  } else {
    switch (i % 10) {
      case 1:
        daysOfMonth.push(`${i}st`);
        break;
      case 2:
        daysOfMonth.push(`${i}nd`);
        break;
      case 3:
        daysOfMonth.push(`${i}rd`);
        break;
      default:
        daysOfMonth.push(`${i}th`);
    }
  }
}

const EveryMonth = () => {
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch();
  const { monthDays, reverseMonth } = useSelector(
    (state) => state.scheduleData
  );

  useEffect(() => {
    const temp = [];
    for (const i in daysOfMonth) {
      temp.push(
        `<Select.Option value=${parseInt(i) + 1}>${
          daysOfMonth[i]
        }</Select.Option>`
      );
    }
    setOptions(temp);
  }, []);

  const setMonthDaysHandler = (selected) => {
    dispatch(setMonthDays(selected));
  };

  const setReverseMonthHandler = () => {
    dispatch(setReverseMonth(!reverseMonth));
  };

  return (
    <div className={"fullW"} style={{ marginTop: 20 }}>
      <div className={"center"}>
        <h2>on:</h2>
      </div>
      <div className={"fullW center"}>
        <Select
          className={"fullW"}
          onChange={(e) => setMonthDaysHandler(e)}
          style={{ marginBottom: "15px" }}
          value={monthDays}
          size={"large"}
          mode="multiple"
          placeholder="Select day or days"
          filterOption={(input, option) =>
            option.label
              .toLowerCase()
              .replace(/ /g, "")
              .indexOf(input.toLowerCase().replace(/ /g, "")) >= 0
          }
        >
          {daysOfMonth.map((e) => parse(options.join("")))}
        </Select>
        <div className={"center"}>
          <div className={"flex-wrapper"} style={{ marginTop: -10 }}>
            <div
              className={"add_delete_icon"}
              onClick={() => setReverseMonthHandler(!reverseMonth)}
            >
              <i className="fas fa-exchange-alt vertical-center"></i>
            </div>
            <div style={{ marginTop: 6, marginLeft: "20px" }}>
              <h2 style={{ textAlign: "center" }}>
                day{monthDays.length > 1 && "s"} of a month{" "}
                {reverseMonth && parse("<b>from the end</b>")}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EveryMonth;
