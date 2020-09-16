import { firestore } from "firebase-admin";
import {
  DBDataParseReturnType,
  FilterFuncParams,
  WriteAData,
} from "../tipitipler/FireBaseStoreTypes";

interface DB {
  DBDataParse(
    dataOfDbResult: any,
    shouldIDo: boolean
  ): Promise<DBDataParseReturnType>;
  filter({ table, queryArr, returnDBQuery }: FilterFuncParams): Promise<JSON[]>;
  writeAData({ table, data, id }: WriteAData): Promise<Boolean>;
  delById(table: string, id: string): Promise<boolean | Error>;
  updateById(table: string, id: string, data: any): Promise<Object | Error>;

  getById(
    table: string,
    id: string,
    returnDBQuery: boolean
  ): Promise<
    JSON | Error | firestore.DocumentReference<firestore.DocumentData>
  >;
}

export { DB };
