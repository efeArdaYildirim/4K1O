import { DAL } from "../Classes/DAL";
import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import {
  DBDataParseReturnType,
  FilterFuncParams,
  WriteAData,
} from "../tipitipler/FireBaseStoreTypes";
import { DB } from "../implements/DB";

abstract class FireBaseStore implements DB {
  db!: FirebaseFirestore.Firestore;
  connection!: DAL;
  constructor(connection: firestore.Firestore) {
    this.db = connection;
  }

  //#region DBDataParse
  /**
   * firebase fire store den gelen verielri okumak icin yapilmasi gereken ler
   * retun data:json and exists:boolean
   * @param {FirebaseFirestore.DocumentData} dataOfDbResult
   * @param {boolean} shouldIdo paracalamadan dondurur her fonkusiyon if koymama icin
   * @return {json} data
   * @return {boolean} exists
   */
  async DBDataParse(
    dataOfDbResult: any,
    shouldIDo: boolean = true
  ): Promise<DBDataParseReturnType> {
    try {
      if (!shouldIDo) return { data: dataOfDbResult, exists: true };
      const out: any[] = [];
      const rows = await dataOfDbResult.get();
      rows.forEach((row: any) => {
        out.push(row.data());
      });
      return { data: out, exists: rows.exists };
    } catch (err) {
      functions.logger.error("DBDataParse", { err, arguments });
      throw err;
    }
  }
  //#endregion DBDataPArse

  //#region getById
  /**
   * veritabanindan id ile veri cekmeyi saglar
   * @param {string} table
   * @param {string} id
   */
  async getById(
    table: string,
    id: string,
    returnDBQuery: boolean = true
  ): Promise<
    JSON | Error | firestore.DocumentReference<firestore.DocumentData>
  > {
    const result = this.db.collection(table).doc(id);
    const { data, exists } = await this.DBDataParse(result, returnDBQuery);
    if (exists) return data[0];
    throw new Error("no data");
  }
  //#endregion getById

  //#region filter
  /**
   * komplex queriler kurmani saglar
   * @param {string} table
   * @param {QueryStringObj[]} queryArr
   */
  async filter({
    table,
    queryArr,
    returnDBQuery = false,
    limit,
    index = 0,
    sort,
  }: FilterFuncParams): Promise<JSON[]> {
    const result = this.db.collection(table);
    queryArr.forEach((query) =>
      result.where(query.collOfTable, query.query, query.mustBeData)
    );
    if (limit) {
      result.startAt(index * limit);
      result.limit(limit);
    }
    if (sort) {
      sort.forEach((order) => {
        result.orderBy(order.orderBy, order.sortBy || "desc");
      });
    }
    const { data, exists } = await this.DBDataParse(result, returnDBQuery);
    if (exists) return data;
    throw new Error("no data");
  }
  //#endregion filter

  //#region wiriteAData
  /**
   * table olarak belirtilen table ye data versini yazar.
   * id ile yazilacak ise id verilebilir ama zorunlu deil.
   *
   * @param {WriteAData} // isimlendirilmis degisken alir
   */
  async writeAData({ table, data, id }: WriteAData): Promise<boolean> {
    try {
      if (id)
        return (await this.db.collection(table).doc(id).set(data)) && true;
      else return (await this.db.collection(table).add(data)) && true;
    } catch (err) {
      functions.logger.error("writeAData", { err, arguments });
      return err;
    }
  }

  //#endregion wiriteAData

  //#region delById
  /**
   * tablodaki id ile belirtilen yeri siler
   * @param {string} table
   * @param {string} id
   */
  async delById(table: string, id: string): Promise<boolean | Error> {
    try {
      const result = (await this.getById(
        table,
        id
      )) as firestore.DocumentReference<firestore.DocumentData>;
      await result.delete();
      return true;
    } catch (err) {
      functions.logger.error("delById", { err, arguments });
      return err;
    }
  }
  //#endregion delById

  //#region updateById
  /**
   * tablodaki id ile belirtilen yeri gunceller
   * @param {string} table
   * @param {string} id
   */
  async updateById(table: string, id: string, data: any): Promise<JSON> {
    try {
      let result = await this.getById(table, id, false);
      result = result as firestore.DocumentReference<firestore.DocumentData>;
      const { data: parsedData } = await this.DBDataParse(
        await result.update(data)
      );
      return parsedData[0];
    } catch (err) {
      functions.logger.error("updteById", { err, arguments });
      throw err;
    }
  }

  //#endregion updateById
}

export { FireBaseStore };
