import { DAL } from "./DAL";

export class UserClass {
  db: DAL;
  uid: string;
  constructor(uid: string) {
    this.db = new DAL();
    this.uid = uid;
  }

  //#region getMe
  async getMe() {
    const data = await this.db.getUserById(this.uid);
    data.password = "";
    if (data.langAgent) data.langAgent.turkisIdNumber = "";
    return data;
  }
  //#endregion getMe
}
