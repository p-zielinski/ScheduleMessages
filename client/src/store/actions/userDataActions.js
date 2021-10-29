import axios from "axios";

export const fetchData = () => async (dispatch) => {
  let userData = await axios
    .post("/api/get_user_info", { token: localStorage.getItem("token") })
    .then((response) => response.data)
    .catch((error) => error.response.data);
  if (userData.messages !== undefined) {
    userData.messages = userData.messages.reverse();
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
