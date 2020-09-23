import { MongoClient } from "mongodb";
import { DB } from '../implements/DB';
import { QueryStringObj } from '../tipitipler/Extralar';
import { FilterFuncParams, WriteADataParams, DelByIdParams, UpdateByIdParams, GetByIdParams } from '../tipitipler/FireBaseStoreTypes';

export abstract class MongoDB implements DB {
  db: MongoClient;
  dbName: string;

  constructor(connection: any, name: string) {
    this.db = connection
    this.dbName = name
  }

  private async openConnection() {
    await this.db.connect();
    return this.db.db(this.dbName)
  }

  private MongoQueryFromSingleQuery({ collOfTable, query, mustBeData }: QueryStringObj): object {
    const mongoQuery: any = {};
    switch (query) {
      case '==':
        mongoQuery[collOfTable] = mustBeData
        break
      case '<':
        mongoQuery[collOfTable] = { $lt: mustBeData }
        break;
      case '<=':
        mongoQuery[collOfTable] = { $lte: mustBeData }
        break;
      case '>':
        mongoQuery[collOfTable] = { $gt: mustBeData }
        break;
      case '>=':
        mongoQuery[collOfTable] = { $gte: mustBeData }
        break
      default:
        throw new Error('bu query degil')
    }
    return mongoQuery
  }

  private MongoQueryFromQueryStringObjs(queryArr: QueryStringObj[]): object[] {
    return queryArr.map((q) => {
      return this.MongoQueryFromSingleQuery(q)
    })
  }

  Filter({ table, queryArr, returnDBQuery, }: FilterFuncParams): Promise<Object[]> {
    throw new Error('Method not implemented.');
  }
  WriteADataToDB({ table, data, id }: WriteADataParams): Promise<Boolean> {
    throw new Error('Method not implemented.');
  }
  DelById({ table, id }: DelByIdParams): Promise<boolean | Error> {
    throw new Error('Method not implemented.');
  }
  UpdateById({ table, id, data }: UpdateByIdParams): Promise<Object | Error> {
    throw new Error('Method not implemented.');
  }
  GetById({ table, id, returnDBQuery, }: GetByIdParams): Promise<JSON | FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | Error> {
    throw new Error('Method not implemented.');
  }


}