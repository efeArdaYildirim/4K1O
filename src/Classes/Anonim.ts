import { QueryStringObj } from "../tipitipler/Extralar";
import { SortQuery } from "../tipitipler/FireBaseStoreTypes";
import { Rooms } from "../tipitipler/Room";
import { DAL } from "./DAL";

export class Anonim {
  db: DAL;
  constructor(dal: DAL) {
    this.db = dal;
  }

  searchRoom(
    sort: SortQuery[],
    queryArr: QueryStringObj[],
    city?: string,
    index: number = 0,
    limit: number = 50
  ): Promise<Rooms> {
    return this.db.listRoomByRankORCity({ queryArr, sort, limit, index, city });
  }
}
