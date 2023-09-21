import { 
    ALL_WORK_UNIT_WITH_PAGINATION,
    DETAIL_WORK_UNIT, 
    GET_ALL_WORK_UNIT,
  } from "../../type/work-unit";
  
  const initialState = {
    load_work_unit: true,
    all_work_unit: [],
    work_unit_with_pagination: [],
    detail_work_unit: [],
  };
  
  export const workUnitReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ALL_WORK_UNIT:
        return {
          ...state,
          load_work_unit: false,
          all_work_unit: action.payload.data,
        };
      case ALL_WORK_UNIT_WITH_PAGINATION:
        return {
          ...state,
          load_work_unit: false,
          work_unit_with_pagination: action.payload.data,
        };
      case DETAIL_WORK_UNIT:
        return {
          ...state,
          load_work_unit: false,
          detail_work_unit: action.payload.data,
        };
      default:
        return state;
    }
  };
  