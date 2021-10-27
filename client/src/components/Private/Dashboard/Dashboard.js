import { useSelector } from "react-redux";
import ViewMessageSummary from "./ViewMessageSummary";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { messages } = useSelector((state) => state.userData);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Most recent scheduled messages:</h2>
      {typeof messages === "object"
        ? messages.length > 0
          ? messages
              .slice(0, 3)
              .map((message) => <ViewMessageSummary message={message} />)
          : parse("<h2>No messages to display</h2>")
        : ""}
      {typeof messages === "object"
        ? messages.length > 2 && (
            <Link to={"/messages"}>
              <div
                className={"add_icon"}
                style={{ marginTop: 10, width: "100%", height: "auto" }}
              >
                <p
                  className={"center"}
                  style={{ fontSize: "2rem", padding: 10, textAlign: "center" }}
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
