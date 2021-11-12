const moment = require("moment-timezone");

const replaceDateFunctions = (tekst, selectedTimeZone) => {
  const findFunctions = (e) => {
    let ar = [];
    for (let i = 0; i < e.length; i++) {
      if (e[i] === "<" || e[i] === ">") {
        ar.push([e[i], i]);
      }
    }
    return ar;
  };

  const f = findFunctions(tekst);
  let errors = {};
  const replace = [];

  i = 0;
  while (i < f.length) {
    //looking for functions
    if (f[i][0] === ">") {
      try {
        if (f[i - 1][0] === "<") {
          const sliced = tekst.slice(f[i - 1][1], f[i][1] + 1);
          const slicedToLowerCase = sliced
            .toLowerCase()
            .replace(/\n/g, "")
            .replace(/\ \ /g, " "); //part inside { ... }
          if (
            (slicedToLowerCase.includes("to") &&
              !slicedToLowerCase.includes("my") &&
              !slicedToLowerCase.includes("<r")) ||
            slicedToLowerCase.match(/<\Wr/) !== null
          ) {
            let valid = true; //possibly valid fuction
            let yearIndex = slicedToLowerCase.indexOf("year");
            let yearHolder = "";
            if (yearIndex !== -1) {
              let foundNumber = false;
              yearIndex += 4;
              while (yearIndex < slicedToLowerCase.length) {
                if (slicedToLowerCase[yearIndex].match(/[0-9]/)) {
                  yearHolder += slicedToLowerCase[yearIndex];
                  foundNumber = true;
                } else if (foundNumber === true) {
                  break;
                }
                yearIndex += 1;
              }
            }
            yearHolder = parseInt(yearHolder);
            if (yearHolder < 1900 || yearHolder > 2100) {
              valid = false;
              errors.YEAR = `Year ${yearHolder} in function ${sliced} is out of range, should be between 1900 and 2100.`;
            }
            let monthIndex = slicedToLowerCase.indexOf("month");
            let monthHolder = "";
            if (monthIndex !== -1) {
              let foundNumber = false;
              monthIndex += 5;
              while (monthIndex < slicedToLowerCase.length) {
                if (slicedToLowerCase[monthIndex].match(/[0-9]/)) {
                  monthHolder += slicedToLowerCase[monthIndex];
                  foundNumber = true;
                } else if (foundNumber === true) {
                  break;
                }
                monthIndex += 1;
              }
            }
            monthHolder = parseInt(monthHolder);
            if (monthHolder < 1 || monthHolder > 12) {
              valid = false;
              errors.MONTH = `Month ${monthHolder} in function ${sliced} is out of range, should be between 1 and 12.`;
            }
            let dayIndex = slicedToLowerCase.indexOf("day");
            let dayHolder = "";
            if (dayIndex !== -1) {
              let foundNumber = false;
              dayIndex += 3;
              while (dayIndex < slicedToLowerCase.length) {
                if (slicedToLowerCase[dayIndex].match(/[0-9-]/)) {
                  dayHolder += slicedToLowerCase[dayIndex];
                  foundNumber = true;
                } else if (foundNumber === true) {
                  break;
                }
                dayIndex += 1;
              }
            }
            dayHolder = parseInt(dayHolder);
            if (dayHolder < 0 && dayHolder > -32) {
              //sprawdzic czy nie ma roku podanego
            } else if (dayHolder < -31 || dayHolder > 31 || dayHolder === 0) {
              valid = false;
              errors.DAY = `Day ${dayHolder} in function ${sliced} is out of range, should be between -31 and -1 or between 1 and 31.`;
            }
            if (
              Object.keys(errors).length === 0 &&
              (yearIndex !== -1 || monthIndex !== -1 || dayIndex !== -1)
            ) {
              console.log(dayHolder, yearHolder, monthHolder);
              const slicedToLowerCaseArray = slicedToLowerCase.split("");
              let options = new Set();
              while (true) {
                const e = slicedToLowerCaseArray.pop();
                if (e.match(/[ymwd]/)) {
                  options.add(e);
                } else if (e.match(/[0-9]/)) {
                  break;
                }
              }
              if (options.size === 0) {
                options = new Set(["d", "w", "m", "y"]);
              }
              let today = moment()
                .tz(selectedTimeZone)
                .format("YYYY-MM-DD")
                .split("-");
              today = {
                year: parseInt(today[0]),
                month: parseInt(today[1]),
                day: parseInt(today[2]),
              };
              const to = {
                year: isNaN(yearHolder) ? null : yearHolder,
                month: isNaN(monthHolder) ? null : monthHolder,
                day: isNaN(dayHolder) ? null : dayHolder,
              };
              if (to.year !== null && to.month === null && to.day === null) {
                replace.push([
                  sliced,
                  Math.abs(to.year - today.year) === 1
                    ? "1 year"
                    : Math.abs(to.year - today.year) + " years",
                ]);
              } else if (to.year === null && to.month !== null) {
                //month is declared
                if (options.size === 1 && options.has("y")) {
                  options = new Set(["d", "w", "m", "y"]);
                }
                if (to.day === null) {
                  to.day = 1;
                }
                const todayMoment = moment().tz(selectedTimeZone);
                const toMoment = moment(todayMoment);
                toMoment.set("month", to.month);
                toMoment.set("date", to.day);
                let months;
                let weeks;
                let days;
                if (options.has("m")) {
                  if (toMoment.diff(todayMoment, "days") < 0) {
                    toMoment.set("year", today.year + 1);
                  }
                  months = toMoment.diff(todayMoment, "months");
                  todayMoment.add(months, "months");
                }
                if (options.has("w")) {
                  weeks = toMoment.diff(todayMoment, "weeks");
                  todayMoment.add(weeks, "weeks");
                }
                if (options.has("d")) {
                  days = toMoment.diff(todayMoment, "days");
                }
                if (months !== undefined) {
                  months =
                    months === 1
                      ? "1 month"
                      : months > 0
                      ? months + " months"
                      : null;
                }
                if (weeks !== undefined) {
                  weeks =
                    weeks === 1
                      ? "1 week"
                      : weeks > 0
                      ? weeks + " weeks"
                      : null;
                }
                if (days !== undefined) {
                  days =
                    days === 1 ? "1 day" : days > 0 ? days + " days" : null;
                }
                if (
                  (days === undefined || days === null) &&
                  (weeks === undefined || weeks === null) &&
                  (months === undefined || months === null)
                ) {
                  if (days === null) {
                    days = "0 days";
                  } else if (weeks === null) {
                    weeks = "0 weeks";
                  } else {
                    months = "0 months";
                  }
                }
                let temp = "";
                if (typeof months === "string") {
                  temp += months;
                }
                if (typeof weeks === "string" && typeof days !== "string") {
                  temp += " and " + weeks;
                } else if (
                  typeof weeks !== "string" &&
                  typeof days === "string"
                ) {
                  temp += " and " + days;
                } else {
                  temp += ", " + weeks + " and " + days;
                }
                replace.push([sliced, temp]);
              } else if (
                to.year !== null &&
                to.month === null &&
                to.day !== null
              ) {
                errors.VALID = `Function ${sliced} is not valid because no month is provided.`;
              } else if (
                to.year === null &&
                to.month === null &&
                to.day !== null
              ) {
                //only day is declared
                if (to.day === today.day) {
                  replace.push([sliced, "0 days"]);
                } else if (to.day > 0) {
                  const todayMoment = moment().tz(selectedTimeZone);
                  let daysCounter = 0;
                  let maxTry = 120;
                  while (maxTry >= -1) {
                    maxTry -= 1;
                    daysCounter += 1;
                    todayMoment.add(1, "days");
                    if (parseInt(todayMoment.format("DD")) === to.day) {
                      if (options.has("w")) {
                        if (options.has("d")) {
                          let temp = "";
                          if (Math.floor(daysCounter / 7) >= 1) {
                            if (Math.floor(daysCounter / 7) === 1) {
                              temp = "1 week";
                            } else {
                              temp = Math.floor(daysCounter / 7) + " weeks";
                            }
                          }
                          if (daysCounter === 0) {
                            temp = "0 days";
                          }
                          daysCounter %= 7;
                          if (daysCounter > 0 && temp.length > 0) {
                            temp += " and ";
                          }
                          if (daysCounter >= 1) {
                            if (daysCounter === 1) {
                              temp += "1 day";
                            } else {
                              temp += daysCounter + " days";
                            }
                          }
                          replace.push([sliced, temp]);
                        } else {
                          replace.push([
                            sliced,
                            Math.floor(daysCounter / 7) === 1
                              ? "1 week"
                              : Math.floor(daysCounter / 7) + " weeks",
                          ]);
                        }
                      } else {
                        replace.push([
                          sliced,
                          daysCounter === 1 ? "1 day" : daysCounter + " days",
                        ]);
                      }
                      break;
                    }
                  }
                } else if (to.day < 0) {
                  const todayMoment = moment().tz(selectedTimeZone);
                  let daysInCurrentMonth;
                  let daysCounter = 0;
                  let maxTry = 120;
                  while (maxTry >= -1) {
                    maxTry -= 1;
                    daysInCurrentMonth = todayMoment.daysInMonth();
                    if (-daysInCurrentMonth <= to.day) {
                      if (
                        daysInCurrentMonth -
                          parseInt(todayMoment.format("DD")) ===
                        -to.day
                      ) {
                        if (options.has("w")) {
                          if (options.has("d")) {
                            let temp = "";
                            if (Math.floor(daysCounter / 7) >= 1) {
                              if (Math.floor(daysCounter / 7) === 1) {
                                temp = "1 week";
                              } else {
                                temp = Math.floor(daysCounter / 7) + " weeks";
                              }
                            }
                            if (daysCounter === 0) {
                              temp = "0 days";
                            }
                            daysCounter %= 7;
                            if (daysCounter > 0 && temp.length > 0) {
                              temp += " and ";
                            }
                            if (daysCounter >= 1) {
                              if (daysCounter === 1) {
                                temp += "1 day";
                              } else {
                                temp += daysCounter + " days";
                              }
                            }
                            replace.push([sliced, temp]);
                          } else {
                            replace.push([
                              sliced,
                              Math.floor(daysCounter / 7) === 1
                                ? "1 week"
                                : Math.floor(daysCounter / 7) + " weeks",
                            ]);
                          }
                        } else {
                          replace.push([
                            sliced,
                            daysCounter === 1 ? "1 day" : daysCounter + " days",
                          ]);
                        }
                        break;
                      }
                    }
                    todayMoment.add(1, "days");
                    daysCounter += 1;
                  }
                }
              } else {
                let todayMoment = moment().tz(selectedTimeZone);
                let toMoment = moment(todayMoment);
                toMoment.set("year", to.year);
                toMoment.set("month", to.month);
                toMoment.set("date", to.day);
                if (toMoment.diff(todayMoment, "days") < 0) {
                  let tempMoment = moment(toMoment);
                  toMoment = moment(todayMoment);
                  todayMoment = moment(tempMoment);
                }
                let years;
                let months;
                let weeks;
                let days;
                if (options.has("y")) {
                  years = toMoment.diff(todayMoment, "years");
                  todayMoment.add(years, "years");
                }
                if (options.has("m")) {
                  if (toMoment.diff(todayMoment, "days") < 0) {
                    toMoment.set("year", today.year + 1);
                  }
                  months = toMoment.diff(todayMoment, "months");
                  todayMoment.add(months, "months");
                }
                if (options.has("w")) {
                  weeks = toMoment.diff(todayMoment, "weeks");
                  todayMoment.add(weeks, "weeks");
                }
                if (options.has("d")) {
                  days = toMoment.diff(todayMoment, "days");
                }
                if (years !== undefined) {
                  years =
                    years === 1
                      ? "1 year"
                      : years > 0
                      ? years + " years"
                      : null;
                }
                if (months !== undefined) {
                  months =
                    months === 1
                      ? "1 month"
                      : months > 0
                      ? months + " months"
                      : null;
                }
                if (weeks !== undefined) {
                  weeks =
                    weeks === 1
                      ? "1 week"
                      : weeks > 0
                      ? weeks + " weeks"
                      : null;
                }
                if (days !== undefined) {
                  days =
                    days === 1 ? "1 day" : days > 0 ? days + " days" : null;
                }
                if (
                  (days === undefined || days === null) &&
                  (weeks === undefined || weeks === null) &&
                  (months === undefined || months === null) &&
                  (years === undefined || years === null)
                ) {
                  if (days === null) {
                    days = "0 days";
                  } else if (weeks === null) {
                    weeks = "0 weeks";
                  } else if (months === null) {
                    months = "0 months";
                  } else {
                    years = "0 years";
                  }
                }
                let temp = "";
                if (typeof years === "string") {
                  temp += years;
                }
                if (typeof months === "string" && temp !== "") {
                  temp += ", " + months;
                } else if (typeof months === "string" && temp === "") {
                  temp += months;
                }
                if (typeof weeks === "string" && temp !== "") {
                  temp += ", " + weeks;
                } else if (typeof weeks === "string" && temp === "") {
                  temp += weeks;
                }
                if (typeof days === "string" && temp !== "") {
                  temp += ", " + days;
                } else if (typeof days === "string" && temp === "") {
                  temp += days;
                }
                temp = temp
                  .split(",")
                  .join(", ")
                  .split("")
                  .reverse()
                  .join("")
                  .replace(",", "dna ")
                  .split("")
                  .reverse()
                  .join("");
                replace.push([sliced, temp]);
              }
            } else {
              errors.DATE = `Date in function ${sliced} is missing.`;
            }
            i++;
          }
          i++;
        }
      } catch (error) {
        console.log(error);
        i++;
      }
    } else {
      i++;
    }
  }

  replace.forEach((e) => {
    tekst = tekst.replace(new RegExp(e[0], "i"), " " + e[1] + " ");
  });

  return tekst;
};

module.exports = replaceDateFunctions;
