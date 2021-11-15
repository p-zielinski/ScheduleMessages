import { Slider, InputNumber } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

const AddFunds = () => {
  const { email } = useSelector((state) => state.userData);
  const [value, setValue] = useState(10);
  return (
    <div>
      <h2 className={"center"} style={{ marginBottom: 10 }}>
        Add funds to you account:
      </h2>
      <p className={"center"} style={{ marginBottom: 5 }}>
        Choose how much funds you want to add to your <u>{email}</u> account:
      </p>
      <div className={"flex-wrapper"}>
        <InputNumber
          min={5}
          max={20}
          style={{ width: 130, marginRight: 20 }}
          addonAfter={"USD"}
          formatter={() => value + " USD"}
          value={value}
          onChange={setValue}
          size={"large"}
        />
        <Slider
          min={5}
          max={20}
          style={{ width: "100%", marginTop: 13, marginRight: 10 }}
          onChange={setValue}
          value={value}
          step={0.01}
        />
      </div>
    </div>
  );
};

export default AddFunds;
