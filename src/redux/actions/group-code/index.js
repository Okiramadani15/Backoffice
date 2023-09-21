import { UseDeleteAction } from "../../../utils/useDeleteAction";
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";
import { UseUpdateAction } from "../../../utils/useUpdateAction";

import { 
  ADD_CODE, 
  GET_ALL_CODE, 
  DELETE_CODE, 
  DETAIL_CODE, 
  UPDATE_CODE, 
  ALL_CODE_WITH_PAGINATION 
} from "../../type/group-code";

export const getAllCode = () => 
  UseGetAction(
    "group-code/all", 
    GET_ALL_CODE, 
    undefined,
    false
  );

export const allCodeWithPagination = (page, limit, search) => 
  UseGetAction(
    "group-code/pagination", 
    ALL_CODE_WITH_PAGINATION, 
    {page: page, limit: limit, search: search},
    true
  );

export const addCode = (data) => UsePostAction("group-code/create", ADD_CODE, data, undefined, false);

export const deleteCode = (id) => UseDeleteAction("group-code/delete", DELETE_CODE, { id: id });

export const detailCode = (id) => UseGetAction("group-code/detail", DETAIL_CODE, { id: id }, false);

export const updateCode = (data) =>
  UseUpdateAction(
    "group-code/update",
    UPDATE_CODE,
    data,
    undefined
  );
