import { QueryStringObj } from "../tipitipler/Extralar";
import { SortQuery } from "../tipitipler/FireBaseStoreTypes";
import { Room, Rooms } from "../tipitipler/Room";
import { User } from "../tipitipler/User";
import { DAL } from "./DAL";
import { Validator } from "./Validator";

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
    return this.db
      .listRoomByRankORCity({ queryArr, sort, limit, index, city })
      .then((rooms: Rooms) => {
        return rooms.map(async (room: Room | any) => {
          room.ownerData = await this.getUser(room.owner);
        });
      })
      .catch((err) => err);
  }

  getUser(id: string) {
    return this.db.getUserById(id).then((user: User) => {
      const data = new Validator(user).removeAnotherData([
        "password",
        "isLandAgent",
        "birdthDay",
        "landAgent",
      ]).getVal;
      const landAgetnData = new Validator(data.landAgent).removeAnotherData([
        "turkisIdNumber",
      ]).getVal;
      return {
        data,
        landAgetnData,
      };
    });
  }
}
