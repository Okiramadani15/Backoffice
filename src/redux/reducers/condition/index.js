import { DETAIL_CONDITION, GET_All } from "../../type/condition";

const initialState = {
  load_condition: true,
  all_condition: [],
  detail: [],
};

export const conditionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_All:
      return {
        ...state,
        load_condition: false,
        all_condition: action.payload.data,
      };
    case DETAIL_CONDITION:
      return {
        ...state,
        load_condition: false,
        detail: action.payload.data,
      };
    default:
      return state;
  }
};
