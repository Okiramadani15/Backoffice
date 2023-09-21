import { UseDeleteAction } from "../../../utils/useDeleteAction";
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";
import { UseUpdateAction } from "../../../utils/useUpdateAction";

import { 
  ADD_PURCHASE_LOCATION, 
  GET_ALL_PURCHASE_LOCATION, 
  DELETE_PURCHASE_LOCATION, 
  DETAIL_PURCHASE_LOCATION, 
  UPDATE_PURCHASE_LOCATION, 
  ALL_PURCHASE_LOCATION_WITH_PAGINATION 
} from "../../type/purchase-location";

export const getAllPurchaseLocation = () => 
  UseGetAction(
    "purchase-location/all", 
    GET_ALL_PURCHASE_LOCATION, 
    undefined,
    false
  );

export const allPurchaseLocationWithPagination = (page, limit, search) => 
  UseGetAction(
    "purchase-location/pagination", 
    ALL_PURCHASE_LOCATION_WITH_PAGINATION, 
    {page: page, limit: limit, search: search},
    true
  );

export const addPurchaseLocation = (data) => UsePostAction("purchase-location/create", ADD_PURCHASE_LOCATION, data, undefined, false);

export const deletePurchaseLocation = (id) => UseDeleteAction("purchase-location/delete", DELETE_PURCHASE_LOCATION, { id: id });

export const detailPurchaseLocation = (id) => UseGetAction("purchase-location/detail", DETAIL_PURCHASE_LOCATION, { id: id }, false);

export const updatePurchaseLocation = (data) =>
  UseUpdateAction(
    "purchase-location/update",
    UPDATE_PURCHASE_LOCATION,
    data,
    undefined
  );
