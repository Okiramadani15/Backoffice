import { 
    COUNT_MESSAGE,
    GET_ALL_MESSAGE
 } from "../../type/message";

const initialState = {
  load_message: true,
  all_message: [],
  count_message: [],
};

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_MESSAGE:
      return {
        ...state,
        load_message: false,
        all_message: action.payload.data,
      };
    case COUNT_MESSAGE:
      return {
        ...state,
        load_message: false,
        count_message: action.payload.data,
      };
    default:
      return state;
  }
};
