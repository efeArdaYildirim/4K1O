import { QueryStringObj } from "./Extralar";

type SortQuery = { orderBy: string; sortBy: "asc" | "desc" };

type FilterFuncParams = {
  table: string;
  queryArr: QueryStringObj[];
  returnDBQuery?: boolean;
  limit?: number;
  index?: number;
  sort?: SortQuery[];
};

type WriteAData = {
  table: string;
  data: JSON | any[];
  id?: string;
};

type DBDataParseReturnType = {
  data: any | JSON | JSON[];
  exists: boolean;
};

export { FilterFuncParams, WriteAData, DBDataParseReturnType, SortQuery };
