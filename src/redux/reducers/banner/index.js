import { 
    ALL_BANNER,
  } from "../../type/banner";
  
  const initialState = {
    load_banner: true,
    all_banner: [],
  };
  
  export const bannerReducer = (state = initialState, action) => {
    switch (action.type) {
      case ALL_BANNER:
        return {
          ...state,
          load_banner: false,
          all_banner: action.payload.data,
        };
      default:
        return state;
    }
  };
  