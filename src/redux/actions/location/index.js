import { UseDeleteAction } from "../../../utils/useDeleteAction";
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";
import { UseUpdateAction } from "../../../utils/useUpdateAction";

import { 
  ADD_LOCATION, 
  GET_ALL_LOCATION, 
  DELETE_LOCATION, 
  DETAIL_LOCATION, 
  UPDATE_LOCATION,
  ALL_LOCATION_WITH_PAGINAITON,
} from "../../type/location";

export const getAllLocation = () => UseGetAction(
  "all-location", 
  GET_ALL_LOCATION, 
  undefined,
  false
);

export const allLocationWithPagination = (page, limit, search) => UseGetAction(
  "location-with-pagination", 
  ALL_LOCATION_WITH_PAGINAITON, 
  {page: page, limit: limit, search: search},
  true
);

export const addLocation = (data) => UsePostAction("create-location", ADD_LOCATION, data, undefined, false);

export const deleteLocation = (id) => UseDeleteAction("delete-location", DELETE_LOCATION, { id: id });

export const detialLocation = (id) => UseGetAction("get-detail", DETAIL_LOCATION, { id: id }, false);

export const updateLocation = (data) =>
  UseUpdateAction(
    "update-location",
    UPDATE_LOCATION,
    data,
    undefined
  );
