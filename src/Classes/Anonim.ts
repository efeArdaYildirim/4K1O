import { AnonimBaisic } from '../Abstract/AnonimBasic';
import { AnonimFirebase } from "../Abstract/AnonimFirebase";
import { QueryArr, QueryStringObj } from "../tipitipler/Extralar";
import { SortQuery } from "../tipitipler/FireBaseStoreTypes";
import { Room, Rooms } from "../tipitipler/Room";
import { User } from "../tipitipler/User";
import { DAL } from "./DAL";
import { Validator } from "./Validator";

export class Anonim extends AnonimBaisic {
  db: DAL;
  constructor(dal: DAL) {
    super(dal);
    this.db = dal;
  }

  private RoomSearchQueryValidator(queryArr: QueryStringObj[]) {
    new Validator(queryArr)
      .ItIsshouldToBeThere(["colonOfTable", "query", "mustBeData"])
      .MaxLength("colonOfTable", 64)
      .MinLength("colonOfTable", 2)
      .MaxLength("query", 2)
      .MinLength("query", 1)
      .MinLength("mustBeData", 2)
      .MaxLength("mustBeData", 64);
  }
  private GetUserOfRooms(rooms: Rooms) {
    return rooms.map(async (room: Room | any) => {
      room.ownerData = await this.getUser(room.owner);
    });
  }

  SearchRoom(
    sort: SortQuery[],
    queryArr: QueryArr,
    city?: string,
    index: number = 0,
    limit: number = 50
  ): Promise<Rooms> {
    this.RoomSearchQueryValidator(queryArr.and);
    this.RoomSearchQueryValidator(queryArr.or);
    return this.db
      .ListRoomByRankORCityFromDB({ queryArr, sort, limit, index, city })
      .then((rooms: Rooms) => {
        this.GetUserOfRooms(rooms);
      })
      .catch((err) => err);
  }

  private UserDataValidateAndRemove(user: User): User {
    const data = new Validator(user).RemoveAnotherData([
      "password",
      "isLandAgent",
      "yearOfBirdth",
      "landAgent",
    ]).getVal;
    const landAgetnData = new Validator(data.landAgent).RemoveAnotherData([
      "turkisIdNumber",
    ]).getVal;
    return { ...data, ...landAgetnData };
  }

  getUser(id: string): Promise<User> {
    return this.db.GetUserById(id).then((user: User) => {
      return this.UserDataValidateAndRemove(user);
    });
  }
}
