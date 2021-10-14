import { Select } from "antd";
import parse from "html-react-parser";

const daysOfWeek = [
  {
    name: "Sunday",
    index: 0,
  },
  { name: "Monday", index: 1 },
  { name: "Tuesday", index: 2 },
  { name: "Wensday", index: 3 },
  { name: "Thursday", index: 4 },
  { name: "Friday", index: 5 },
  { name: "Saturday", index: 6 },
];

//sorting if another language

let weekDaysOptions = [];
for (let x of daysOfWeek) {
  weekDaysOptions.push(x);
}

const EveryWeek = ({ selectedWeek, setSelectedWeek }) => {
  const daysSelect = (e) => {
    let temp = [];
    for (let x of daysOfWeek) {
      for (let y of e) {
        if (y === x.name) {
          temp.push(y);
          break;
        }
      }
    }
    setSelectedWeek(temp);
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
          value={selectedWeek}
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
          {weekDaysOptions.map((e) =>
            parse(`<Select.Option value=${e.name}>${e.name}</Select.Option>`)
          )}
        </Select>
      </div>
    </div>
  );
};

export default EveryWeek;
