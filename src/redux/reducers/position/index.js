import { 
  ALL_POSITION_WITH_PAGINATION,
  DETAIL_POSITION, 
  GET_ALL_POSITION 
} from "../../type/position";

const initialState = {
  load_position: true,
  all_position: [],
  position_with_pagination: [],
  detail: [],
};

export const positionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_POSITION:
      return {
        ...state,
        load_position: false,
        all_position: action.payload.data,
      };
    case ALL_POSITION_WITH_PAGINATION:
      return {
        ...state,
        load_position: false,
        position_with_pagination: action.payload.data,
      };
    case DETAIL_POSITION:
      return {
        ...state,
        load_position: false,
        detail: action.payload.data,
      };
    default:
      return state;
  }
};
