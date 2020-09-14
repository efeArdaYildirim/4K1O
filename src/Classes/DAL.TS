import * as admin from "firebase-admin";
import { FireBaseStore } from "../Abstract.Classes/FireBaseStore";
import { QueryStringObj } from "../tipitipler/Extralar";

class DAL extends FireBaseStore {
  tables: any;

  constructor(conn: any) {
    super(conn!);
    this.tables = {
      users: "users",
      cards: "cards",
    };
  }

  //#region userFuncions

  //#region getUserById
  async getUserById(id: string) {
    return await this.getById(this.tables.users, id);
  }
  //#endregion getUserById

  //#region createUser
  async creatUser({ data, id }: any) {
    return await this.writeAData({ table: this.tables.users, data, id });
  }
  //#endregion createUser

  //#region delUserById
  async delUserById(id: string) {
    return await this.delById(this.tables.users, id);
  }
  //#endregion delUserById

  //#region updateUserById
  async updateUserById(id: string, data: JSON) {
    return await this.updateById(this.tables.users, id, data);
  }
  //#endregion updateUserById

  //#region searchUserByNameAndPasswd

  async searchUserByNameAndPasswd(name: string, passwd: string) {
    const queryArr: QueryStringObj[] = [
      { collOfTable: "name", query: "==", mustBeData: name },
      { collOfTable: "passwd", query: "==", mustBeData: passwd },
    ];
    return await this.filter({ table: this.tables.users, queryArr });
  }

  //#endregion searchUserByNameAndPasswd

  //#region addRoomToCard
  async addRoomToCard(userId: string, roomId: string) {
    return await this.updateById(this.tables.users, userId, {
      cards: admin.firestore.FieldValue.arrayUnion(roomId),
    });
  }
  //#endregion addRoomToCard

  //#region delRoomToCard
  async delRoomToCard(userId: string, roomId: string) {
    return await this.updateById(this.tables.users, userId, {
      cards: admin.firestore.FieldValue.arrayRemove(roomId),
    });
  }
  //#endregion delRoomToCard

  //#endregion userFuncions
}
export { DAL };
