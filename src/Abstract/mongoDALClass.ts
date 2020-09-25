import { database } from 'firebase-admin';
import { Cursor, MongoClient, ReplSet } from "mongodb";
import { DB } from '../implements/DB';
import { QueryStringObj } from '../tipitipler/Extralar';
import { FilterFuncParams, WriteADataParams, DelByIdParams, UpdateByIdParams, GetByIdParams, SortQuery } from '../tipitipler/FireBaseStoreTypes';


export class MongoDB implements DB {
  db: MongoClient;
  dbName: string;

  constructor(name: string = '4k10') {
    this.dbName = name
  }

  async close(): Promise<any> {
    return this.db.close()
  }

  private async openConnection() {
    this.db = new MongoClient('mongodb://localhost:27017/', { poolSize: 1000, useUnifiedTopology: true })
    await this.db.connect();
    return this.db.db(this.dbName)
  }

  SortQuery(sort: SortQuery[]) {
    const sortQ: any = {}
    sort.forEach((q: SortQuery) => {
      sortQ[q.orderBy] = q.sortBy === 'asc' ? 1 : -1
    });
    return sortQ

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

  MongoQueryFromQueryStringObjs(queryArr: QueryStringObj[]): object {
    const MQuery = queryArr.map((q) => {
      return this.MongoQueryFromSingleQuery(q)
    })
    const result: any = {}
    for (const i of MQuery) {
      for (const j in i) {
        result[j] = i[j]
      }
    }
    return result
  }

  async Filter({ table, queryArr, limit = 50, index = 1, sort = [{ orderBy: 'rank', sortBy: 'asc' }] }: FilterFuncParams): Promise<Object[]> {
    try {
      const query = this.MongoQueryFromQueryStringObjs(queryArr)
      const sortQuery = this.SortQuery(sort)
      const database = await this.openConnection()
      const collection = database.collection(table)
      const cursor = collection.find(query).sort(sortQuery).limit(limit * index).skip(index)
      // const cursor = collection.find({});
      return await cursor.toArray()
    } finally {
      this.db.close().then(res => console.log).catch(err => console.error)
    }
  }
  async WriteADataToDB({ table, data, id }: WriteADataParams): Promise<Boolean> {
    try {
      const database = await this.openConnection()
      const collection = database.collection(table)
      const q: any = {}
      if (id) q['_id'] = id
      const { result } = await collection.insertOne({ ...q, ...data })
      return result.ok === 1
        ? true
        : false
    } finally {
      this.db.close().then(res => console.log).catch(err => console.error)
    }
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
