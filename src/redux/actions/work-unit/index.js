import { UseDeleteAction } from "../../../utils/useDeleteAction";
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";
import { UseUpdateAction } from "../../../utils/useUpdateAction";

import { 
  CREATE_WORK_UNIT, 
  GET_ALL_WORK_UNIT ,
  DELETE_WORK_UNIT, 
  DETAIL_WORK_UNIT, 
  UPDATE_WORK_UNIT, 
  ALL_WORK_UNIT_WITH_PAGINATION, 
} from "../../type/work-unit";

export const getAllWorkUnit = () => 
  UseGetAction(
    "all-work-unit", 
    GET_ALL_WORK_UNIT, 
    undefined,
    false
  );

export const allWorkUnitWithPagination = (page, limit, search) => 
  UseGetAction(
    "all-work-unit-with-pagination", 
    ALL_WORK_UNIT_WITH_PAGINATION, 
    {page: page, limit: limit, search: search},
    true
  );

export const createWorkUnit = (data) => UsePostAction("create-work-unit", CREATE_WORK_UNIT, data, undefined, false);

export const deleteWorkUnit = (id) => UseDeleteAction("delete-work-unit", DELETE_WORK_UNIT, { id: id });

export const detailWorkUnit = (id) => UseGetAction("detail-work-unit", DETAIL_WORK_UNIT, { id: id }, false);

export const updateWorkUnit = (data) =>
  UseUpdateAction(
    "update-work-unit",
    UPDATE_WORK_UNIT,
    data,
    undefined
  );
