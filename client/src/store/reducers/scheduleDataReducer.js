const initState = {
  isSingleTime: null,
  date: null,
  deliverEvery: null,
  weekDays: [],
  monthDays: [], //["1st", "15th"],
  reverseMonth: false,
  yearDays: [],
  timeRange: [],
  at: null,
  country: null,
  timezone: null,
  saveTimezoneAsDefault: false,
  recipients: [],
  contactsToSave: [],
  messageBody: "",
  allowExpensiveCharacters: false,
};

const scheduleDataReducer = (state = initState, action) => {
  switch (action.type) {
    case "clear_schedule": {
      return { ...initState };
    }
    case "set_is_single_time": {
      state.isSingleTime = action.payload.value;
      return { ...state };
    }
    case "set_date": {
      state.date = action.payload.date;
      return { ...state };
    }
    case "set_at": {
      state.at = action.payload.at;
      return { ...state };
    }
    case "set_timezone_default": {
      state.saveTimezoneAsDefault = action.payload.saveTimezoneAsDefault;
      return { ...state };
    }
    case "set_country_and_timezone": {
      state.country = action.payload.country;
      state.timezone = action.payload.timezone;
      return { ...state };
    }
    case "set_country": {
      state.country = action.payload.country;
      return { ...state };
    }
    case "set_timezone": {
      state.timezone = action.payload.timezone;
      return { ...state };
    }
    case "set_recipients_and_contacts_to_save": {
      state.recipients = action.payload.recipients;
      state.contactsToSave = action.payload.contactsToSave;
      return { ...state };
    }
    case "set_message_body": {
      state.messageBody = action.payload.messageBody;
      return { ...state };
    }
    case "set_allow_expensive_characters": {
      state.allowExpensiveCharacters = action.payload.allowExpensiveCharacters;
      return { ...state };
    }
    case "set_time_range": {
      state.timeRange = action.payload.timeRange;
      return { ...state };
    }
    case "set_deliver_every": {
      state.deliverEvery = action.payload.deliverEvery;
      return { ...state };
    }
    case "set_week_days": {
      state.weekDays = action.payload.weekDays;
      return { ...state };
    }
    case "set_month_days": {
      state.monthDays = action.payload.monthDays;
      return { ...state };
    }
    case "set_reverse_month": {
      state.reverseMonth = action.payload.reverseMonth;
      return { ...state };
    }
    case "set_year_days": {
      state.yearDays = action.payload.yearDays;
      return { ...state };
    }
    case "clear_schedule_data": {
      return initState;
    }
    default:
      return { ...state };
  }
};

export default scheduleDataReducer;
