import { UseGetAction } from "../../../utils";
import { GET_SEMESTER } from "../../type/semester";


export const getSemester = () => 
    UseGetAction(
        'get-semester',
        GET_SEMESTER,
        undefined,
        false,
    );