import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ViewMessageSummary from "../Dashboard/ViewMessageSummary";
import parse from "html-react-parser";

const Messages = () => {
  const { messages } = useSelector((state) => state.userData);
  const [pageNumber, setPageNumber] = useState([0]);
  const [showType, setShowType] = useState("all");

  useEffect(() => {}, [showType]);

  return (
    <div className={"fullW"}>
      <div className={"fullW flex-wrapper-max-400px"}>
        <div className={"flex-wrapper fullW margin-bottom-below-400px"}>
          <div
            className={"add_icon filters-margin-right all-button"}
            style={{ width: "100%" }}
            onClick={() => setShowType("all")}
          >
            <p className={"center vertical-center"}>all</p>
          </div>
          <div
            className={
              "add_icon filters-margin-right no-margin-below-400px active-button"
            }
            onClick={() => setShowType("active")}
          >
            <p className={"center vertical-center"}>active</p>
          </div>
        </div>
        <div className={"flex-wrapper fullW"}>
          <div
            className={"add_icon filters-margin-right canceled-button"}
            onClick={() => setShowType("canceled")}
          >
            <p className={"center vertical-center"}>canceled</p>
          </div>

          <div
            className={"add_icon completed-button"}
            onClick={() => setShowType("completed")}
          >
            <p className={"center vertical-center"}>completed</p>
          </div>
        </div>
      </div>
      {showType === "all" && (
        <>
          {typeof messages === "object"
            ? messages.length > 0
              ? messages
                  .slice(pageNumber * 5, pageNumber * 5 + 5)
                  .map((message) => (
                    <ViewMessageSummary
                      key={message.uniqJobId}
                      message={message}
                    />
                  ))
              : parse(
                  "<h2 style='margin-top: 10px'>No messages to display</h2>"
                )
            : parse("<h2 style='margin-top: 10px'>No messages to display</h2>")}
        </>
      )}
      {showType !== "all" && (
        <>
          {typeof messages === "object"
            ? messages.filter((e) => e.status === showType).length > 0
              ? messages
                  .filter((e) => e.status === showType)
                  .slice(pageNumber * 5, pageNumber * 5 + 5)
                  .map((message) => (
                    <ViewMessageSummary
                      key={message.uniqJobId}
                      message={message}
                    />
                  ))
              : parse(
                  "<h2 style='margin-top: 10px'>No messages to display</h2>"
                )
            : parse("<h2 style='margin-top: 10px'>No messages to display</h2>")}
        </>
      )}
    </div>
  );
};

export default Messages;
