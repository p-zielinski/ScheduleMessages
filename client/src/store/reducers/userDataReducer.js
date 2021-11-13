const jwt = require("jsonwebtoken");

const initState = {
  token: "",

  password_is_updating: false,

  email: "",
  email_is_updating: false,

  messages: [],
  messages_is_updating: false,

  available_funds: 0,
  available_funds_is_updating: false,

  name: "",
  name_is_updating: false,

  contact_list: [],
  contact_list_is_updating: false,

  default_country: undefined,
  default_tz: undefined,
  default_tz_and_country_is_updating: false,

  sending_messages_log: [],
  sent_earlier: [],
};

const userDataReducer = (state = initState, action) => {
  switch (action.type) {
    case "set_data": {
      if (typeof action.payload.userData !== undefined) {
        state.sending_messages_log =
          action.payload.userData.sending_messages_log;
        state.sent_earlier = action.payload.userData.sent_earlier;
        state.messages = action.payload.userData.messages;
        state.available_funds = action.payload.userData.available_funds;
        state.name = action.payload.userData.name;
        state.contact_list = action.payload.userData.contact_list;
        state.default_country = action.payload.userData.default_country;
        state.default_tz = action.payload.userData.default_tz;
        return { ...state };
      } else {
        return { ...state };
      }
    }
    case "set_token_and_email": {
      if (typeof action.payload.token !== undefined) {
        state.token = action.payload.token;
      } else {
        return { ...state };
      }
      if (typeof action.payload.email !== undefined) {
        state.email = action.payload.email;
        return { ...state };
      } else {
        return { ...state };
      }
    }
    case "set_token": {
      state.token = action.payload.token;
      return { ...state };
    }
    case "set_contact_list_in_store": {
      state.contact_list = action.payload.contact_list;
      return { ...state };
    }
    case "set_country_and_timezone": {
      state.default_country = action.payload.default_country;
      state.default_tz = action.payload.default_tz;
      return { ...state };
    }
    case "set_contact_list": {
      state.contact_list = action.payload.contact_list;
      state.contact_list_is_updating = false;
      return { ...state };
    }
    case "set_contact_list_is_updating": {
      state.contact_list_is_updating = action.payload.contact_list_is_updating;
      return { ...state };
    }
    case "set_name": {
      state.name = action.payload.name;
      state.name_is_updating = false;
      return { ...state };
    }
    case "set_messages": {
      state.messages = action.payload.messages;
      return { ...state };
    }
    case "set_name_is_updating": {
      state.name_is_updating = action.payload.name_is_updating;
      return { ...state };
    }
    case "clear_data": {
      return {};
    }
    default:
      return { ...state };
  }
};

export default userDataReducer;
