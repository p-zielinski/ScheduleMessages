import { Checkbox, Select } from "antd";
import parse from "html-react-parser";
import moment from "moment-timezone";
import iso3311a2 from "iso-3166-1-alpha-2";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCountry,
  setTimezone,
  setCountryAndTimezone,
  setTimezoneDefault,
} from "../../../store/actions/scheduleDataActions";

const Timezone = () => {
  const { country, timezone, saveTimezoneAsDefault } = useSelector(
    (state) => state.scheduleData
  );
  const { default_tz, default_country } = useSelector(
    (state) => state.userData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (default_tz !== "" && default_country !== "") {
      dispatch(setCountryAndTimezone(default_country, default_tz));
      setTimezoneDefaultHandler(true);
    }
  }, []);

  const setTimezoneDefaultHandler = async (value) => {
    dispatch(setTimezoneDefault(value));
  };

  const setCountryHandler = async (country) => {
    dispatch(setCountry(country));
  };
  const setTimezoneHandler = async (timezone) => {
    dispatch(setTimezone(timezone));
  };

  return (
    <>
      <div className={"center"}>
        <h2>timezone:</h2>
      </div>
      <div className={"fullW"}>
        <Select
          style={{ width: "50%" }}
          allowClear={true}
          onClear={() => {
            setCountryHandler(null);
            setTimezoneHandler(null);
          }}
          showSearch
          size={"large"}
          value={country}
          onSelect={(e) => {
            setCountryHandler(e);
            setTimezoneHandler(null);
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
              .map((x) => `<Option value=${iso3311a2.getCode(x)}>${x}</Option>`)
              .join("\n")
          )}
        </Select>
        <Select
          id={"select-city"}
          showSearch
          style={{ width: "50%" }}
          size={"large"}
          onSelect={(e) => setTimezoneHandler(e)}
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
        <div
          className={"center"}
          style={{ "margin-top": "7px", "margin-bottom": "24px" }}
        >
          <Checkbox
            checked={saveTimezoneAsDefault}
            onClick={() => setTimezoneDefaultHandler(!saveTimezoneAsDefault)}
          >
            Set this timezone as a default
          </Checkbox>
        </div>
      </div>
    </>
  );
};

export default Timezone;
