import { useSelector } from "react-redux";
import ViewMessageSummary from "./ViewMessageSummary";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { messages } = useSelector((state) => state.userData);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Most recent sent messages:</h2>
      <h2 style={{ marginTop: 10 }}>No messages to display</h2>
      <h2 style={{ textAlign: "center" }}>Most recent scheduled message:</h2>
      {typeof messages === "object"
        ? messages.length > 0
          ? messages
              .slice(0, 1)
              .map((message) => (
                <ViewMessageSummary key={message.uniqJobId} message={message} />
              ))
          : parse("<h2 style='margin-top: 10px'>No messages to display</h2>")
        : parse("<h2 style='margin-top: 10px'>No messages to display</h2>")}
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
