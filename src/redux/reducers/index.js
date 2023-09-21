import { combineReducers } from "redux";
import { authReducer } from "./auth";
import { alertReducer } from "./alert";
import { locationReducer } from "./location";
import { conditionReducer } from "./condition";
import { genderReducer } from "./gender";
import { userReducer } from "./user";
import { positionReducer } from "./position";
import { paginationReducer } from "./pagination";
import { assetReducer } from "./asset";
import { workUnitReducer } from "./work-unit";
import { calendarReducer } from "./educational-calendar";
import { semesterReducer } from "./semester";
import { activityReducer } from "./activity";
import { messageReducer } from "./message";
import { procurementReducer } from "./procurement";
import { termReducer } from "./term";
import { loanReducer } from "./loan";
import { repairReducer } from "./repair";
import { dashboardReducer } from "./dashboard";
import { bleachingReducer } from "./bleaching";
import { groupCodeReducer } from "./group-code";
import { purchaseLocationReducer } from "./purchase-location";
import { galeryReducer } from "./galery";
import { bannerReducer } from "./banner";

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  location: locationReducer,
  condition: conditionReducer,
  gender: genderReducer,
  user: userReducer,
  position: positionReducer,
  pagination: paginationReducer,
  asset: assetReducer,
  work_unit: workUnitReducer,
  calendar: calendarReducer,
  semester: semesterReducer,
  activity: activityReducer,
  message: messageReducer,
  procurement: procurementReducer,
  term: termReducer,
  loan: loanReducer,
  repair: repairReducer,
  dashboard: dashboardReducer,
  bleaching: bleachingReducer,
  groupCode: groupCodeReducer,
  purchaseLocation: purchaseLocationReducer,
  galery: galeryReducer,
  banner: bannerReducer,
});

export default rootReducer;
