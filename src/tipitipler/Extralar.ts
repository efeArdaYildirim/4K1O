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
  collOfTable: string;
  query: optStr;
  mustBeData: string | number;
};

type QueryArr = {
  and: QueryStringObj[],
  or: QueryStringObj[]
}

type ListRoomsQueryParams = {
  queryArr: QueryStringObj[];
  index: number;
  sort: SortQuery[];
  limit: number;
  city?: string;
};

// degisiklik

export {
  PayloadOfEMail,
  JsonIterator,
  QueryStringObj,
  optStr,
  ListRoomsQueryParams,
  QueryArr
};
