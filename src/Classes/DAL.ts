import * as admin from "firebase-admin";
import { FireBaseStore } from "../Abstract/FireBaseStore";
import { MongoDB } from '../Abstract/mongoDALClass';
import { ListRoomsQueryParams, QueryStringObj } from "../tipitipler/Extralar";
import { SortQuery } from "../tipitipler/FireBaseStoreTypes";
import { Room, Rooms } from "../tipitipler/Room";
import { User } from "../tipitipler/User";

class DAL extends MongoDB {
  tables: { users: string; cards: string; rooms: string };

  constructor(connection: any) {
    super(connection);
    this.tables = {
      users: "users",
      cards: "cards",
      rooms: "rooms",
    };
  }

  //#region userFuncions

  //#region getUserById
  GetUserById(id: string): Promise<User> {
    return this.GetById({ table: this.tables.users, id }) as Promise<User>;
  }
  //#endregion getUserById

  //#region createUser
  CreatUserToDB({ data, id }: any): Promise<[boolean, string]> {
    return this.WriteADataToDB({ table: this.tables.users, data, id });
  }
  //#endregion createUser

  //#region delUserById
  DelUserById(id: string): Promise<boolean | Error> {
    return this.DelById({ table: this.tables.users, id });
  }
  //#endregion delUserById

  //#region updateUserById
  UpdateUserById(id: string, data: JSON): Promise<User> {
    return this.UpdateById({ table: this.tables.users, id, data }) as Promise<
      User
    >;
  }
  //#endregion updateUserById

  //#region searchUserByNameAndPasswd

  SearchUserByEmailAndPasswd(email: string, passwd: string): Promise<User> {
    const queryArr: QueryStringObj[] = [
      { collOfTable: "email", query: "==", mustBeData: email },
      { collOfTable: "passwd", query: "==", mustBeData: passwd },
    ];
    return this.Filter({
      table: this.tables.users,
      queryArr,
    }).then((res: any[]) => res[0] as User);
  }

  //#endregion searchUserByNameAndPasswd

  //#region addRoomToCard
  AddRoomToCardWriteToDB(userId: string, roomId: string): Promise<Room> {
    const data = { cards: admin.firestore.FieldValue.arrayUnion(roomId) };
    return this.UpdateById({
      table: this.tables.users,
      id: userId,
      data,
    }) as Promise<Room>;
  }
  //#endregion addRoomToCard

  //#region delRoomToCard
  DelRoomToCardWriteToDB(userId: string, roomId: string): Promise<Room> {
    const data = {
      cards: admin.firestore.FieldValue.arrayRemove(roomId),
    };

    return this.pullData('cards', {})

    return this.UpdateById({
      table: this.tables.users,
      id: userId,
      data,
    }) as Promise<Room>;
  }
  //#endregion delRoomToCard

  //#endregion userFuncions

  //#region RoomFunctions

  //#region getRoomById
  GetRoomById(id: string): Promise<Room> {
    return this.GetById({ table: this.tables.rooms, id }) as Promise<Room>;
  }
  //#endregion getRoomById

  //#region createRoom
  CreateRoomToDB(data: Room): Promise<[boolean, string]> {
    return this.WriteADataToDB({ table: this.tables.rooms, data });
  }
  //#endregion createRoom

  //#region delRoomById
  DelRoomById(id: string): Promise<boolean | Error> {
    return this.DelById({ table: this.tables.rooms, id });
  }
  //#endregion delRoomById

  //#region hideRoomById
  HideRoomById(id: string, hide: boolean): Promise<Room> {
    return this.UpdateById({
      table: this.tables.rooms,
      id,
      data: { hide },
    }) as Promise<Room>;
  }
  //#endregion hideRoomById

  //#region addLikeOrDislikeRoomById
  private Dislike(id: string): Promise<Room> {
    const value = this.increementData('Dislike', 1);
    return this.UpdateById({ table: this.tables.rooms, id, data: value }) as Promise<
      Room
    >;
  }

  private Like(id: string): Promise<Room> {
    const value = this.increementData('Like', 1);
    return this.UpdateById({ table: this.tables.rooms, id, data: value }) as Promise<
      Room
    >;
  }

  AddLikeOrDislikeRoomById(id: string, like: boolean): Promise<Room> {
    if (like) return this.Like(id);
    return this.Dislike(id);
  }
  //#endregion addLikeOrDislikeRoomById

  //#region upDateRoomById

  UpDateRoomById(id: string, data: object): Promise<Room> {
    return this.UpdateById({ table: this.tables.rooms, id, data }) as Promise<
      Room
    >;
  }

  //#endregion upDateRoomById

  //#region listRoomByRankORCity

  ListRoomByRankORCityFromDB({
    queryArr,
    index,
    sort,
    limit,
    city,
  }: ListRoomsQueryParams) {
    if (city) {
      queryArr.push({ collOfTable: "city", query: "==", mustBeData: city });
    }
    const sortArray: SortQuery[] = [
      { orderBy: "rank", sortBy: "desc" },
      ...sort,
    ];
    return this.Filter({
      table: this.tables.rooms,
      queryArr,
      limit,
      index,
      sort: sortArray,
    }) as Promise<Rooms>;
  }

  //#endregion listRoomByRankORCity

  //#region getMyRooms

  GetMyRoomsFromDB(id: string): Promise<Rooms> {
    const query: QueryStringObj[] = [
      { collOfTable: "owner", query: "==", mustBeData: id },
    ];
    return this.Filter({
      table: this.tables.rooms,
      queryArr: query,
    }) as Promise<Rooms>;
  }

  //#endregion getMyRooms

  //#region updateRankById

  UpdateRankById(id: string, rank: string): Promise<Room> {
    const data = { rank };
    return this.UpdateById({ table: this.tables.rooms, id, data }) as Promise<
      Room
    >;
  }

  //#endregion updateRankById

  //#endregion RoomFunctions
}
export { DAL };
