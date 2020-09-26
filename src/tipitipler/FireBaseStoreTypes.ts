import { QueryStringObj } from "./Extralar";

export type SortQuery = { orderBy: string; sortBy: "asc" | "desc" };

export type FilterFuncParams = {
  table: string;
  queryArr: QueryStringObj[];
  limit?: number;
  index?: number;
  sort?: SortQuery[];
  returnDBQuery?: any
};

export type WriteADataParams = {
  table: string;
  data: JSON | object;
  id?: string;
};

export type DBDataParseReturnType = {
  data: any | JSON | JSON[];
  exists: boolean;
};

export type IsWidthIdParams = {
  rows: any;
  isWidthId: boolean;
};

export type DBDataParseParams = {
  dataOfDbResult: FirebaseFirestore.DocumentData;
  shouldIDo?: boolean;
  isWidthId?: boolean;
};

export type GetByIdParams = {
  table: string;
  id: string;
  returnDBQuery?: any
};

export type DelByIdParams = {
  table: string;
  id: string;
};

export type UpdateByIdParams = {
  table: string;
  id: string;
  data: object;
};
