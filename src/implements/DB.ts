import { firestore } from "firebase-admin";
import {
  DBDataParseReturnType,
  DelByIdParams,
  FilterFuncParams,
  GetByIdParams,
  UpdateByIdParams,
  WriteADataParams,
} from "../tipitipler/FireBaseStoreTypes";

interface DB {
  /*
  private DBDataParse(
    dataOfDbResult: any,
    shouldIDo: boolean
  ): Promise<DBDataParseReturnType>;*/

  filter({
    table,
    queryArr,
    returnDBQuery,
  }: FilterFuncParams): Promise<Object[]>;
  writeAData({ table, data, id }: WriteADataParams): Promise<Boolean>;
  delById({ table, id }: DelByIdParams): Promise<boolean | Error>;
  updateById({ table, id, data }: UpdateByIdParams): Promise<Object | Error>;

  getById({
    table,
    id,
    returnDBQuery,
  }: GetByIdParams): Promise<
    JSON | Error | firestore.DocumentReference<firestore.DocumentData>
  >;
}

export { DB };
