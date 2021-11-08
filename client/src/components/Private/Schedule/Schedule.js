import Single from "./Single";
import Recurring from "./Recurring";
import { useState } from "react";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { setIsSingleTime } from "../../../store/actions/scheduleDataActions";
import axios from "axios";
import {
  updateMessagesData,
  clearScheduleData,
} from "../../../store/actions/userDataActions";
import Loading from "../../utils/Loading";
import ViewMessageSummary from "../Dashboard/ViewMessageSummary";

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
  const { token, messages, name } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [formIsSending, setFormIsSending] = useState(false);
  const [messageFailedToBeScheduled, setMessageFailedToBeScheduled] =
    useState(false);
  const [messageWasScheduledSuccessfully, setMessageWasScheduledSuccessfully] =
    useState(false);

  const setType = (value) => {
    dispatch(setIsSingleTime(value));
  };

  function disabledDate(current) {
    return current <= moment().subtract(1, "day");
  }

  const scheduleNow = async () => {
    setFormIsSending(true);
    let checkFunctions = false;
    for (const l of messageBody) {
      if (l === "{" || l === "}" || l === "<" || l === ">") {
        checkFunctions = true;
        break;
      }
    }
    //trzeba teraz zrobic funcje....
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

    let returningData = await ScheduleReq(token, data);
    if (typeof returningData.messages === "object") {
      dispatch(updateMessagesData(returningData.messages.reverse()));
      setMessageWasScheduledSuccessfully(true);
    } else if (typeof returningData.error === "string") {
      setMessageFailedToBeScheduled(true);
    }
  };

  const closeMessageFailedToBeScheduledBar = () => {
    setFormIsSending(false);
    setMessageFailedToBeScheduled(false);
  };

  const closeMessageWasScheduledSuccessfully = () => {
    setFormIsSending(false);
    setMessageWasScheduledSuccessfully(false);
    dispatch(clearScheduleData());
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
      <div className={"checking-form"} hidden={!formIsSending}>
        <div className={"loading-icon"}>
          <div className={"vertical-center center"}>
            {messageFailedToBeScheduled ? (
              <div
                className={"inside-test"}
                style={{ paddingTop: 20, textAlign: "center" }}
              >
                <i
                  className={"fas fa-times"}
                  style={{ fontSize: "1.8rem" }}
                  onClick={() => closeMessageFailedToBeScheduledBar()}
                ></i>
                This message cannot be scheduled.
                <br />
                Probably because you have chosen a past date.
                <br />
                Please try again.
              </div>
            ) : messageWasScheduledSuccessfully ? (
              <div className={"just-scheduled-message"}>
                <i
                  className={"fas fa-times greenColorHover"}
                  style={{ fontSize: "1.8rem" }}
                  onClick={() => closeMessageWasScheduledSuccessfully()}
                ></i>
                <p className={"center"} style={{ fontSize: "2rem" }}>
                  Success!
                </p>
                {messages.map((message, index) => {
                  if (index === 0)
                    return (
                      <ViewMessageSummary
                        key={message.uniqJobId}
                        message={message}
                      />
                    );
                  else return "";
                })}
              </div>
            ) : (
              <Loading
                size={"1.5rem"}
                margin={"1rem"}
                background={"rgba(0,1,255,0.62)"}
                height={"-3rem"}
              />
            )}
          </div>
        </div>
      </div>
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
