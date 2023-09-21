import { GET_ALL } from "../../type/gender";

const initialState = {
  load_gender: true,
  all_gender: [],
};

export const genderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL:
      return {
        ...state,
        load_gender: false,
        all_gender: action.payload.data,
      };
    default:
      return state;
  }
};
