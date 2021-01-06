import { Cursor, MongoClient, ReplSet, Db, ObjectId } from "mongodb";
import { DB } from '../implements/DB';
import { QueryStringObj, QueryArr } from '../tipitipler/Extralar';
import { FilterFuncParams, WriteADataParams, DelByIdParams, UpdateByIdParams, GetByIdParams, SortQuery } from '../tipitipler/FireBaseStoreTypes';


export abstract class MongoDB implements DB {
  db: MongoClient = null as unknown as MongoClient; // type script de this ile basliyan degiskenle baslangicta tanimlanmali oyuzden boyle
  dbName: string;
  database: Db = null as unknown as Db;
  connection: string = 'mongodb://localhost:27017/'

  constructor(name: string = '4k10') {
    this.dbName = name
  }

  async Close(): Promise<void> {
    try {
      await this.db.close()
    } catch (error) {
      throw new Error('balanti kapanamadi')
    }
  }

  async OpenConnection(): Promise<void> {
    if (this.db.isConnected) return;
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

  MongoQueryFromSingleQuery({ colonOfTable, query, mustBeData }: QueryStringObj): object {
    const mongoQuery: any = {};
    switch (query) {
      case '==':
        mongoQuery[colonOfTable] = mustBeData
        break
      case '<':
        mongoQuery[colonOfTable] = { $lt: mustBeData }
        break;
      case '<=':
        mongoQuery[colonOfTable] = { $lte: mustBeData }
        break;
      case '>':
        mongoQuery[colonOfTable] = { $gt: mustBeData }
        break;
      case '>=':
        mongoQuery[colonOfTable] = { $gte: mustBeData }
        break
      default:
        throw new Error('bu query degil')
    }
    return mongoQuery
  }

  private PrepareQuery(queryArr: QueryStringObj[]) {
    if (queryArr == undefined || queryArr.length === 0) return []
    return queryArr.map((q) => {
      return this.MongoQueryFromSingleQuery(q)
    })
  }

  private MergeQueryArr(query) {
    // if (query.length == 0) return null
    const result: any = {}
    query.forEach((i: any) => {
      for (const j in i) {
        result[j] = i[j]
      }
    })
    return result
  }

  MongoQueryFromQueryStringObjs(queryArr: QueryArr): object {
    const andQuery = queryArr.and && this.PrepareQuery(queryArr.and) || null
    const or = queryArr.or && this.PrepareQuery(queryArr.or) || null
    let and = andQuery && this.MergeQueryArr(andQuery);

    const result = {
      ...and,
    }
    if (or != null) result['$or'] = or;
    return result
  }

  // queriyi filtereleme yazirla google reanslate komplex cu:mle do:ndu:
  private PrepareQuerForFiltering(sort, queryArr) {
    const query = this.MongoQueryFromQueryStringObjs(queryArr)
    const sortQuery = this.SortQuery(sort)
    return [query, sortQuery]
  }

  private IdsToString(cursorArr) {
    return cursorArr.map((row) => {
      row._id = row._id.toString()
      return row
    })
  }

  async Filter({ table, queryArr, limit = 50, index = 0, sort = [{ orderBy: 'rank', sortBy: 'asc' }] }: FilterFuncParams): Promise<Object[]> {
    try {
      const [query, sortQuery] = this.PrepareQuerForFiltering(sort, queryArr)
      await this.OpenConnection()
      const collection = this.database.collection(table)
      const cursor = collection.find(query).sort(sortQuery).limit(limit * (index + 1)).skip(index)
      let result = await cursor.toArray()
      return await this.IdsToString(result)
    } finally {
      await this.Close()
    }
  }

  async WriteADataToDB({ table, data, id }: WriteADataParams) {
    try {
      await this.OpenConnection()
      const collection = this.database.collection(table)
      const q: any = {}

      if (typeof id == 'string') q['_id'] = new ObjectId(id)
      const { result, insertedId } = await collection.insertOne({
        ...q, ...data,
      })
      return { ok: result.ok === 1, id: insertedId.toString() }
    } finally {
      await this.Close()
    }
  }

  async DelById({ table, id }: DelByIdParams): Promise<boolean | Error> {
    try {
      await this.OpenConnection()
      const collection = this.database.collection(table)
      const { result } = await collection.deleteOne({ "_id": new ObjectId(id) })
      if (result.n === 0) throw new Error('no data')
      return result.ok === 1 && result.n > 0
    } finally {
      await this.Close()
    }
  }

  SetUpdateData(data: object) {
    if (Object.getOwnPropertyNames(data)[0][0] !== '$') return { $set: data }
    return data
  }

  async UpdateById({ table, id, data }: UpdateByIdParams): Promise<boolean> {
    try {
      const update = this.SetUpdateData(data);
      await this.OpenConnection()
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
      await this.Close()
    }
  }

  async GetById({ table, id }: GetByIdParams): Promise<object | Error> {
    try {
      await this.OpenConnection()
      const collection = this.database.collection(table)
      const cursor = await collection.findOne({ _id: new ObjectId(id) })
      if (cursor === null) throw new Error('no data')
      cursor._id = cursor._id.toString()
      return cursor
    } finally {
      await this.Close()
    }

  }
  /**
   * artirmaa verisi doner.
   * bunun update by id ye data seklinde verilmesi lazim.
   * @param colon verisi degisecek sutun
   * @param inc pozitif yada negtif sayi
   * @retrun update data
   */
  IncreementData(colon: string, inc: number): object {
    const data: any = {}
    data[colon] = inc
    return { $inc: data }
  }

  /** 
     * udate iselmi ile listerden veri ekler 
     * {a:[1,2]}
     * {a:[1,2,3]}
    */
  async PushData(colon: string, data: string | number, table: string, id: string): Promise<boolean> {
    try {

      const query: any = {}
      query[colon] = data
      await this.OpenConnection()
      const collection = this.database.collection(table)
      const { result } = await collection.updateOne({ _id: new ObjectId(id) }, { $push: query }) // {},{$push:{colon:equ}}
      return result.n !== 0
    } finally {
      this.Close()
    }
  }


  /** 
   * udate iselmi ile listerden veri siler 
   * {a:[1,2,3]}
   * {a:[1,2]}
  */
  async PullData(colon: string, data: string | number, table: string, id: string): Promise<boolean> {
    try {

      const query: any = {}
      query[colon] = data
      await this.OpenConnection()
      const collection = this.database.collection(table)
      const { result } = await collection.updateOne({ _id: new ObjectId(id) }, { $pull: query }) // {},{$pull:{colon:equ}}
      return result.nModified !== 0
    } finally {
      this.Close()
    }
  }
}
