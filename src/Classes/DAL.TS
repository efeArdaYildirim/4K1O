import * as admin from "firebase-admin";
import { FireBaseStore } from "../Abstract/FireBaseStore";
import { ListRoomsQueryParams, QueryStringObj } from "../tipitipler/Extralar";
import { SortQuery } from "../tipitipler/FireBaseStoreTypes";
import { Room, Rooms } from "../tipitipler/Room";
import { User } from "../tipitipler/User";

class DAL extends FireBaseStore {
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
  getUserById(id: string): Promise<User> {
    return this.getById({ table: this.tables.users, id }) as Promise<User>;
  }
  //#endregion getUserById

  //#region createUser
  creatUser({ data, id }: any): Promise<boolean> {
    return this.writeAData({ table: this.tables.users, data, id });
  }
  //#endregion createUser

  //#region delUserById
  delUserById(id: string): Promise<boolean | Error> {
    return this.delById({ table: this.tables.users, id });
  }
  //#endregion delUserById

  //#region updateUserById
  updateUserById(id: string, data: JSON): Promise<User> {
    return this.updateById({ table: this.tables.users, id, data }) as Promise<
      User
    >;
  }
  //#endregion updateUserById

  //#region searchUserByNameAndPasswd

  searchUserByEmailAndPasswd(email: string, passwd: string): Promise<User> {
    const queryArr: QueryStringObj[] = [
      { collOfTable: "email", query: "==", mustBeData: email },
      { collOfTable: "passwd", query: "==", mustBeData: passwd },
    ];
    return this.filter({
      table: this.tables.users,
      queryArr,
    }).then((res: any[]) => res[0] as User);
  }

  //#endregion searchUserByNameAndPasswd

  //#region addRoomToCard
  addRoomToCard(userId: string, roomId: string): Promise<Room> {
    const data = { cards: admin.firestore.FieldValue.arrayUnion(roomId) };
    return this.updateById({
      table: this.tables.users,
      id: userId,
      data,
    }) as Promise<Room>;
  }
  //#endregion addRoomToCard

  //#region delRoomToCard
  delRoomToCard(userId: string, roomId: string): Promise<Room> {
    const data = {
      cards: admin.firestore.FieldValue.arrayRemove(roomId),
    };
    return this.updateById({
      table: this.tables.users,
      id: userId,
      data,
    }) as Promise<Room>;
  }
  //#endregion delRoomToCard

  //#endregion userFuncions

  //#region RoomFunctions

  //#region getRoomById
  getRoomById(id: string): Promise<Room> {
    return this.getById({ table: this.tables.rooms, id }) as Promise<Room>;
  }
  //#endregion getRoomById

  //#region createRoom
  createRoom(data: Room): Promise<boolean> {
    return this.writeAData({ table: this.tables.rooms, data });
  }
  //#endregion createRoom

  //#region delRoomById
  delRoomById(id: string): Promise<boolean | Error> {
    return this.delById({ table: this.tables.rooms, id });
  }
  //#endregion delRoomById

  //#region hideRoomById
  hideRoomById(id: string, hide: boolean): Promise<Room> {
    return this.updateById({
      table: this.tables.rooms,
      id,
      data: { hide },
    }) as Promise<Room>;
  }
  //#endregion hideRoomById

  //#region addLikeOrDislikeRoomById
  private dislike(id: string): Promise<Room> {
    const value = admin.firestore.FieldValue.increment(1);
    const data = { dislike: value };
    return this.updateById({ table: this.tables.rooms, id, data }) as Promise<
      Room
    >;
  }

  private like(id: string): Promise<Room> {
    const value = admin.firestore.FieldValue.increment(1);
    const data = { like: value };
    return this.updateById({ table: this.tables.rooms, id, data }) as Promise<
      Room
    >;
  }

  addLikeOrDislikeRoomById(id: string, like: boolean): Promise<Room> {
    if (like) return this.like(id);
    return this.dislike(id);
  }
  //#endregion addLikeOrDislikeRoomById

  //#region upDateRoomById

  upDateRoomById(id: string, data: object): Promise<Room> {
    return this.updateById({ table: this.tables.rooms, id, data }) as Promise<
      Room
    >;
  }

  //#endregion upDateRoomById

  //#region listRoomByRankORCity

  listRoomByRankORCity({
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
    return this.filter({
      table: this.tables.rooms,
      queryArr,
      limit,
      index,
      sort: sortArray,
    }) as Promise<Rooms>;
  }

  //#endregion listRoomByRankORCity

  //#region getMyRooms

  getMyRooms(id: string): Promise<Rooms> {
    const query: QueryStringObj[] = [
      { collOfTable: "owner", query: "==", mustBeData: id },
    ];
    return this.filter({
      table: this.tables.rooms,
      queryArr: query,
    }) as Promise<Rooms>;
  }

  //#endregion getMyRooms

  //#region updateRankById

  updateRankById(id: string, rank: string): Promise<Room> {
    const data = { rank };
    return this.updateById({ table: this.tables.rooms, id, data }) as Promise<
      Room
    >;
  }

  //#endregion updateRankById

  //#endregion RoomFunctions
}
export { DAL };
