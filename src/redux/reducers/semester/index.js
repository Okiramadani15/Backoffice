import { 
    GET_SEMESTER,
} from "../../type/semester";
  
const initialState = {
  load_semester: true,
  all_semester: [],
};

export const semesterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SEMESTER:
      return {
        ...state,
        load_semester: false,
        all_semester: action.payload.data,
      };
    default:
      return state;
  }
};
  