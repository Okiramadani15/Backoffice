import { UseGetAction } from "../../../utils/useGetActions";
import { 
    CHART 
} from "../../type";


export const getChart = () => UseGetAction("chart", CHART, undefined);