import Single from "./Single";
import Recurring from "./Recurring";
import { useEffect, useState } from "react";
import { DatePicker, Radio, Space } from "antd";
import { nanoid } from "nanoid";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { setIsSingleTime } from "../../../store/actions/scheduleDataActions";
import axios from "axios";
import { updateMessagesData } from "../../../store/actions/userDataActions";

const ScheduleReq = async (token, data) => {
  return await axios({
    method: "post",
    url: "/api/new_message",
    timeout: 1000 * 5, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: { token: token, data: data },
  })
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

const Schedule = () => {
  const {
    isSingleTime,
    date,
    deliverEvery,
    weekDays,
    monthDays,
    reverseMonth,
    yearDays,
    timeRange,
    at,
    country,
    timezone,
    saveTimezoneAsDefault,
    recipients,
    contactsToSave,
    messageBody,
    messageEnds,
    allowExpensiveCharacters,
  } = useSelector((state) => state.scheduleData);
  const { token } = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const setType = (value) => {
    dispatch(setIsSingleTime(value));
  };

  function disabledDate(current) {
    return current <= moment().subtract(1, "day");
  }

  const scheduleNow = async () => {
    let data = {
      isSingleTime: isSingleTime,
      deliverEvery: deliverEvery,
      weekDays: weekDays,
      monthDays: monthDays,
      reverseMonth: reverseMonth,
      country: country,
      timezone: timezone,
      saveTimezoneAsDefault: saveTimezoneAsDefault,
      recipients: recipients,
      contactsToSave: contactsToSave,
      messageBody: messageBody,
      messageEnds: messageEnds,
      allowExpensiveCharacters: allowExpensiveCharacters,
    };
    try {
      data.date = date.format("YYYY-MM-DD");
    } catch (e) {}
    try {
      data.yearDays = yearDays.map((e) => e.format("MM-DD"));
    } catch (e) {}
    try {
      data.timeRange = timeRange.map((e) => e.format("YYYY-MM-DD"));
    } catch (e) {}
    try {
      data.at = at.format("HH:mm").split(":");
    } catch (e) {}

    const returningData = await ScheduleReq(token, data);
    if (typeof returningData.messages === "object") {
      dispatch(updateMessagesData(returningData.messages.reverse()));
    }
  };

  const [leftCellClassName, setLeftCellClassName] = useState(
    isSingleTime
      ? isSingleTime === "single"
        ? "add_icon_selected left-cell-add_icon"
        : "add_icon left-cell-add_icon"
      : "add_icon left-cell-add_icon"
  );
  const [rightCellClassName, setRightCellClassName] = useState(
    isSingleTime
      ? isSingleTime === "recurring"
        ? "add_icon_selected right-cell-add_icon"
        : "add_icon right-cell-add_icon"
      : "add_icon right-cell-add_icon"
  );

  const selectTypeHandler = (e) => {
    if (e === "single") {
      setLeftCellClassName("add_icon_selected left-cell-add_icon");
      setRightCellClassName("add_icon right-cell-add_icon");
    } else if (e === "recurring") {
      setLeftCellClassName("add_icon left-cell-add_icon");
      setRightCellClassName("add_icon_selected right-cell-add_icon");
    }
  };

  return (
    <div className={"schedule-form"}>
      <div className={"fullW flex-wrapper-max-400px"}>
        <div
          className={leftCellClassName}
          onClick={() => {
            setType("single");
            selectTypeHandler("single");
          }}
        >
          <p className={"center vertical-center"}>Single time message</p>
        </div>
        <div
          className={rightCellClassName}
          onClick={() => {
            setType("recurring");
            selectTypeHandler("recurring");
          }}
        >
          <p className={"center vertical-center"}>Recurring message</p>
        </div>
      </div>
      <div className={"center fullW"}>
        {isSingleTime === "single" && (
          <Single disabledDate={disabledDate} scheduleNow={scheduleNow} />
        )}
        {isSingleTime === "recurring" && (
          <Recurring disabledDate={disabledDate} scheduleNow={scheduleNow} />
        )}
      </div>
    </div>
  );
};

export default Schedule;
