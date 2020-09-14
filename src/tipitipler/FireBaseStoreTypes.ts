import { QueryStringObj } from "./Extralar";

type FilterFuncParams = {
  table: string;
  queryArr: QueryStringObj[];
  returnDBQuery?: boolean;
};

type WriteAData = {
  table: string;
  data: JSON | any[];
  id?: string;
};

type DBDataParseReturnType = {
  data: any | JSON;
  exists: boolean;
};

export { FilterFuncParams, WriteAData, DBDataParseReturnType };
