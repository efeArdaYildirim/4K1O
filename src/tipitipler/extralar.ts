type Payload = {
  subject: string;
  text: string;
  html: string;
};

type JsonIter<T> = {
  [i in keyof T]: T[i];
};

type optStr = "<" | "<=" | "==" | ">" | ">=";

type Query = {
  coll: string;
  q: optStr;
  data: string;
};
export { Payload, JsonIter, Query, optStr };
