import { QueryStringObj } from "./Extralar";

type FilterFuncParams = {
  table: string;
  queryArr: QueryStringObj[];
  returnDBQuery: boolean;
};

type WriteAData = {
  table: string;
  data: JSON | any[];
  id?: string;
};

export { FilterFuncParams, WriteAData };
