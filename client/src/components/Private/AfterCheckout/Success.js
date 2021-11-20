import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../utils/Loading";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

const getSessionDetails = async (credentials) => {
  return await axios({
    method: "post",
    url: "/api/get_session_details",
    timeout: 1000 * 3, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: credentials,
  })
    .then((response) => response)
    .catch((error) => error.response);
};

const Success = () => {
  const history = useHistory();
  const queries = queryString.parseUrl(useLocation().search).query;
  const [amount, setAmount] = useState(false);
  const { email, available_funds } = useSelector((state) => state.userData);

  useEffect(async () => {
    const sessionId = queries.session_id;
    if (sessionId === undefined) {
      history.push("/dashboard");
    }
    const token = localStorage.getItem("token");
    if (typeof token === "string") {
      if (token.length < 10) {
        history.push("/");
      }
    }
    const response = await getSessionDetails({
      token: token,
      sessionId: sessionId,
    });
    if (response.status !== 200) {
      history.push("/dashboard");
    }
    setAmount((response.data / 100).toFixed(2));
  }, []);

  return (
    <div>
      <div style={{ marginTop: "4rem", marginBottom: "1rem" }} hidden={amount}>
        <Loading
          size={"2rem"}
          margin={"20px"}
          height={"-3rem"}
          background={"rgba(0,1,255,0.62)"}
        />
      </div>
      <div hidden={!amount}>
        <h2 style={{ textAlign: "center" }}>Thank You!</h2>
        <p style={{ textAlign: "center", marginBottom: 10 }}>
          Looks like you have just added <b>{amount}$</b> to your <u>{email}</u>{" "}
          account on ScheduleMessage.com!
        </p>
        <div className={"center"} style={{ marginBottom: 10 }}>
          <div className={"flex-wrapper"}>
            <p>Your credit now:&nbsp;</p>
            <b>
              {typeof available_funds === "number"
                ? available_funds > 2
                  ? parse(
                      `<p style="color:rgb(95, 171, 59)">${available_funds.toFixed(
                        2
                      )}$</p>`
                    )
                  : available_funds > 1
                  ? parse(
                      `<p style="color:rgb(245, 0, 0)">${available_funds.toFixed(
                        2
                      )}$</p>`
                    )
                  : parse(
                      `<p style="color:rgb(245, 0, 0)">${available_funds.toFixed(
                        2
                      )}$</p>`
                    )
                : ""}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
