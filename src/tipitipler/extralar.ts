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
  mustBeData: string;
};

type ListRoomsQueryParams = {
  queryArr: QueryStringObj[];
  index: number;
  sort: SortQuery[];
  limit: number;
  city?: string;
};

export {
  PayloadOfEMail,
  JsonIterator,
  QueryStringObj,
  optStr,
  ListRoomsQueryParams,
};
