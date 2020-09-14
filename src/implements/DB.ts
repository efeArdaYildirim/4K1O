import { firestore } from "firebase-admin";
import { FilterFuncParams, WriteAData } from "../tipitipler/FireBaseStoreTypes";

interface DB {
  DBDataParse(dataOfDbResult: any, shouldIDo: boolean): Promise<any>;
  filter({ table, queryArr, returnDBQuery }: FilterFuncParams): Promise<any>;
  writeAData({ table, data, id }: WriteAData): Promise<Boolean>;
  delById(table: string, id: string): Promise<boolean | Error>;
  updateById(table: string, id: string, data: JSON): Promise<any>;
  getById(
    table: string,
    id: string,
    returnDBQuery: boolean
  ): Promise<
    JSON | Error | firestore.DocumentReference<firestore.DocumentData>
  >;
}

export { DB };
