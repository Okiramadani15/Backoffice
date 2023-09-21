import { CHART } from "../../type";



const initialState = {
    load_dashboard: true,
    chart: [],
  };
  
  export const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
      case CHART:
        return {
          ...state,
          load_dashboard: false,
          chart: action.payload.data,
        };
      default:
        return state;
    }
  };
  