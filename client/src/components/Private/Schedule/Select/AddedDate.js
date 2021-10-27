import { DatePicker, Space } from "antd";

const AddedDate = ({ dateValue, selectedYear, setSelectedYear }) => {
  const deleteDate = () => {
    setSelectedYear(selectedYear.filter((e) => e !== dateValue));
  };

  return (
    <div className={"flex-wrapper fullW"} style={{ marginTop: "10px" }}>
      <div
        className={"add_delete_icon"}
        style={{ cursor: "pointer", marginRight: 9, minWidth: 30 }}
        onClick={() => deleteDate()}
      >
        <i className="fas fa-trash  vertical-center"></i>
      </div>
      <DatePicker
        disabled
        value={dateValue}
        size={"large"}
        style={{ width: "100%" }}
        format={"MMMM Do"}
      />
    </div>
  );
};

export default AddedDate;
