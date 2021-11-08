export const setIsSingleTime = (value) => (dispatch) => {
  dispatch({
    type: "set_is_single_time",
    payload: { value: value },
  });
};

export const setDate = (date) => (dispatch) => {
  dispatch({
    type: "set_date",
    payload: { date: date },
  });
};

export const setAt = (time) => (dispatch) => {
  dispatch({
    type: "set_at",
    payload: { at: time },
  });
};

export const setTimezoneDefault = (value) => (dispatch) => {
  dispatch({
    type: "set_timezone_default",
    payload: { saveTimezoneAsDefault: value },
  });
};

export const setCountryAndTimezone = (country, timezone) => (dispatch) => {
  dispatch({
    type: "set_country_and_timezone",
    payload: { country: country, timezone: timezone },
  });
};

export const setCountry = (country) => (dispatch) => {
  dispatch({
    type: "set_country",
    payload: { country: country },
  });
};

export const setTimezone = (timezone) => (dispatch) => {
  dispatch({
    type: "set_timezone",
    payload: { timezone: timezone },
  });
};

export const setRecipientsAndContactToSave =
  (recipients, contactsToSave) => (dispatch) => {
    dispatch({
      type: "set_recipients_and_contacts_to_save",
      payload: { recipients: recipients, contactsToSave: contactsToSave },
    });
  };

export const setMessageBody = (messageBody) => (dispatch) => {
  dispatch({
    type: "set_message_body",
    payload: { messageBody: messageBody },
  });
};

export const setAllowExpensiveCharacters =
  (allowExpensiveCharacters) => (dispatch) => {
    dispatch({
      type: "set_allow_expensive_characters",
      payload: { allowExpensiveCharacters: allowExpensiveCharacters },
    });
  };

export const setTimeRange = (timeRange) => (dispatch) => {
  dispatch({
    type: "set_time_range",
    payload: { timeRange: timeRange },
  });
};

export const setDeliverEvery = (deliverEvery) => (dispatch) => {
  dispatch({
    type: "set_deliver_every",
    payload: { deliverEvery: deliverEvery },
  });
};

export const setWeekDays = (weekDays) => (dispatch) => {
  dispatch({
    type: "set_week_days",
    payload: { weekDays: weekDays.sort() },
  });
};

export const setMonthDays = (monthDays) => (dispatch) => {
  dispatch({
    type: "set_month_days",
    payload: { monthDays: monthDays.sort((a, b) => parseInt(a) - parseInt(b)) },
  });
};

export const setReverseMonth = (value) => (dispatch) => {
  dispatch({
    type: "set_reverse_month",
    payload: { reverseMonth: value },
  });
};

export const setYearDays = (yearDays) => (dispatch) => {
  dispatch({
    type: "set_year_days",
    payload: { yearDays: yearDays },
  });
};
