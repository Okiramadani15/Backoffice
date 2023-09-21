import { UseDeleteAction } from "../../../utils/useDeleteAction";
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";
import { UseUpdateAction } from "../../../utils/useUpdateAction";

import { 
  ADD_POSITION, 
  GET_ALL_POSITION, 
  DELETE_POSITION, 
  DETAIL_POSITION, 
  UPDATE_POSITION, 
  ALL_POSITION_WITH_PAGINATION 
} from "../../type/position";

export const getAllPosition = () => 
  UseGetAction(
    "all-position", 
    GET_ALL_POSITION, 
    undefined,
    false
  );

export const allPositionWithPagination = (page, limit, search) => 
  UseGetAction(
    "all-position-with-pagination", 
    ALL_POSITION_WITH_PAGINATION, 
    {page: page, limit: limit, search: search},
    true
  );

export const addPosition = (data) => UsePostAction("create-position", ADD_POSITION, data, undefined, false);

export const deletePosition = (id) => UseDeleteAction("delete-position", DELETE_POSITION, { id: id });

export const detailPosition = (id) => UseGetAction("detail-position", DETAIL_POSITION, { id: id }, false);

export const updatePosition = (data) =>
  UseUpdateAction(
    "update-position",
    UPDATE_POSITION,
    data,
    undefined
  );
