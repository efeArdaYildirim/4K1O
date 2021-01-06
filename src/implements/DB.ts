import { firestore } from "firebase-admin";
import {
  DBDataParseReturnType,
  DelByIdParams,
  FilterFuncParams,
  GetByIdParams,
  UpdateByIdParams,
  WriteADataParams,
} from "../tipitipler/FireBaseStoreTypes";
import { WriteDataToDBReturn } from '../tipitipler/Extralar';
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
  WriteADataToDB({ table, data, id }: WriteADataParams): Promise<WriteDataToDBReturn>;
  DelById({ table, id }: DelByIdParams): Promise<boolean | Error>;
  UpdateById({ table, id, data }: UpdateByIdParams): Promise<Object | Error>;

  GetById({
    table,
    id,
    returnDBQuery,
  }: GetByIdParams): Promise<object | Error>
}

export { DB };
