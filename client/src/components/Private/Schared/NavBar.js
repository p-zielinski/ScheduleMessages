import { Link } from "react-router-dom";

const NavBar = ({ LogOut }) => {
  return (
    <div className={"nav-wrapper"}>
      <div>
        <Link to={"/dashboard"}>
          <button className={"nav-wrapper-button"}>
            <h1>Dashboard</h1>
          </button>
        </Link>
      </div>
      <div>
        <Link to={"/schedule"}>
          <button className={"nav-wrapper-button"}>
            <h1>Schedule a new message</h1>
          </button>
        </Link>
      </div>
      <div>
        <Link to={"/settings"}>
          <button className={"nav-wrapper-button"}>
            <h1>Settings</h1>
          </button>
        </Link>
      </div>

      <div>
        <Link to={"/"}>
          <button
            className={"nav-wrapper-button"}
            id={"logout-button"}
            onClick={() => LogOut()}
          >
            <h1>Log Out</h1>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
