import { 
  DETAIL_USER, 
  GET_ALL_USER 
} from "../../type/user";

const initialState = {
  load_user: true,
  all_user: [],
  detail: [],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USER:
      return {
        ...state,
        load_user: false,
        all_user: action.payload.data,
      };
    case DETAIL_USER:
      return {
        ...state,
        load_user: false,
        detail: action.payload.data,
      };
    default:
      return state;
  }
};
