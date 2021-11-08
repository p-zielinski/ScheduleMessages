import moment from "moment-timezone";
import iso3311a2 from "iso-3166-1-alpha-2";
import parse from "html-react-parser";
import { DatePicker, Select, Checkbox, TimePicker } from "antd";
import { useRef, useState } from "react";
import Recipients from "./Recipients";
import TextBody from "./TextBody";
import Timezone from "./Timezone";
import { useDispatch, useSelector } from "react-redux";
import { setDate, setAt } from "../../../store/actions/scheduleDataActions";

const Single = ({ disabledDate, scheduleNow }) => {
  const { date, at, timezone, recipients } = useSelector(
    (state) => state.scheduleData
  );
  const dispatch = useDispatch();
  const EndOfViewRef = useRef(null);

  const scrollToBottom = () => {
    EndOfViewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setDateHandler = async (date) => {
    await dispatch(setDate(date));
    setTimeout(function () {
      scrollToBottom();
    }, 200);
  };

  const setAtHandler = async (time) => {
    await dispatch(setAt(time));
    setTimeout(function () {
      scrollToBottom();
    }, 200);
  };

  return (
    <div className={"fullW"}>
      <div className={"fullW"}>
        <div className={"center"} style={{ marginTop: 20 }}>
          <h2>deliver on:</h2>
        </div>
        <DatePicker
          style={{
            width: "100%",
          }}
          value={date}
          format="YYYY-MMMM-DD"
          size={"large"}
          disabledDate={disabledDate}
          showToday={false}
          showNow={false}
          placeholder="select date"
          onSelect={(e) => setDateHandler(e)}
        />
      </div>
      {date && (
        <>
          <div className={"center"} style={{ marginTop: 20 }}>
            <h2>at:</h2>
          </div>
          <TimePicker
            showNow={false}
            size={"large"}
            style={{
              width: "100%",
            }}
            value={at}
            format={"h:mm a"}
            onOk={(e) => setAtHandler(e)}
          />
          {at && (
            <>
              <Timezone />
              {timezone && (
                <>
                  <div
                    className={"center"}
                    style={{ width: "100%", marginTop: 20, marginBottom: -20 }}
                  >
                    <Recipients />
                  </div>
                  {recipients.length > 0 && (
                    <>
                      <TextBody scheduleNow={scheduleNow} />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      <div ref={EndOfViewRef} />
    </div>
  );
};

export default Single;
