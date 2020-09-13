import { FireBaseStore } from "../Abstract.Classes/FireBaseStore";

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

  //#endregion userFuncions
}
export { DAL };
