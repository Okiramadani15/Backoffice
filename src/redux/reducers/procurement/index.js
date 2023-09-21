import { 
  DETAIL_PROCUREMENT,
  DOCUMENT_PROCUREMENT,
  GET_PROCUREMENT,
} from "../../type/procurement";
  
const initialState = {
  load_procurement: true,
  all_semester: [],
  detail_procurement: [],
  document_procurement: [],
};

export const procurementReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROCUREMENT:
      return {
        ...state,
        load_procurement: false,
        all_procurement: action.payload.data,
      };
    case DETAIL_PROCUREMENT:
      return {
        ...state,
        load_procurement: false,
        detail_procurement: action.payload.data,
      };
    case DOCUMENT_PROCUREMENT:
      return {
        ...state,
        load_procurement: false,
        document_procurement: action.payload.data,
      };
    default:
      return state;
  }
};
  