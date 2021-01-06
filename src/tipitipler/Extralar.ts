import { SortQuery } from "./FireBaseStoreTypes";

type PayloadOfEMail = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

type JsonIterator<T> = {
  [i in keyof T]: T[i];
};

type optStr = "<" | "<=" | "==" | ">" | ">=";

type QueryStringObj = {
  colonOfTable: string;
  query: optStr;
  mustBeData: string | number | any;
};

type QueryArr = {
  and?: QueryStringObj[],
  or?: QueryStringObj[]
}

type ListRoomsQueryParams = {
  queryArr: QueryArr;
  index: number;
  sort: SortQuery[];
  limit: number;
  city?: string;
};

type WriteDataToDBReturn = {
  ok: boolean;
  id: string;
}

// degisiklik

export {
  PayloadOfEMail,
  JsonIterator,
  QueryStringObj,
  optStr,
  ListRoomsQueryParams,
  QueryArr,
  WriteDataToDBReturn
};
