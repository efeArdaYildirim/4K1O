import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import {
  DBDataParseParams,
  DBDataParseReturnType,
  DelByIdParams,
  FilterFuncParams,
  GetByIdParams,
  IsWidthIdParams,
  UpdateByIdParams,
  WriteADataParams,
} from "../tipitipler/FireBaseStoreTypes";
import { DB } from "../implements/DB";
const FieldValue = firestore.FieldValue;

abstract class FireBaseStore implements DB {
  db!: FirebaseFirestore.Firestore;
  constructor(connectin: any) {
    this.db = connectin;
  }

  //#region DBDataParse

  private isWidthId({ rows, isWidthId = false }: IsWidthIdParams): object[] {
    const out = [];
    if (isWidthId) out.push(rows.data());
    else {
      rows.forEach((row: any) => {
        out.push(row.data());
      });
    }
    return out;
  }
  private isExists(exists: boolean): void {
    if (!exists) throw new Error("veri yok");
  }

  /**
   * firebase fire store den gelen verielri okumak icin yapilmasi gereken ler
   * retun data:json and exists:boolean
   * @param {FirebaseFirestore.DocumentData} dataOfDbResult
   * @param {boolean} shouldIdo paracalamadan dondurur her fonkusiyon if koymama icin
   * @return {json} data
   * @return {boolean} exists
   */
  private async DBDataParse({
    dataOfDbResult,
    shouldIDo = true,
    isWidthId = false,
  }: DBDataParseParams): Promise<DBDataParseReturnType> {
    try {
      if (!shouldIDo) return { data: dataOfDbResult, exists: true };
      const rows = await dataOfDbResult.get();
      this.isExists(rows.exists);
      const out = this.isWidthId({ rows, isWidthId });
      return { data: out, exists: rows.exists };
    } catch (err) {
      functions.logger.error("DBDataParse", {
        err: err.message,
        arguments: { dataOfDbResult, shouldIDo },
      });
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
  async getById({
    table,
    id,
    returnDBQuery = false,
  }: GetByIdParams): Promise<
    JSON | Error | firestore.DocumentReference<firestore.DocumentData>
  > {
    const result = this.db.collection(table).doc(id);
    const { data, exists } = await this.DBDataParse({
      dataOfDbResult: result,
      shouldIDo: !returnDBQuery,
      isWidthId: true,
    });
    if (returnDBQuery) return data;
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
  }: FilterFuncParams): Promise<Object[]> {
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
    const { data, exists } = await this.DBDataParse({
      dataOfDbResult: result,
      shouldIDo: returnDBQuery,
    });
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
  async writeAData({ table, data, id }: WriteADataParams): Promise<boolean> {
    try {
      if (id)
        return (await this.db.collection(table).doc(id).set(data)) && true;
      else return (await this.db.collection(table).add(data)) && true;
    } catch (err) {
      functions.logger.error("writeAData", {
        err: err.message,
        arguments: { table, data, id },
      });
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
  async delById({ table, id }: DelByIdParams): Promise<boolean | Error> {
    try {
      const result: any = await this.getById({ table, id });
      const { data } = await this.DBDataParse(result);
      functions.logger.info("delById", { arguments: { table, id }, data });
      await result.delete();
      return true;
    } catch (err) {
      functions.logger.error("delById", {
        err: err.message,
        arguments: { table, id },
      });
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
  async updateById({
    table,
    id,
    data,
  }: UpdateByIdParams): Promise<Object | Error> {
    try {
      const result: any = await this.getById({
        table,
        id,
        returnDBQuery: true,
      });
      const { data: dataForLog } = await this.DBDataParse({
        dataOfDbResult: result,
        isWidthId: true,
      });
      functions.logger.info("updateById", { dataForLog });
      const updatedData = await result.update({
        ...data,
        timestamp: FieldValue.serverTimestamp(),
      });
      return updatedData;
    } catch (err) {
      functions.logger.error("updteById", {
        err: err.message,
        arguments: { table, id, data },
      });
      throw err;
    }
  }

  //#endregion updateById
}

export { FireBaseStore };
