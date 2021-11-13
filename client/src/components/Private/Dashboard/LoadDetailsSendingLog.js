import moment from "moment-timezone";
import parse from "html-react-parser";

const LoadDetailsSendingLog = ({ details, message }) => {
  return (
    <div className={"fullW"} style={{ marginBottom: 3 }}>
      <div className={"center"} style={{ textAlign: "center" }}>
        <b>Message to:</b>
        <br />
        {details.name} ({details.number})
      </div>
      {typeof details.FirstTimeMessage === "object" ? (
        <div
          className={"center"}
          style={{ textAlign: "center", marginTop: 10 }}
        >
          <u style={{ color: `rgb(255,102,102)` }}>
            This was your first message sent to this number
          </u>
        </div>
      ) : (
        ""
      )}
      <div className={"center"} style={{ textAlign: "center", marginTop: 10 }}>
        <b>Delivered:</b>
        <br />
        {typeof details.sent === "string"
          ? typeof message === "object"
            ? new moment(details.sent)
                .tz(message.data.timezone)
                .format("YYYY-MM-DD h:mm a")
            : new moment(details.sent).format("YYYY-MM-DD h:mm a")
          : typeof details.sent === "boolean"
          ? details.sent === false
            ? parse(`<b style="color:rgb(255,89,89)">Not sent</b>`)
            : ""
          : ""}
        {typeof message === "object"
          ? parse(`<br/>${message.data.timezone}`)
          : ""}
      </div>
      <div className={"center"} style={{ textAlign: "center", marginTop: 10 }}>
        {typeof details.FirstTimeMessage === "object"
          ? parse(
              `<b>Contents:</b><br/><p style="text-align: center;margin-bottom: 2px">${details.message}</p><p style="color:rgb(255,89,89)">${details.FirstTimeMessage.body}</p>`
            )
          : parse(`<b>Content:</b><br/>${details.message}`)}
      </div>
      {typeof details.sent === "string" ? (
        <div
          className={"center"}
          style={{ textAlign: "center", marginTop: 10 }}
        >
          <b>Cost of delivering this message:</b>
          {typeof details.FirstTimeMessage === "object"
            ? parse(
                `<br />${
                  (details.msgSegmentsCount - 3) * details.msgPrice.toFixed(2)
                }$ <u style="text-decoration: none; color:rgb(255,89,89) ">+ ${
                  3 * details.msgPrice.toFixed(2)
                }$</u>`
              )
            : parse(
                `<br />${
                  details.msgSegmentsCount * details.msgPrice.toFixed(2)
                }$`
              )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default LoadDetailsSendingLog;
