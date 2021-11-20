import { useSelector } from "react-redux";
import ViewMessageSummary from "./ViewMessageSummary";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import ViewMessageSendingLog from "./ViewMessageSendingLog";

const Dashboard = () => {
  const { messages, email, name, available_funds, sending_messages_log } =
    useSelector((state) => state.userData);

  return (
    <div>
      <div className={"dashboard-info"}>
        <h2 style={{ textAlign: "center", marginTop: 10 }}>
          Hi{" "}
          {name !== ""
            ? name
            : typeof email === "string"
            ? email.toLowerCase()
            : ""}
          <br />
          <div className={"center"}>
            <div className={"flex-wrapper"} style={{ marginTop: 5 }}>
              <p>Your credit:&nbsp;</p>
              {typeof available_funds === "number"
                ? available_funds > 2
                  ? parse(
                      `<p style="color:rgb(95, 171, 59)">${available_funds.toFixed(
                        2
                      )}$</p>`
                    )
                  : available_funds > 1
                  ? parse(
                      `<p style="color:rgb(245, 0, 0)">${available_funds.toFixed(
                        2
                      )}$</p>`
                    )
                  : parse(
                      `<p style="color:rgb(245, 0, 0)">${available_funds.toFixed(
                        2
                      )}$</p>`
                    )
                : ""}
            </div>
            {typeof available_funds === "number" ? (
              available_funds < 5 ? (
                <Link to={"/settings?funds"}>
                  <p
                    className={"delete_contact add_funds"}
                    style={{ margin: 0, marginTop: 5 }}
                  >
                    Add more funds
                  </p>
                </Link>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>
        </h2>
      </div>
      <h2 style={{ textAlign: "center" }}>Most recent messaging log:</h2>
      {typeof sending_messages_log === "object"
        ? sending_messages_log.length === 0
          ? parse(`<h3 style="margin-bottom: 0">No logs to display</h3>`)
          : sending_messages_log.map((message_log, index) => {
              if (index === 0)
                return (
                  <ViewMessageSendingLog
                    key={message_log.messageSid}
                    message_log={message_log}
                  />
                );
              else return "";
            })
        : "No messages to display"}
      {typeof sending_messages_log === "object"
        ? sending_messages_log.length > 1 && (
            <Link to={"/logs"}>
              <div
                className={"add_icon"}
                style={{ marginTop: 10, width: "100%", height: "auto" }}
              >
                <p
                  className={"center hide-decoration"}
                  style={{
                    fontSize: "1.8rem",
                    padding: 8,
                    textAlign: "center",
                    color: "black",
                    textDecorationColor: "none",
                  }}
                >
                  Show all logs
                </p>
              </div>
            </Link>
          )
        : ""}
      <h2 style={{ textAlign: "center", marginTop: 10 }}>
        Most recent scheduled message:
      </h2>
      {typeof messages === "object"
        ? messages.length === 0
          ? parse(`<h3 style="margin-bottom: 0">No messages to display</h3>`)
          : messages.map((message, index) => {
              if (index === 0)
                return (
                  <ViewMessageSummary
                    key={message.uniqJobId}
                    message={message}
                  />
                );
              else return "";
            })
        : "No messages to display"}
      {typeof messages === "object"
        ? messages.length > 1 && (
            <Link to={"/messages"}>
              <div
                className={"add_icon"}
                style={{ marginTop: 10, width: "100%", height: "auto" }}
              >
                <p
                  className={"center hide-decoration"}
                  style={{
                    fontSize: "1.8rem",
                    padding: 8,
                    textAlign: "center",
                    color: "black",
                    textDecorationColor: "none",
                  }}
                >
                  Show all messages
                </p>
              </div>
            </Link>
          )
        : ""}
    </div>
  );
};

export default Dashboard;
