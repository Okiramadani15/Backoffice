import { 
    DETAIL_LOAN,
    GET_LOAN
} from "../../type/loan";

const initialState = {
  load_loan: true,
  all_loan: [],
  detail_loan: [],
};

export const loanReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOAN:
      return {
        ...state,
        load_loan: false,
        all_loan: action.payload.data,
      };
    case DETAIL_LOAN:
      return {
        ...state,
        load_loan: false,
        detail_loan: action.payload.data,
      };
    default:
      return state;
  }
};
