import { useEffect, useState } from "react";
import parse from "html-react-parser";
import moment from "moment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateMessagesData } from "../../../store/actions/userDataActions";

const CancelJobReq = async (token, uniqJobId) => {
  return await axios({
    method: "post",
    url: "/api/cancel_job",
    timeout: 1000 * 5, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: { token: token, uniqJobId: uniqJobId },
  })
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

const ViewMessageSummary = ({ message, setMargin, noContent }) => {
  const [recipients, setRecipients] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("none");
  const [weekDays, setWeekDays] = useState("");
  const [monthDays, setMonthDays] = useState("");
  const [yearDays, setYearDays] = useState("");
  const [showCancelBar, setShowCancelBar] = useState(false);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.userData);

  const cancelThisJob = async () => {
    const returningData = await CancelJobReq(token, message.uniqJobId);
    if (typeof returningData.messages === "object") {
      setShowCancelBar(false);
      dispatch(updateMessagesData(returningData.messages.reverse()));
      setBackgroundColor("rgba(255,0,0,0.1)");
    }
  };

  useEffect(() => {
    const recipients = [];
    for (const x of message.data.recipients) {
      recipients.push(`${x.name} (${x.number})`);
    }
    setRecipients(recipients);

    if (message.status === "active") {
      setBackgroundColor("rgb(245,255,244)");
    } else if (message.status === "completed") {
      setBackgroundColor("rgb(246,246,246)");
    } else if (message.status === "canceled") {
      setBackgroundColor("rgb(255,234,234)");
    }

    const weekDays = [];
    for (const e of message.data.weekDays) {
      switch (e) {
        case "1":
          weekDays.push("Monday");
          break;
        case "2":
          weekDays.push("Tuesday");
          break;
        case "3":
          weekDays.push("Wednesday");
          break;
        case "4":
          weekDays.push("Thursday");
          break;
        case "5":
          weekDays.push("Friday");
          break;
        case "6":
          weekDays.push("Saturday");
          break;
        case "7":
          weekDays.push("Sunday");
          break;
        default:
          break;
      }
    }

    setWeekDays(
      weekDays
        .join(", ")
        .split("")
        .reverse()
        .join("")
        .replace(",", "dna ")
        .split("")
        .reverse()
        .join("")
    );

    setMonthDays(
      message.data.monthDays
        .map((e) => getStNdTh(e))
        .join(", ")
        .split("")
        .reverse()
        .join("")
        .replace(",", "dna ")
        .split("")
        .reverse()
        .join("")
    );

    const yearDays = [];
    for (const date of message.data.yearDays) {
      yearDays.push(
        moment(date, "MM-DD").format("MMMM Do").replace(/\ /g, "&nbsp;")
      );
    }
    setYearDays(
      yearDays
        .join(", ")
        .split("")
        .reverse()
        .join("")
        .replace(",", "dna ")
        .split("")
        .reverse()
        .join("")
    );
  }, []);

  const getStNdTh = (number) => {
    if (number > 3 && number < 21) {
      return `${number}th`;
    } else {
      switch (number % 10) {
        case 1:
          return `${number}st`;
          break;
        case 2:
          return `${number}nd`;
          break;
        case 3:
          return `${number}rd`;
          break;
        default:
          return `${number}th`;
      }
    }
  };

  return (
    <div
      className={"show-one-message"}
      style={{
        width: "100%",
        height: "auto",
        padding: 5,
        marginTop: typeof setMargin !== "number" ? 10 : setMargin,
        background: backgroundColor,
      }}
    >
      {showCancelBar && (
        <div className={"cancel-div-wrapper"}>
          <div className={"vertical-center center"}>
            <div className={"inside-test"}>
              <p style={{ marginBottom: 5, textAlign: "center" }}>
                Do you want to cancel this scheduled message?
              </p>
              <div className={"center"}>
                <div className={"flex-wrapper"}>
                  <div
                    onClick={() => cancelThisJob()}
                    className={"inside-test-button yes-inside-test-button"}
                    style={{ marginRight: 30 }}
                  >
                    YES
                  </div>
                  <div
                    onClick={() => setShowCancelBar(false)}
                    className={"inside-test-button no-inside-test-button"}
                  >
                    NO
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <p style={{ textAlign: "center", marginTop: 10 }}>
        <b className={"center"} style={{ textAlign: "center", fontSize: 18 }}>
          {message.data.isSingleTime === "single"
            ? "Single time message to:"
            : "Recurring message to:"}
        </b>
      </p>
      <p style={{ marginTop: 2, textAlign: "center", fontSize: 16 }}>
        {parse(recipients.join("<br />"))}
      </p>
      <p className={"center"} style={{ marginTop: 10 }}>
        <b>Deliver:</b>
      </p>
      {message.data.deliverEvery === "day" && (
        <p className={"center"} style={{ textAlign: "center" }}>
          Every <b>{message.data.deliverEvery}</b> from{" "}
          <b style={{ whiteSpace: "nowrap" }}>
            {message.data.timeRange.join(" to ")}
          </b>
        </p>
      )}
      {message.data.deliverEvery === "week" && (
        <p className={"center"} style={{ textAlign: "center" }}>
          Every <b>{message.data.deliverEvery}</b> on <br />
          <b>{weekDays}</b>
          <br />
          from{" "}
          <b style={{ whiteSpace: "nowrap" }}>
            {message.data.timeRange.join(" to ")}
          </b>
        </p>
      )}
      {message.data.deliverEvery === "month" && (
        <p className={"center"} style={{ textAlign: "center" }}>
          Every <b>{message.data.deliverEvery}</b> on <br />
          <b>{monthDays}</b> day of a month
          <b>{message.data.reverseMonth === true ? " from the end" : ""}</b>
          <br />
          from{" "}
          <b style={{ whiteSpace: "nowrap" }}>
            {message.data.timeRange.join(" to ")}
          </b>
        </p>
      )}
      {message.data.deliverEvery === "year" && (
        <p className={"center"} style={{ textAlign: "center" }}>
          Every <b>{message.data.deliverEvery}</b> on
          <br />
          {parse(yearDays)}
          <b>{weekDays}</b>
          <br />
          from{" "}
          <b style={{ whiteSpace: "nowrap" }}>
            {message.data.timeRange.join(" to ")}
          </b>
        </p>
      )}
      <p className={"center"} style={{ textAlign: "center" }}>
        <b>{message.data.date}</b> at {message.data.at.join(":")}
      </p>
      <p className={"center"} style={{ textAlign: "center", marginTop: 10 }}>
        <b>Timezone:</b> <br />
        {message.data.timezone.replace(/_/g, " ").replace(/\//g, " - ")}
      </p>
      <div className={"center"}>
        <div className={"flex-wrapper"}>
          <p
            style={{
              width: "auto",
              height: "auto",
              padding: 10,
              marginTop: 5,
              textAlign: "center",
            }}
          >
            <b>status:</b>
            <br />
            {message.status}{" "}
          </p>
          {message.status === "active" && (
            <div
              className={"delete_contact cancel_job"}
              onClick={() => setShowCancelBar(true)}
            >
              <p className={"vertical-center"}>CANCEL</p>
            </div>
          )}
        </div>
      </div>
      {noContent !== true && (
        <p
          className={"center"}
          style={{ textAlign: "center", marginTop: 5, marginBottom: 10 }}
        >
          <b>Content:</b>
          <br />
          {message.data.messageBody}
        </p>
      )}
    </div>
  );
};

export default ViewMessageSummary;
