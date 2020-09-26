import { database } from 'firebase-admin';
import { Cursor, MongoClient, ReplSet, Db, ObjectId } from "mongodb";
import { DB } from '../implements/DB';
import { QueryStringObj } from '../tipitipler/Extralar';
import { FilterFuncParams, WriteADataParams, DelByIdParams, UpdateByIdParams, GetByIdParams, SortQuery } from '../tipitipler/FireBaseStoreTypes';


export class MongoDB implements DB {
  db: MongoClient;
  dbName: string;
  database: Db;

  constructor(name: string = '4k10') {
    this.dbName = name
  }

  async close(): Promise<void> {
    try {
      await this.db.close()
    } catch (error) {
      throw new Error('balanti kapanamadi')
    }
  }

  private async openConnection(): Promise<void> {
    this.db = new MongoClient('mongodb://localhost:27017/', { poolSize: 1000, useUnifiedTopology: true })
    await this.db.connect();
    this.database = this.db.db(this.dbName)
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
      await this.openConnection()
      const collection = this.database.collection(table)
      const cursor = collection.find(query).sort(sortQuery).limit(limit * index).skip(index)
      return await cursor.toArray()
    } finally {
      await this.close()
    }
  }
  async WriteADataToDB({ table, data, id }: WriteADataParams): Promise<Boolean> {
    try {
      await this.openConnection()
      const collection = this.database.collection(table)
      const q: any = {}
      if (id) q['_id'] = id
      const { result } = await collection.insertOne({ ...q, ...data })
      return result.ok === 1
        ? true
        : false
    } finally {
      await this.close()
    }
  }
  async DelById({ table, id }: DelByIdParams): Promise<boolean | Error> {
    try {
      await this.openConnection()
      const collection = this.database.collection(table)
      const { result } = await collection.deleteOne({ "_id": ObjectId(id) })
      if (result.n === 0) throw new Error('no data')
      return result.ok === 1 ? true : false
    } finally {
      await this.close()
    }

  }
  UpdateById({ table, id, data }: UpdateByIdParams): Promise<Object | Error> {
    throw new Error('Method not implemented.');
  }
  async GetById({ table, id, returnDBQuery, }: GetByIdParams): Promise<object | Error> {
    try {
      await this.openConnection()
      const collection = this.database.collection(table)
      const cursor = await collection.findOne({ _id: ObjectId(id) })
      if (cursor === null) throw new Error('no data')
      return cursor
    } finally {
      await this.close()
    }

    throw new Error('Method not implemented.');
  }


}