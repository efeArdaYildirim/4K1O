import { AnonimFirebase } from "../Abstract/AnonimFirebase";
import { QueryStringObj } from "../tipitipler/Extralar";
import { SortQuery } from "../tipitipler/FireBaseStoreTypes";
import { Room, Rooms } from "../tipitipler/Room";
import { User } from "../tipitipler/User";
import { DAL } from "./DAL";
import { Validator } from "./Validator";

export class Anonim extends AnonimFirebase {
  db: DAL;
  constructor(dal: DAL) {
    super(dal);
    this.db = dal;
  }

  searchRoom(
    sort: SortQuery[],
    queryArr: QueryStringObj[],
    city?: string,
    index: number = 0,
    limit: number = 50
  ): Promise<Rooms> {
    new Validator(queryArr)
      .itIsshouldToBeThere(["collOfTable", "query", "mustBeData"])
      .maxLength("collOfTable", 64)
      .minLength("collOfTable", 2)
      .maxLength("query", 2)
      .minLength("query", 1)
      .minLength("mustBeData", 2)
      .maxLength("mustBeData", 64);

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
        "yearOfBirdth",
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
