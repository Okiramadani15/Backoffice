import { GET_EDUCATIONAL_CALENDAR } from "../../type/educational-calendar";

const initialState = {
  load_calendar: true,
  all_calendar: [],
};

export const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EDUCATIONAL_CALENDAR:
      return {
        ...state,
        load_calendar: false,
        all_calendar: action.payload.data,
      };
    default:
      return state;
  }
};
