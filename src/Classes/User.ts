import { Room } from "../tipitipler/Room";
import { User } from "../tipitipler/User";
import { App } from "./App";
import { DAL } from "./DAL";
import { Validator } from "./Validator";

export class UserClass {
  db: DAL;
  uid: string;
  app: any;
  constructor(dal: DAL) {
    this.db = dal;
    this.uid = "";
    this.app = new App(dal);
  }

  public set setUid(v: any) {
    this.uid = v;
  }
  //#region private
  private userDartaValidte(data: User) {
    new Validator(data)
      .itIsshouldToBeThere([
        "isLandAgent",
        "name",
        "email",
        "password",
        "yearOfBirdth",
      ])
      .maxLength("name", 64)
      .minLength("name", 2)
      .maxWordCoud("name", 4)
      .isEmail("email")
      .minLength("password", 8)
      .maxLength("password", 64)
      .isBoolean("isLandAgent")
      .isNumber("yearOfBirdth");
  }
  //#endregion private
  //#region getMe
  getMe(): Promise<User> {
    return this.db.getUserById(this.uid).then((data) => {
      data.password = "";
      if (data.landAgent) data.landAgent.turkisIdNumber = "";
      return data;
    });
  }
  //#endregion getMe

  //#region delMe

  delMe(): Promise<boolean | Error> {
    return this.db.delUserById(this.uid);
  }

  //#endregion delMe

  //#region updateMe
  updateMe(data: User | any): Promise<User> {
    this.userDartaValidte(data);
    return this.getMe().then((me) => {
      if (me.isLandAgent) {
        delete data.landAgent?.turkisIdNumber;
        delete data.landAgent?.firstName;
        delete data.landAgent?.lastName;
      } else if (!me.isLandAgent && data.isLangAgent && data.landAgent) {
        this.app.turkisIdCheck(data.landAgent);
      }
      data.disabled = true;
      // send mail daha yazilmadi
      delete data.rank;
      return this.db.updateUserById(this.uid, data);
    });
  }
  //#endregion updateMe

  //#region roomAddToCart
  roomAddToCart(roomId: string): Promise<Room> {
    return this.db.addRoomToCard(this.uid, roomId);
  }
  //#endregion roomAddToCart

  //#region roomDelToCart
  roomDelToCart(roomId: string): Promise<Room> {
    return this.db.delRoomToCard(this.uid, roomId);
  }
  //#endregion roomDelToCart

  //#region rankRoom
  rankRoom(roomId: string, like: boolean): Promise<Room> {
    return this.db.addLikeOrDislikeRoomById(roomId, like);
  }
  //#endregion rankRoom
}
