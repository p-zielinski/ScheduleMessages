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
  const { date, at, timezone, recipients, messageBody, messageEnds } =
    useSelector((state) => state.scheduleData);
  const dispatch = useDispatch();

  const setDateHandler = async (date) => {
    dispatch(setDate(date));
  };

  const setAtHandler = async (time) => {
    dispatch(setAt(time));
  };

  return (
    <div className={"fullW"}>
      {/*<div*/}
      {/*  className={"fullW"}*/}
      {/*  style={{*/}
      {/*    height: "100%",*/}
      {/*    position: "absolute",*/}
      {/*    background: "rgba(40,82,222,0.79)",*/}
      {/*    left: 0,*/}
      {/*    zIndex: 1,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  a*/}
      {/*</div>*/}
      <div className={"fullW mb"}>
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
          <div className={"center"}>
            <h2>at:</h2>
          </div>
          <TimePicker
            showNow={false}
            size={"large"}
            style={{
              marginBottom: 30,
              width: "100%",
            }}
            value={at}
            format={"HH:mm"}
            onOk={(e) => setAtHandler(e)}
          />
          {at && (
            <>
              <Timezone />
              {timezone && (
                <div className={"center"} style={{ width: "100%" }}>
                  <Recipients />
                </div>
              )}
              {timezone && recipients.length > 0 && <TextBody />}
              {timezone &&
                recipients.length > 0 &&
                messageBody !== "" &&
                messageEnds !== "" && (
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
    </div>
  );
};

export default Single;
