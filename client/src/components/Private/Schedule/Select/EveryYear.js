import { Space, DatePicker } from "antd";
import { useState } from "react";
import AddedDate from "./AddedDate";
import moment from "moment-timezone";

const EveryYear = ({ selectedYear, setSelectedYear }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const addDate = () => {
    try {
      selectedDate.format("MMDD");
    } catch (e) {
      return 0;
    }
    if (selectedDate !== null) {
      setSelectedYear(
        [...selectedYear, selectedDate].sort(
          (a, b) => a.format("MMDD") - b.format("MMDD")
        )
      );
    }
    setSelectedDate(null);
  };

  function disabledDate(current) {
    let found = false;
    for (let x of selectedYear) {
      if (x.format("M-D") === current.format("M-D")) {
        found = true;
      }
    }
    return found;
  }

  return (
    <div
      className={"fullW"}
      style={{
        position: "related",
        marginBottom: "-15px",
        left: "0",
        right: "auto",
      }}
    >
      <div className={"center"}>
        <h2>on:</h2>
      </div>
      <div>
        <Space direction={"horizontal"}>
          <div>
            <Space direction={"horizontal"}>
              <div
                className={"add_delete_icon"}
                style={{ cursor: "pointer" }}
                onClick={() => addDate()}
              >
                <i className="fas fa-plus vertical-center"></i>
              </div>
              <DatePicker
                disabledDate={disabledDate}
                value={selectedDate}
                onChange={setSelectedDate}
                size={"large"}
                style={{ width: 760 }}
                format={"MMMM Do"}
              />
            </Space>
          </div>
        </Space>
      </div>
      {selectedYear.map((e) => (
        <AddedDate
          dateValue={e}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      ))}
      <div className={"mb"}></div>
    </div>
  );
};

export default EveryYear;
