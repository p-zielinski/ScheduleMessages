import axios from "axios";

export const fetchData = () => async (dispatch) => {
  let userData = await axios
    .post("/api/get_user_info", { token: localStorage.getItem("token") })
    .then((response) => response.data)
    .catch((error) => error.response.data);
  if (userData.messages !== undefined) {
    userData.messages = userData.messages.reverse();
  }
  if (userData.sending_messages_log !== undefined) {
    userData.sending_messages_log = userData.sending_messages_log.reverse();
  }
  dispatch({
    type: "set_data",
    payload: { userData },
  });
};

export const setTokenAndEmailInStorage = (token, email) => async (dispatch) => {
  dispatch({
    type: "set_token_and_email",
    payload: { token: token, email: email },
  });
};

export const setToken = (token) => async (dispatch) => {
  dispatch({
    type: "set_token",
    payload: { token: token },
  });
};

export const setCountryAndTimezone =
  (default_country, default_tz) => async (dispatch) => {
    dispatch({
      type: "set_country_and_timezone",
      payload: { default_country: default_country, default_tz: default_tz },
    });
  };

export const updateMessagesData = (messages) => async (dispatch) => {
  dispatch({
    type: "set_messages",
    payload: { messages: messages },
  });
};

export const clearScheduleData = () => async (dispatch) => {
  dispatch({
    type: "clear_schedule_data",
  });
};

export const clearData = () => async (dispatch) => {
  dispatch({
    type: "clear_data",
  });
};

export const setContactListInStoreOnly = (contact_list) => async (dispatch) => {
  dispatch({
    type: "set_contact_list_in_store",
    payload: { contact_list: contact_list },
  });
};

export const setContactList = (contact_list, token) => async (dispatch) => {
  const data = await axios
    .post("/api/set_contact_list", {
      token: token,
      contact_list: contact_list,
    })
    .then((response) => response.data)
    .catch((error) => error.response.data);
  if (data.error === undefined) {
    dispatch({
      type: "set_contact_list",
      payload: data,
    });
  } else {
    return 0;
  }
};

export const setName = (name, token) => async (dispatch) => {
  const data = await axios
    .post("/api/set_name", {
      token: token,
      name: name,
    })
    .then((response) => response.data)
    .catch((error) => error.response.data);
  if (data.error === undefined && typeof data !== "string") {
    dispatch({
      type: "set_name",
      payload: data,
    });
  } else {
    return 0;
  }
};
