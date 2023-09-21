import { 
    ALL_GALERY,
  } from "../../type/galery";
  
  const initialState = {
    load_galery: true,
    all_galery: [],
  };
  
  export const galeryReducer = (state = initialState, action) => {
    switch (action.type) {
      case ALL_GALERY:
        return {
          ...state,
          load_galery: false,
          all_galery: action.payload.data,
        };
      default:
        return state;
    }
  };
  