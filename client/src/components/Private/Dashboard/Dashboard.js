import { useSelector } from "react-redux";
import ViewMessageSummary from "./ViewMessageSummary";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

const Dashboard = ({ newestScheduledMessage, setNewestScheduledMessage }) => {
  const { messages, email, name, available_funds } = useSelector(
    (state) => state.userData
  );

  const [lastMessage, setLastMessage] = useState({});

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
      <h2 style={{ textAlign: "center" }}>Messaging log:</h2>
      <h2 style={{ marginTop: 10 }}>No messages to display</h2>
      <h2 style={{ textAlign: "center" }}>Most recent scheduled message:</h2>
      {typeof messages === "object"
        ? messages.map((message, index) => {
            if (index === 0)
              return (
                <ViewMessageSummary key={message.uniqJobId} message={message} />
              );
            else return "";
          })
        : ""}
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
                    fontSize: "2rem",
                    padding: 10,
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
