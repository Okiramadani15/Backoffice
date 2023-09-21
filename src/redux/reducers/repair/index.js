import { 
    ALL_REPAIR, DETAIL_REPAIR,
  } from "../../type/repair";
    
  const initialState = {
    load_repair: true,
    all_repair: [],
    detail_repair: [],
  };
  
  export const repairReducer = (state = initialState, action) => {
    switch (action.type) {
      case ALL_REPAIR:
        return {
          ...state,
          load_repair: false,
          all_repair: action.payload.data,
        };
      case DETAIL_REPAIR:
        return {
          ...state,
          load_repair: false,
          detail_repair: action.payload.data,
        };
      default:
        return state;
    }
  };
    