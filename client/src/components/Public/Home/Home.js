import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className={"main-area"}>
      <div className={"home"}>
        <h1>blablabla</h1>
        <Link to={"/login"}>
          <button>Login/Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
