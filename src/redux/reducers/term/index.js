import { 
    GET_TERM_DETAIL,
} from "../../type/term";
  
const initialState = {
  load_term: true,
  all_term_detail: [],
};

export const termReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TERM_DETAIL:
      return {
        ...state,
        load_term: false,
        all_term_detail: action.payload.data,
      };
    default:
      return state;
  }
};
  