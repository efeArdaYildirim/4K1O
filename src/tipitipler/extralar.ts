import { SortQuery } from "./FireBaseStoreTypes";

type PayloadOfEMail = {
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
};

export {
  PayloadOfEMail,
  JsonIterator,
  QueryStringObj,
  optStr,
  ListRoomsQueryParams,
};
