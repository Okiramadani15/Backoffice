import { UseDeleteAction } from "../../../utils/useDeleteAction";
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";
import { UseUpdateAction } from "../../../utils/useUpdateAction";

import { ADD_CONDITION, GET_All, DELETE_CONDITION, DETAIL_CONDITION, UPDATE_CONDITION } from "../../type/condition";

export const getAllCondition = () => UseGetAction("all-condition", GET_All, undefined);

export const addCondition = (data) => UsePostAction("create-condition", ADD_CONDITION, data, undefined, false);

export const deleteCondition = (id) => UseDeleteAction("delete-condition", DELETE_CONDITION, { id: id });

export const detialCondition = (id) => UseGetAction("detail-condition", DETAIL_CONDITION, { id: id });

export const updateCondition = (data) =>
  UseUpdateAction(
    "update-condition",
    UPDATE_CONDITION,
    data,
    undefined
    // {id: id}
  );
