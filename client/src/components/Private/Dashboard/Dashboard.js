import { Link, useLocation } from "react-router-dom";

const Dashboard = ({
  token,
  setMessages,
  messages,
  updateKey,
  setUpdateKey,
}) => {
  return (
    <div>
      <h2>Scheduled messages:</h2>
      {messages
        ? messages.length === 0
          ? "No messagess to display"
          : messages
        : "No messagess to display"}
    </div>
  );
};

export default Dashboard;
