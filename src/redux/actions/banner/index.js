
import { UseGetAction } from "../../../utils/useGetActions";
import { UsePostAction } from "../../../utils/usePostAction";

import { 
  ALL_BANNER, 
  UPDATE_BANNER, 
} from "../../type/banner";

export const getAllBanner = () => 
  UseGetAction(
    "banner", 
    ALL_BANNER, 
    undefined,
    false
  );

export const updateBanner = (data) => UsePostAction("banner/update", UPDATE_BANNER, data, undefined, false);
