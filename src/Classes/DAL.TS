import * as admin from "firebase-admin";
import { FireBaseStore } from "../Abstract.Classes/FireBaseStore";
import { QueryStringObj } from "../tipitipler/Extralar";
import { DBDataParseReturnType } from "../tipitipler/FireBaseStoreTypes";
import { Room } from "../tipitipler/Room";
import { User } from "../tipitipler/User";

class DAL extends FireBaseStore {
  tables: { users: string; cards: string; rooms: string };

  constructor(conn: any) {
    super(conn!);
    this.tables = {
      users: "users",
      cards: "cards",
      rooms: "rooms",
    };
  }

  //#region userFuncions

  //#region getUserById
  getUserById(id: string): Promise<User> {
    return (this.getById(this.tables.users, id) as unknown) as Promise<User>;
  }
  //#endregion getUserById

  //#region createUser
  creatUser({ data, id }: any): Promise<boolean> {
    return this.writeAData({ table: this.tables.users, data, id });
  }
  //#endregion createUser

  //#region delUserById
  delUserById(id: string): Promise<boolean | Error> {
    return this.delById(this.tables.users, id);
  }
  //#endregion delUserById

  //#region updateUserById
  updateUserById(id: string, data: JSON): Promise<User> {
    return this.updateById(this.tables.users, id, data) as Promise<User>;
  }
  //#endregion updateUserById

  //#region searchUserByNameAndPasswd

  searchUserByNameAndPasswd(name: string, passwd: string): Promise<User> {
    const queryArr: QueryStringObj[] = [
      { collOfTable: "name", query: "==", mustBeData: name },
      { collOfTable: "passwd", query: "==", mustBeData: passwd },
    ];
    return this.filter({ table: this.tables.users, queryArr }) as Promise<User>;
  }

  //#endregion searchUserByNameAndPasswd

  //#region addRoomToCard
  addRoomToCard(userId: string, roomId: string): Promise<Room> {
    return this.updateById(this.tables.users, userId, {
      cards: admin.firestore.FieldValue.arrayUnion(roomId),
    }) as Promise<Room>;
  }
  //#endregion addRoomToCard

  //#region delRoomToCard
  delRoomToCard(userId: string, roomId: string): Promise<Room> {
    return this.updateById(this.tables.users, userId, {
      cards: admin.firestore.FieldValue.arrayRemove(roomId),
    }) as Promise<Room>;
  }
  //#endregion delRoomToCard

  //#endregion userFuncions

  //#region RoomFunctions

  //#region getRoomById
  getRoomById(id: string): Promise<Room> {
    return this.getById(this.tables.rooms, id) as Promise<Room>;
  }
  //#endregion getRoomById

  //#region createRoom
  createRoom(data: Room): Promise<boolean> {
    return this.writeAData({ table: this.tables.rooms, data });
  }
  //#endregion createRoom

  //#region delRoomById
  delRoomById(id: string): Promise<boolean | Error> {
    return this.delById(this.tables.rooms, id);
  }
  //#endregion delRoomById

  //#region hideRoomById
  hideRoomById(id: string, hide: boolean): Promise<Room> {
    return this.updateById(this.tables.rooms, id, { hide }) as Promise<Room>;
  }
  //#endregion hideRoomById

  //#region addLikeRoomById
  addLikeOrDislikeRoomById(id: string, like: boolean): Promise<Room> {
    let value: any;
    if (like) value = admin.firestore.FieldValue.increment(1);
    else value = admin.firestore.FieldValue.increment(-1);
    return this.updateById(this.tables.rooms, id, { like: value }) as Promise<
      Room
    >;
  }
  //#endregion addLikeRoomById

  //#region upDateRoomById

  upDateRoomById() {}

  //#endregion upDateRoomById

  //#endregion RoomFunctions
}
export { DAL };
