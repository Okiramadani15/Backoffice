
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";

import { 
  ALL_GALERY, 
  UPDATE_GALERY, 
} from "../../type/galery";

export const getAllGalery = () => 
  UseGetAction(
    "galery", 
    ALL_GALERY, 
    undefined,
    false
  );

export const updateGalery = (data) => UsePostAction("galery/update", UPDATE_GALERY, data, undefined, false);
