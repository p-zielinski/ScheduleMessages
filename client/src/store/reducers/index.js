import { combineReducers } from "redux";
import userDataReducer from "./userDataReducer";
import scheduleDataReducer from "./scheduleDataReducer";

const rootReducer = combineReducers({
  userData: userDataReducer,
  scheduleData: scheduleDataReducer,
});

export default rootReducer;
