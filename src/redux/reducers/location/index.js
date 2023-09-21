import { ALL_LOCATION_WITH_PAGINAITON, DETAIL_LOCATION, GET_ALL_LOCATION } from "../../type/location";

const initialState = {
  load_location: true,
  all_location: [],
  location_with_pagination: [],
  detail: [],
};

export const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_LOCATION:
      return {
        ...state,
        load_location: false,
        all_location: action.payload.data,
      };
    case ALL_LOCATION_WITH_PAGINAITON:
      return {
        ...state,
        load_location: false,
        location_with_pagination: action.payload.data,
      };
    case DETAIL_LOCATION:
      return {
        ...state,
        load_location: false,
        detail: action.payload.data,
      };
    default:
      return state;
  }
};
