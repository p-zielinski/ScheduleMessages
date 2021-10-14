import { DatePicker, Space } from "antd";

const AddedDate = ({ dateValue, selectedYear, setSelectedYear }) => {
  const deleteDate = () => {
    setSelectedYear(selectedYear.filter((e) => e !== dateValue));
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Space direction={"horizontal"}>
        <div>
          <Space direction={"horizontal"}>
            <div
              className={"add_delete_icon"}
              style={{ cursor: "pointer" }}
              onClick={() => deleteDate()}
            >
              <i className="fas fa-trash  vertical-center"></i>
            </div>
            <DatePicker
              disabled
              value={dateValue}
              size={"large"}
              style={{ width: 760 }}
              format={"MMMM Do"}
            />
          </Space>
        </div>
      </Space>
    </div>
  );
};

export default AddedDate;
