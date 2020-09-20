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

  Filter({
    table,
    queryArr,
    returnDBQuery,
  }: FilterFuncParams): Promise<Object[]>;
  WriteADataToDB({ table, data, id }: WriteADataParams): Promise<Boolean>;
  DelById({ table, id }: DelByIdParams): Promise<boolean | Error>;
  UpdateById({ table, id, data }: UpdateByIdParams): Promise<Object | Error>;

  GetById({
    table,
    id,
    returnDBQuery,
  }: GetByIdParams): Promise<
    JSON | Error | firestore.DocumentReference<firestore.DocumentData>
  >;
}

export { DB };
