import parse from "html-react-parser";

const Canceled = () => {
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        Something went wrong&nbsp;&nbsp;<b>:/</b>
      </h2>
      <p style={{ textAlign: "center", marginBottom: 10 }}>
        It looks like you just canceled a transaction.
        <br />
        You will not be charged.
      </p>
    </div>
  );
};

export default Canceled;
