import { Cursor, MongoClient, ReplSet, Db, ObjectId } from "mongodb";
import { DB } from '../implements/DB';
import { QueryStringObj } from '../tipitipler/Extralar';
import { FilterFuncParams, WriteADataParams, DelByIdParams, UpdateByIdParams, GetByIdParams, SortQuery } from '../tipitipler/FireBaseStoreTypes';


export abstract class MongoDB implements DB {
  db: MongoClient = null as unknown as MongoClient; // type script de this ile basliyan degiskenle baslangicta tanimlanmali oyuzden boyle
  dbName: string;
  database: Db = null as unknown as Db;
  connection: string = 'mongodb://localhost:27017/'

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
    this.db = new MongoClient(this.connection, { poolSize: 20, useUnifiedTopology: true })
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

  MongoQueryFromSingleQuery({ collOfTable, query, mustBeData }: QueryStringObj): object {
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
    if (queryArr.length === 0) return {}
    const MQuery = queryArr.map((q) => {
      return this.MongoQueryFromSingleQuery(q)
    })
    const result: any = {}
    MQuery.forEach((i: any) => {
      for (const j in i) {
        result[j] = i[j]
      }
    })

    return result
  }

  async Filter({ table, queryArr, limit = 50, index = 0, sort = [{ orderBy: 'rank', sortBy: 'asc' }] }: FilterFuncParams): Promise<Object[]> {
    try {
      const query = this.MongoQueryFromQueryStringObjs(queryArr)
      const sortQuery = this.SortQuery(sort)
      await this.openConnection()
      const collection = this.database.collection(table)
      const cursor = collection.find(query).sort(sortQuery).limit(limit * index ? 1 : 0).skip(limit * index)
      return await cursor.toArray()
    } finally {
      await this.close()
    }
  }

  async WriteADataToDB({ table, data, id }: WriteADataParams): Promise<boolean> {
    try {
      await this.openConnection()
      const collection = this.database.collection(table)
      const q: any = {}
      if (id) q['_id'] = id
      const { result } = await collection.insertOne({
        ...q, ...data, createdTime: new Date().toISOString()

      })
      return result.ok === 1
    } finally {
      await this.close()
    }
  }

  async DelById({ table, id }: DelByIdParams): Promise<boolean | Error> {
    try {
      await this.openConnection()
      const collection = this.database.collection(table)
      const { result } = await collection.deleteOne({ "_id": new ObjectId(id) })
      if (result.n === 0) throw new Error('no data')
      return result.ok === 1
    } finally {
      await this.close()
    }

  }

  private isUpdateData(data: object) {
    if (Object.getOwnPropertyNames(data)[0][0] !== '$') return { $set: data }
    return data
  }

  async UpdateById({ table, id, data }: UpdateByIdParams): Promise<Object | Error> {
    try {
      const update = this.isUpdateData(data);
      await this.openConnection()
      const collection = this.database.collection(table)
      const { result } = await collection.updateOne({ _id: new ObjectId(id) }, {
        ...update,
        $currentDate: {
          lastModified: true,
        },
      })
      if (result.nModified === 0) throw new Error('no data')
      return result.ok === 1
    } finally {
      await this.close()
    }
  }

  async GetById({ table, id }: GetByIdParams): Promise<object | Error> {
    try {
      await this.openConnection()
      const collection = this.database.collection(table)
      const cursor = await collection.findOne({ _id: new ObjectId(id) })
      if (cursor === null) throw new Error('no data')
      return cursor
    } finally {
      await this.close()
    }

  }
  /**
   * artirmaa verisi doner.
   * bunun update by id ye data seklinde verilmesi lazim.
   * @param coll verisi degisecek sutun
   * @param inc pozitif yada negtif sayi
   * @retrun update data
   */
  increementData(coll: string, inc: number): object {
    const data: any = {}
    data[coll] = inc
    return { $inc: data }
  }


  async pushData(colum: string, query: string, table: string, id: string): Promise<boolean> {
    const data: any = {}
    data[colum] = query
    await this.openConnection()
    const collection = this.database.collection(table)
    const { result } = await collection.updateOne({ _id: new ObjectId(id) }, { $push: data }) // {},{$pull:{colum:equ}}
    return result.n !== 0
  }

  async pullData(colum: string, query: string, table: string, id: string): Promise<boolean> {
    const data: any = {}
    data[colum] = query
    await this.openConnection()
    const collection = this.database.collection(table)
    const { result } = await collection.updateOne({ _id: new ObjectId(id) }, { $pull: data }) // {},{$pull:{colum:equ}}
    return result.nModified !== 0
  }
}
