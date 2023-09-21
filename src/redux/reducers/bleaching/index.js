import { GET_BLEACHING } from "../../type/bleaching";

const initialState = {
  load_bleaching: true,
  get_bleaching: [],
};

export const bleachingReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BLEACHING:
      return {
        ...state,
        load_bleaching: false,
        get_bleaching: action.payload.data,
      };
    default:
      return state;
  }
};
