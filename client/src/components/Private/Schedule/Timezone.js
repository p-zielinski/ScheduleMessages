import { Checkbox, Select } from "antd";
import parse from "html-react-parser";
import moment from "moment-timezone";
import iso3311a2 from "iso-3166-1-alpha-2";

const Timezone = ({ country, setCountry, timezone, setTimezone }) => {
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
            setCountry(undefined);
            setTimezone(undefined);
          }}
          showSearch
          size={"large"}
          value={country}
          onSelect={(e) => {
            console.log(e);
            setCountry(e);
            setTimezone(undefined);
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
          onSelect={(e) => setTimezone(e)}
          value={timezone}
          placeholder="select a city within your desired timezone"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {country !== undefined &&
            parse(
              moment.tz
                .zonesForCountry(country)
                .map((x) => [x.split("/").pop().replace(/_/g, " "), x])
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map((x) => `<Option value=${x[1]}>${x[0]}</Option>`)
                .join("\n")
            )}
        </Select>
        {timezone}
      </div>
    </>
  );
};

export default Timezone;
