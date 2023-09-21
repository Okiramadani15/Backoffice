import { UseGetAction } from "../../../utils/useGetActions";

import { GET_ALL } from "../../type/gender";

export const getAllGender = () => UseGetAction("all-gender", GET_ALL, undefined, false);
