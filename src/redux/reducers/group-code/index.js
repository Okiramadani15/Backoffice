import { 
  ALL_CODE_WITH_PAGINATION,
  DETAIL_CODE, 
  GET_ALL_CODE 
} from "../../type/group-code";

const initialState = {
  load_code: true,
  all_code: [],
  code_with_pagination: [],
  detail_code: [],
};

export const groupCodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CODE:
      return {
        ...state,
        load_code: false,
        all_code: action.payload.data,
      };
    case ALL_CODE_WITH_PAGINATION:
      return {
        ...state,
        load_code: false,
        code_with_pagination: action.payload.data,
      };
    case DETAIL_CODE:
      return {
        ...state,
        load_code: false,
        detail_code: action.payload.data,
      };
    default:
      return state;
  }
};
