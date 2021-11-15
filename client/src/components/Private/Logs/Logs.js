import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ViewMessageSummary from "../Dashboard/ViewMessageSummary";
import parse from "html-react-parser";
import ViewMessageSendingLog from "../Dashboard/ViewMessageSendingLog";

const Logs = () => {
  const { sending_messages_log } = useSelector((state) => state.userData);
  const [pageNumber, setPageNumber] = useState([0]);
  const [showType, setShowType] = useState("all");

  useEffect(() => {}, [showType]);

  return (
    <div className={"fullW"}>
      <div className={"flex-wrapper fullW"}>
        <div
          className={"add_icon"}
          style={{ width: "100%", marginRight: 9 }}
          onClick={() => setShowType("all")}
        >
          <p className={"center vertical-center"}>all</p>
        </div>
        <div
          className={"add_icon active-button"}
          onClick={() => setShowType("sent")}
          style={{ width: "100%", marginRight: 9 }}
        >
          <p className={"center vertical-center"}>sent</p>
        </div>
        <div
          className={"add_icon canceled-button"}
          onClick={() => setShowType("not sent")}
          style={{ width: "100%", marginRight: 0 }}
        >
          <p className={"center vertical-center"}>not sent</p>
        </div>
      </div>
      <>
        {typeof sending_messages_log === "object"
          ? sending_messages_log.length === 0
            ? parse(`<h3 style="margin-bottom: 0">No logs to display</h3>`)
            : sending_messages_log.map((message_log, index) => {
                if (showType === "sent") {
                  if (typeof message_log.data[0].sent === "string") {
                    return (
                      <ViewMessageSendingLog
                        key={message_log.data[0].messageSid}
                        message_log={message_log}
                      />
                    );
                  } else {
                    console.log("chuj");
                  }
                } else if (showType === "not sent") {
                  if (typeof message_log.data[0].sent !== "string") {
                    return (
                      <ViewMessageSendingLog
                        key={message_log.data[0].messageSid}
                        message_log={message_log}
                      />
                    );
                  }
                } else {
                  return (
                    <ViewMessageSendingLog
                      key={message_log.data[0].messageSid}
                      message_log={message_log}
                    />
                  );
                }
              })
          : "No messages to display"}
      </>
    </div>
  );
};

export default Logs;
