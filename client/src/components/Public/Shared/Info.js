const Info = ({ setTypeOfInfo, text }) => {
  const close = () => {
    setTypeOfInfo(null);
  };

  return (
    <div className={"info-wrapper"}>
      <p className={"info-text-holder"}>{text}</p>
      <i onClick={() => close()} className="fas fa-times"></i>
    </div>
  );
};

export default Info;
