import EveryWeek from "./Select/EveryWeek";
import EveryYear from "./Select/EveryYear";
import { DatePicker, Radio, Select, TimePicker } from "antd";
import Timezone from "./Timezone";
import EveryMonth from "./Select/EveryMonth";
import Recipients from "./Recipients";
import TextBody from "./TextBody";
import { useDispatch, useSelector } from "react-redux";
import {
  setTimeRange,
  setDeliverEvery,
  setAt,
} from "../../../store/actions/scheduleDataActions";
const { RangePicker } = DatePicker;

const Recurring = ({ disabledDate, scheduleNow }) => {
  const {
    deliverEvery,
    at,
    weekDays,
    monthDays,
    yearDays,
    timezone,
    timeRange,
    recipients,
    messageBody,
    messageEnds,
  } = useSelector((state) => state.scheduleData);
  const dispatch = useDispatch();

  const setDeliverEveryHandler = (value) => {
    dispatch(setDeliverEvery(value));
  };

  const setTimeRangeHandler = (timerange) => {
    dispatch(setTimeRange(timerange));
  };

  const setAtHandler = async (time) => {
    dispatch(setAt(time));
  };

  return (
    <div>
      <div className={"fullW center mb"}>
        <div className={"center"} style={{ marginBottom: 0, marginTop: 20 }}>
          <h2>deliver every:</h2>
        </div>
        <div className={"fullW"}>
          <Radio.Group
            style={{ width: "100%" }}
            size={"large"}
            onChange={(e) => {
              setDeliverEveryHandler(e.target.value);
            }}
          >
            <Radio.Button value="day" style={{ width: "25%" }}>
              <p className={"vertical-center center"}>day</p>
            </Radio.Button>
            <Radio.Button value="week" style={{ width: "25%" }}>
              <p className={"vertical-center center"}>week</p>
            </Radio.Button>
            <Radio.Button value="month" style={{ width: "25%" }}>
              <p className={"vertical-center center"}>month</p>
            </Radio.Button>
            <Radio.Button value="year" style={{ width: "25%" }}>
              <p className={"vertical-center center"}>year</p>
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
      {deliverEvery === "week" && <EveryWeek />}
      {deliverEvery === "month" && <EveryMonth />}
      {deliverEvery === "year" && <EveryYear />}
      {((deliverEvery === "year" && yearDays.length > 0) ||
        (deliverEvery === "month" && monthDays.length > 0) ||
        (deliverEvery === "week" && weekDays.length > 0) ||
        deliverEvery === "day") && (
        <>
          <div className={"mb"}>
            <div className={"center"}>
              <h2>at:</h2>
            </div>
            <TimePicker
              showNow={false}
              size={"large"}
              style={{
                width: "100%",
                display: "table",
                margin: "0 auto",
              }}
              value={at}
              format={"HH:mm"}
              onOk={(e) => setAtHandler(e)}
            />
          </div>
          {at !== null && (
            <>
              <div className={"mb"}>
                <Timezone />
              </div>
              {timezone !== null && (
                <>
                  <div className={"center fullW"}>
                    <div className={"center"}>
                      <h2>time range:</h2>
                    </div>
                    <RangePicker
                      disabledDate={disabledDate}
                      showToday={true}
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      onChange={(e) => {
                        setTimeRangeHandler(e);
                      }}
                    />
                    <div style={{ marginTop: 5 }} className={"mb"}>
                      <p className={"center"} style={{ fontSize: ".92rem" }}>
                        Both dates included
                      </p>
                    </div>
                  </div>
                  {timeRange.length === 2 && (
                    <>
                      <div className={"center mb fullW"}>
                        <Recipients />
                      </div>
                      {recipients.length > 0 && (
                        <>
                          <TextBody />
                          {messageBody !== "" && messageEnds !== "" && (
                            <button
                              onClick={() => scheduleNow()}
                              className={"button"}
                              style={{ fontSize: "2rem" }}
                            >
                              Schedule now
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Recurring;
