import { useEffect, useState } from "react";
import parse from "html-react-parser";
import moment from "moment";

const ViewMessageSummary = ({ message }) => {
  const [recipients, setRecipients] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("none");
  const [weekDays, setWeekDays] = useState("");
  const [monthDays, setMonthDays] = useState("");
  const [yearDays, setYearDays] = useState("");

  useEffect(() => {
    const recipients = [];
    for (const x of message.data.recipients) {
      recipients.push(`${x.name} (${x.number})`);
    }
    setRecipients(recipients);

    if (message.status === "active") {
      setBackgroundColor("rgba(134, 255, 64, 0.1)");
    } else if (message.status === "completed") {
      setBackgroundColor("rgba(0, 0, 0, 0.03)");
    } else if (message.status === "canceled") {
      setBackgroundColor("rgba(255,0,0,0.1)");
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

  const cancelThisJob = () => {};

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
        marginTop: 10,
        background: backgroundColor,
      }}
    >
      <div className={"test1"}>
        <div className={"vertical-center center"}>
          <div className={"inside-test"}>
            Are You sure you want to cancel this scheduled message?
          </div>
        </div>
      </div>
      <h2 className={"center"} style={{ textAlign: "center" }}>
        {message.data.isSingleTime === "single"
          ? "Single time message"
          : "Recurring message"}
      </h2>
      <p
        className={"delete_contact"}
        style={{
          width: "auto",
          height: "auto",
          padding: 10,
          background: "rgba(0, 0, 0, .02)",
          borderColor: "rgba(0, 0, 0, .02)",
          marginTop: 5,
          fontSize: "1.15rem",
          lineHeight: 1.3,
          textAlign: "center",
        }}
      >
        {parse(recipients.join("<br />"))}
      </p>
      {message.data.deliverEvery === "day" && (
        <h3 className={"center"} style={{ textAlign: "center", marginTop: 8 }}>
          Every <b>{message.data.deliverEvery}</b> from{" "}
          <b style={{ whiteSpace: "nowrap" }}>
            {message.data.timeRange.join(" to ")}
          </b>
        </h3>
      )}
      {message.data.deliverEvery === "week" && (
        <h3 className={"center"} style={{ textAlign: "center", marginTop: 8 }}>
          Every <b>{message.data.deliverEvery}</b> on <br />
          <b>{weekDays}</b>
          <br />
          from{" "}
          <b style={{ whiteSpace: "nowrap" }}>
            {message.data.timeRange.join(" to ")}
          </b>
        </h3>
      )}
      {message.data.deliverEvery === "month" && (
        <h3 className={"center"} style={{ textAlign: "center", marginTop: 8 }}>
          Every <b>{message.data.deliverEvery}</b> on <br />
          <b>{monthDays}</b> day of a month
          <b>{message.data.reverseMonth === true ? " from the end" : ""}</b>
          <br />
          from{" "}
          <b style={{ whiteSpace: "nowrap" }}>
            {message.data.timeRange.join(" to ")}
          </b>
        </h3>
      )}
      {message.data.deliverEvery === "year" && (
        <h3 className={"center"} style={{ textAlign: "center", marginTop: 8 }}>
          Every <b>{message.data.deliverEvery}</b> on
          <br />
          {parse(yearDays)}
          <b>{weekDays}</b>
          <br />
          from{" "}
          <b style={{ whiteSpace: "nowrap" }}>
            {message.data.timeRange.join(" to ")}
          </b>
        </h3>
      )}
      <h3 className={"center"} style={{ textAlign: "center", marginTop: 5 }}>
        <b>{message.data.date}</b> at {message.data.at.join(":")}
      </h3>
      <h3 className={"center"} style={{ textAlign: "center", marginTop: 5 }}>
        Timezone: {message.data.timezone}
      </h3>
      <div className={"center"}>
        <div className={"flex-wrapper"} style={{ fontSize: "1.2rem" }}>
          <p
            style={{
              width: "auto",
              height: "auto",
              padding: 10,
              marginTop: 5,
            }}
          >
            status: <b>{message.status}</b>{" "}
          </p>
          {message.status === "active" && (
            <p className={"delete_contact cancel_job"}>CANCEL</p>
          )}
        </div>
      </div>
      <p
        className={"delete_contact"}
        style={{
          width: "auto",
          height: "auto",
          padding: 10,
          background: "rgba(0, 0, 0, .02)",
          borderColor: "rgba(0, 0, 0, .02)",
          marginTop: 5,
        }}
      >
        <center>
          {message.data.messageBody} {message.data.messageEnds}
        </center>
      </p>
    </div>
  );
};

export default ViewMessageSummary;
