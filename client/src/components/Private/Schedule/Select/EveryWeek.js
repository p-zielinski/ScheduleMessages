import { Select } from "antd";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWeekDays } from "../../../../store/actions/scheduleDataActions";

const daysOfWeek = [
  { name: "Monday", index: 1 },
  { name: "Tuesday", index: 2 },
  { name: "Wensday", index: 3 },
  { name: "Thursday", index: 4 },
  { name: "Friday", index: 5 },
  { name: "Saturday", index: 6 },
  {
    name: "Sunday",
    index: 7,
  },
];

const EveryWeek = () => {
  const [weekDaysOptions, setWeekDaysOptions] = useState([]);
  const dispatch = useDispatch();
  const { weekDays } = useSelector((state) => state.scheduleData);

  useEffect(() => {
    const _daysOfWeek = [];
    for (let e of daysOfWeek) {
      _daysOfWeek.push(
        `<Select.Option value=${e.index}>${e.name}</Select.Option>`
      );
    }
    setWeekDaysOptions(_daysOfWeek);
  }, []);

  const setWeekDaysHandler = (selected) => {
    dispatch(setWeekDays(selected));
  };

  return (
    <div className={"fullW"} style={{ marginTop: 20 }}>
      <div className={"center"}>
        <h2>on:</h2>
      </div>
      <div className={"fullW  center"}>
        <Select
          className={"fullW"}
          style={{ marginBottom: "15px", width: "100%" }}
          size={"large"}
          mode="multiple"
          value={weekDays}
          onChange={(e) => setWeekDaysHandler(e)}
          placeholder="Select day or days"
          filterOption={(input, option) =>
            option.label
              .toLowerCase()
              .replace(/ /g, "")
              .indexOf(input.toLowerCase().replace(/ /g, "")) >= 0
          }
        >
          {parse(weekDaysOptions.join(""))}
        </Select>
      </div>
    </div>
  );
};

export default EveryWeek;
