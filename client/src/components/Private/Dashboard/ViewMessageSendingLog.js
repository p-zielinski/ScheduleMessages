import parse from "html-react-parser";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LoadDetailsSendingLog from "./LoadDetailsSendingLog";
import ViewMessageSummary from "./ViewMessageSummary";
import { nanoid } from "nanoid";

const ViewMessageSendingLog = ({ message_log }) => {
  const { messages } = useSelector((state) => state.userData);
  const [message, setMessage] = useState(undefined);
  const [selected, setSelected] = useState(null);
  const [totalCost, setTotalCost] = useState(undefined);
  const [showScheduledMessage, setShowScheduleMessage] = useState(false);

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(async () => {
    while (true) {
      if (messages !== undefined) {
        setMessage(messages.find((e) => e.uniqJobId === message_log.uniqJobId));
        console.log(
          messages.find((e) => e.uniqJobId === message_log.uniqJobId)
        );
        break;
      }
      timeout(200);
    }
  }, []);

  useEffect(() => {
    if (typeof message_log === "object") {
      if (typeof message_log.totalCost !== "undefined") {
        setTotalCost(message_log.totalCost);
      } else {
        let totalCostLocal = 0;
        for (let person of message_log.data) {
          if (typeof person.sent === "string") {
            totalCostLocal += person.msgSegmentsCount * person.msgPrice;
          }
        }
        setTotalCost(totalCostLocal);
      }
    }
  }, []);

  return (
    <div
      className={"show-one-message"}
      style={{
        width: "100%",
        height: "auto",
        padding: 5,
        marginTop: 10,
        background: totalCost > 0 ? `rgb(245,255,244)` : `rgb(255,234,234)`,
      }}
    >
      <div>
        {message_log.data.map((e, index) => (
          <div
            className={"add_icon"}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: 6,
              background: `rgb(241,247,255)`,
            }}
            onClick={() => {
              if (index === selected) {
                setSelected(null);
              } else {
                setSelected(index);
              }
            }}
          >
            <div
              className={"center"}
              style={{
                textAlign: "center",
                padding: "5px 0 5px 0",
              }}
            >
              {selected === index ? (
                <div style={{ height: 37 }}>
                  <div className={"vertical-center"}>
                    <b style={{ color: `rgb(196, 65, 65)` }}>
                      Show general information
                    </b>
                  </div>
                </div>
              ) : (
                <>
                  {e.name} ({e.number})
                  {typeof e.FirstTimeMessage === "object"
                    ? parse(`<b style="color:rgba(255,50,50,0.7)">*</b>`)
                    : ""}
                  <br />
                  {typeof e.sent === "string"
                    ? typeof message === "object"
                      ? new moment(e.sent)
                          .tz(message.data.timezone)
                          .format("YYYY-MM-DD h:mm a")
                      : new moment(e.sent).format("YYYY-MM-DD h:mm a")
                    : typeof e.sent === "boolean"
                    ? e.sent === false
                      ? parse(
                          `<b style="color:rgba(255,50,50,0.7)">Not sent</b>`
                        )
                      : ""
                    : ""}
                </>
              )}
            </div>
          </div>
        ))}
        {selected !== null ? (
          <LoadDetailsSendingLog
            details={message_log.data[selected]}
            message={message}
          />
        ) : (
          <>
            <div
              className={"center"}
              style={{
                marginTop: -6,
                height: "auto",
                padding: "10px 0 5px 0",
                textAlign: "center",
              }}
            >
              {typeof totalCost === "number"
                ? parse(`<b>Total cost:</b><br/>${totalCost.toFixed(2)}$`)
                : parse(`<b>Total cost:</b><br/>unknown`)}
            </div>
            {totalCost > 0 ? (
              <div
                className={"center"}
                style={{
                  height: "auto",
                  padding: "5px 0 5px 0",
                  textAlign: "center",
                }}
              >
                {typeof message === "object"
                  ? typeof message.data === "object"
                    ? parse(`<b>Content:</b><br/>${message.data.messageBody}`)
                    : ""
                  : ""}
              </div>
            ) : (
              ""
            )}
            {message_log.error !== undefined ? (
              <div
                className={"center"}
                style={{
                  height: "auto",
                  padding: "5px 0 5px 0",
                  textAlign: "center",
                }}
              >
                <b>Reason:</b>
                <br />
                {message_log.error}
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </div>
      <div
        className={"add_icon show_message_assigned_button"}
        style={{
          marginTop: 10,
          marginBottom: 0,
          width: "100%",
          height: "auto",
          background: `rgb(253,248,255)`,
        }}
        onClick={() => setShowScheduleMessage(!showScheduledMessage)}
      >
        <div style={{ height: 47 }}>
          <div className={"vertical-center center"}>
            <p style={{ textAlign: "center", padding: "5px 0 5px 0" }}>
              {!showScheduledMessage ? "Show" : "Hide"} scheduled message
              <br />
              assigned to this message log
            </p>
          </div>
        </div>
      </div>
      {showScheduledMessage && typeof message === "object" ? (
        <ViewMessageSummary
          key={message.uniqJobId}
          message={message}
          setMargin={5}
          noContent={totalCost > 0}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ViewMessageSendingLog;
