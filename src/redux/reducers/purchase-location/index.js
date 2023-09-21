import { 
  ALL_PURCHASE_LOCATION_WITH_PAGINATION,
  DETAIL_PURCHASE_LOCATION, 
  GET_ALL_PURCHASE_LOCATION 
} from "../../type/purchase-location";

const initialState = {
  load_purchase_location: true,
  all_purchase_location: [],
  purchase_location_with_pagination: [],
  detail_purchase_location: [],
};

export const purchaseLocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PURCHASE_LOCATION:
      return {
        ...state,
        load_purchase_location: false,
        all_purchase_location: action.payload.data,
      };
    case ALL_PURCHASE_LOCATION_WITH_PAGINATION:
      return {
        ...state,
        load_purchase_location: false,
        purchase_location_with_pagination: action.payload.data,
      };
    case DETAIL_PURCHASE_LOCATION:
      return {
        ...state,
        load_purchase_location: false,
        detail_purchase_location: action.payload.data,
      };
    default:
      return state;
  }
};
