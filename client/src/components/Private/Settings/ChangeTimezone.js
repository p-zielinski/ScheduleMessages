import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import parse from "html-react-parser";
import moment from "moment-timezone";
import iso3311a2 from "iso-3166-1-alpha-2";
import { useState } from "react";
import axios from "axios";
import Loading from "../../utils/Loading";
import { setCountryAndTimezone } from "../../../store/actions/userDataActions";

const ChangeTimezoneReq = async (credentials) => {
  return await axios({
    method: "post",
    url: "/api/set_timezone",
    timeout: 1000 * 3, // Wait for 5 seconds
    headers: {
      "Content-Type": "application/json",
    },
    data: credentials,
  })
    .then((response) => response.data)
    .catch((error) => error.response);
};

const ChangeTimezone = ({ success, setSuccess }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.userData);
  const { default_country, default_tz } = useSelector(
    (state) => state.userData
  );
  const [country, setCountry] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const changeTimezoneHandler = async () => {
    if (timezone === default_tz) {
      return 0;
    }
    if (country === null || timezone === null) {
      return 0;
    }
    setIsLoading(true);
    const returningData = await ChangeTimezoneReq({
      token: token,
      default_country: country,
      default_tz: timezone,
    });
    setIsLoading(false);
    if (
      typeof returningData.default_country === "string" &&
      typeof returningData.default_tz === "string"
    ) {
      dispatch(
        setCountryAndTimezone(
          returningData.default_country,
          returningData.default_tz
        )
      );
      setCountry(null);
      setTimezone(null);
      setSuccess(true);
    }
  };

  return (
    <>
      {success ? (
        <div className={"fullW"}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 5 }}>Success!</h2>
            <h3 style={{ marginBottom: 0 }}>Your new default timezone:</h3>
            <h3 style={{ textAlign: "center" }}>
              {iso3311a2.getCountry(default_country)} /{" "}
              {default_tz.split("/").pop().replace(/_/g, " ")}
            </h3>
          </div>
        </div>
      ) : (
        <div className={"fullW"}>
          <div
            hidden={!isLoading}
            style={{
              zIndex: 3,
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "100%",
              background: "rgba(255,255,255,0.8)",
            }}
          >
            <div style={{ position: "relative", marginTop: 240 }}>
              <Loading
                size={"2rem"}
                margin={"20px"}
                height={"-3rem"}
                background={"rgba(0,1,255,0.62)"}
              />
            </div>
          </div>
          {default_tz && (
            <div
              className={"show-one-message"}
              style={{ marginBottom: 8, background: "rgb(245,255,244)" }}
            >
              <h2
                style={{ textAlign: "center", marginBottom: 5, marginTop: 10 }}
              >
                Your current default timezone:
              </h2>
              <h3 style={{ textAlign: "center" }}>
                {iso3311a2.getCountry(default_country)} /{" "}
                {default_tz.split("/").pop().replace(/_/g, " ")}
              </h3>
            </div>
          )}
          <h2
            style={{
              textAlign: "center",
              marginBottom: 10,
              marginTop: 0,
            }}
          >
            {default_tz ? "Change" : "Define"} your default timezone:
          </h2>
          <Select
            style={{ width: "50%" }}
            allowClear={true}
            onClear={() => {
              setCountry(null);
              setTimezone(null);
            }}
            showSearch
            size={"large"}
            value={country}
            onSelect={(e) => {
              setCountry(e);
              setTimezone(null);
            }}
            placeholder="select a country"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {parse(
              moment.tz
                .countries()
                .map((x) => iso3311a2.getCountry(x))
                .sort()
                .map(
                  (x) => `<Option value=${iso3311a2.getCode(x)}>${x}</Option>`
                )
                .join("\n")
            )}
          </Select>
          <Select
            id={"select-city"}
            showSearch
            style={{ width: "50%" }}
            size={"large"}
            onSelect={(e) => setTimezone(e)}
            value={timezone}
            placeholder="select a city within your desired timezone"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {country &&
              parse(
                moment.tz
                  .zonesForCountry(country)
                  .map((x) => [x.split("/").pop().replace(/_/g, " "), x])
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map((x) => `<Option value=${x[1]}>${x[0]}</Option>`)
                  .join("\n")
              )}
          </Select>
          <p className={"warning-holder"}>
            {default_tz !== ""
              ? timezone === default_tz
                ? "Your current default timezone is the same!"
                : parse("&nbsp;")
              : parse("&nbsp;")}
          </p>
          <button
            disabled={timezone === null ? true : timezone === default_tz}
            className={"button"}
            onClick={() => changeTimezoneHandler()}
            type={"button"}
            style={{ fontSize: "2rem", marginTop: 10 }}
          >
            {default_tz ? "Change" : "Define"}
          </button>
        </div>
      )}
    </>
  );
};

export default ChangeTimezone;
