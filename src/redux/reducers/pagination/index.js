import { SET_PAGINATION } from "../../type";

const initialState = {
    load_pagination: true,
    pagination: [],
};

export const paginationReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_PAGINATION:
        return {
          ...state,
          load_pagination: false,
          pagination: action.payload.data,
        };
      default:
        return state;
    }
  };