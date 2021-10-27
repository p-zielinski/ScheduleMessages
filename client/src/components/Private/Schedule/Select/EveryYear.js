import { Space, DatePicker } from "antd";
import { useEffect, useState } from "react";
import AddedDate from "./AddedDate";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { setYearDays } from "../../../../store/actions/scheduleDataActions";

const EveryYear = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedYear, setSelectedYear] = useState([]);
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(setYearDays(selectedYear));
  }, [selectedYear]);

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
      <div className={"fullW"}>
        <div className={"flex-wrapper"}>
          <div
            className={"add_delete_icon"}
            style={{ cursor: "pointer", marginRight: 9, minWidth: 30 }}
            onClick={() => addDate()}
          >
            <i className="fas fa-plus vertical-center"></i>
          </div>
          <DatePicker
            disabledDate={disabledDate}
            value={selectedDate}
            onChange={setSelectedDate}
            size={"large"}
            style={{ width: "100%" }}
            format={"MMMM Do"}
          />
        </div>
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
