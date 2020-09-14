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
export { PayloadOfEMail, JsonIterator, QueryStringObj, optStr };
