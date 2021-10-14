import { Select } from "antd";
import parse from "html-react-parser";
import { useEffect } from "react";

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

const EveryMonth = ({
  selectedMonth,
  setSelectedMonth,
  setReverseMonth,
  reverseMonth,
}) => {
  const daysSelect = (e) => {
    let temp = [];
    for (let x of daysOfMonth) {
      for (let y of e) {
        if (y === x) {
          temp.push(x);
          break;
        }
      }
    }
    setSelectedMonth(temp);
  };

  return (
    <div className={"mb"}>
      <div className={"center"}>
        <h2>on:</h2>
      </div>
      <div className={"center"} style={{ width: "800px" }}>
        <Select
          className={"fullW"}
          onChange={(e) => daysSelect(e)}
          value={selectedMonth}
          style={{ marginBottom: "15px" }}
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
          {daysOfMonth.map((e) =>
            parse(`<Select.Option value=${e}>${e}</Select.Option>`)
          )}
        </Select>
        <div className={"center"}>
          <div className={"flex-wrapper"} style={{ marginTop: -10 }}>
            <div
              className={"add_delete_icon"}
              onClick={() => setReverseMonth(!reverseMonth)}
            >
              <i className="fas fa-exchange-alt vertical-center"></i>
            </div>
            <div style={{ marginTop: 6, marginLeft: "20px" }}>
              <h2>
                day{selectedMonth.length > 1 && "s"} of a month{" "}
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
