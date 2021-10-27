import { Link } from "react-router-dom";
import { useState } from "react";

const NavBar = ({ LogOut }) => {
  const [hideShowClassName, setHideShowClassName] =
    useState("hide-bellow-658px");

  const changeClassNameHandler = () => {
    if (hideShowClassName === "hide-bellow-658px") {
      setHideShowClassName("show-bellow-658px");
    } else {
      setHideShowClassName("hide-bellow-658px");
    }
    console.log(hideShowClassName);
  };

  return (
    <>
      <div className={"flex-wrapper nav-over-658px-media"}>
        <Link to={"/dashboard"}>
          <button className={"nav-wrapper-button nav-over-658px-media"}>
            Dashboard
          </button>
        </Link>
        <Link to={"/schedule"}>
          <button className={"nav-wrapper-button nav-over-658px-media"}>
            Schedule a new message
          </button>
        </Link>
        <Link to={"/settings"}>
          <button className={"nav-wrapper-button nav-over-658px-media"}>
            Settings
          </button>
        </Link>
        <Link to={"/"}>
          <button
            className={"nav-wrapper-button nav-over-658px-media"}
            id={"logout-button"}
            onClick={() => LogOut()}
          >
            <p>Log Out</p>
          </button>
        </Link>
      </div>
    </>
  );
};

export default NavBar;
