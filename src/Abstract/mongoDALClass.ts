import { MongoClient } from "mongodb";
import { DB } from '../implements/DB';
import { QueryStringObj } from '../tipitipler/Extralar';
import { FilterFuncParams, WriteADataParams, DelByIdParams, UpdateByIdParams, GetByIdParams, SortQuery } from '../tipitipler/FireBaseStoreTypes';

class MongoQuery {
  private query: any
  private sort: any
  private limit: any
  private skip: any
  private search: any;
  private include!: object;

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

  MongoQueryFromQueryStringObjs(queryArr: QueryStringObj[]) {
    const query = queryArr.map((q) => {
      return this.MongoQueryFromSingleQuery(q)
    })
    this.query = { $match: query }
    return this
  }

  QueryLimit(index = 1, limit: number) {
    this.limit = { $limit: limit * index }
    this.skip = { $skip: index - 1 }
    return this

  }

  SortQuery(sort: SortQuery[]) {
    const sortQ: any = {}
    sort.forEach((q: SortQuery) => {
      sortQ[q.orderBy] = q.sortBy === 'asc' ? 1 : -1
    });
    this.sort = { $sort: sortQ }
    return this

  }
  Include(data: string[]) {
    const include: any = {}
    data.forEach((item: string) => {
      include[item] = 1
    })
    this.include = { $project: { ...this.include, ...include } }
  }

  Exclude(data: string[]) {
    const exclude: any = {}
    data.forEach((item: string) => {
      exclude[item] = 0
    })
    this.include = { $project: { ...this.include, ...exclude } }
  }

  TextSearch(search: string) {
    this.search = { $text: { $search: search } }
  }

  get data(): object[] {
    return [{ ...this }]
  }
}
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



  async Filter({ table, queryArr, limit = 50, index = 1, sort = [{ orderBy: 'rank', sortBy: 'asc' }] }: FilterFuncParams): Promise<Object[]> {
    try {
      const query = new MongoQuery()
        .MongoQueryFromQueryStringObjs(queryArr)
        .QueryLimit(index, limit)
        .SortQuery(sort)
        .data
      const database = await this.openConnection()
      const collection = database.collection(table)
      const { error, result } = await collection.aggregate(query) as any
      if (error) throw error
      return result
    } finally {
      await this.db.close()
    }
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