import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.css";
import { BrowserRouter, Route, useHistory } from "react-router-dom";
import NotLogged from "./components/Public/NotLogged";
import Logged from "./components/Private/Logged";
//token module
import useToken from "./components/utils/useToken";

function App() {
  const { token, setToken } = useToken();

  const LogOut = () => {
    localStorage.clear();
    setToken("");
  };

  if (!token) {
    return (
      <div className="wrapper">
        <BrowserRouter>
          <Route path="/">
            <NotLogged setToken={setToken} />
          </Route>
        </BrowserRouter>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Route path="/">
          <Logged token={token} LogOut={LogOut} />
        </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
