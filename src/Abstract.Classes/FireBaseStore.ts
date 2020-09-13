// import { DB } from "../ikiyuzluler/DB";
import { Query } from "../tipitipler/extralar";
import { DAL } from "../Classes/DAL";
import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";

type FilterFuncParams = {
  table: string;
  queryArr: Query[];
  returnDBQuery: boolean;
};

type WriteAData = {
  table: string;
  data: JSON | any[];
  id?: string;
};

abstract class FireBaseStore /*implements DB*/ {
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
  ): Promise<any> {
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
    if (exists) return data;
    throw new Error("veri yok");
  }
  //#endregion getById

  //#region filter
  /**
   * komplex queriler kurmani saglar
   * @param {string} table
   * @param {Query[]} queryArr
   */
  async filter({
    table,
    queryArr,
    returnDBQuery,
  }: FilterFuncParams): Promise<any> {
    const result = this.db.collection(table);
    queryArr.forEach((query) => result.where(query.coll, query.q, query.data));
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
  async writeAData({ table, data, id }: WriteAData): Promise<Boolean> {
    try {
      if (id)
        return (await this.db.collection(table).doc(id).set(data)) && true;
      else return (await this.db.collection(table).add(data)) && true;
    } catch (err) {
      functions.logger.error("writeAData", { err, arguments });
      return err;
    }
  }

  //#endregion iteAData

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
        id,
        false
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
  async updateById(table: string, id: string, data: JSON): Promise<any> {
    try {
      let result = await this.getById(table, id, false);
      result = result as firestore.DocumentReference<firestore.DocumentData>;
      return this.DBDataParse(await result.update(data));
    } catch (err) {
      functions.logger.error("updteById", { err, arguments });
      throw err;
    }
  }

  //#endregion updateById
}

export { FireBaseStore };