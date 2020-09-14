import { User } from "../tipitipler/User";
import { DAL } from "./DAL";

export class UserClass {
  db: DAL;
  uid: string;
  constructor(uid: string, dal: DAL) {
    this.db = dal;
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

  //#region updateMe
  updateMe(data: User | any): Promise<User> {
    return this.getMe()
      .then((me) => {
        if (me.isLangAgent) {
          delete data.langAgent?.turkisIdNumber;
          delete data.langAgent?.firstName;
          delete data.langAgent?.lastName;
        } else if (!me.isLangAgent && data.isLangAgent && data.langAgent) {
          // tc kontrol daha yazilmadi
          if (!true) throw new Error("yanlis tc");
        }
        data.disabled = true;
        // send mail daha yazilmadi
        delete data.rank;
        return this.db.updateUserById(this.uid, data);
      })
      .catch((err) => err);
  }
  //#endregion updateMe
}
