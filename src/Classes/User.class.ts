import { User } from "../tipitipler/User";
import { DAL } from "./DAL";

export class UserClass {
  db: DAL;
  uid: string;
  constructor(uid: string) {
    this.db = new DAL();
    this.uid = uid;
  }

  //#region getMe
  getMe(): Promise<User> {
    return this.db
      .getUserById(this.uid)
      .then((data) => {
        data.password = "";
        if (data.langAgent) data.langAgent.turkisIdNumber = "";
        return data;
      })
      .catch((err) => err);
  }
  //#endregion getMe

  //#region delMe

  delMe(): Promise<boolean | Error> {
    return this.db.delUserById(this.uid);
  }

  //#endregion delMe



}
