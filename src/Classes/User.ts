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

  set setUid(v: string) {
    this.uid = v;
  }
  //#region private

  AmIauth() {
    if (this.uid) throw new Error("login degilsin");
    this.GetMeFromUser()
      .then((me) => me)
      .catch((me) => {
        throw me;
      });
  }

  private UserDartaValidte(data: User) {
    new Validator(data)
      .ItIsshouldToBeThere([
        "isLandAgent",
        "name",
        "email",
        "password",
        "yearOfBirdth",
      ])
      .MaxLength("name", 64)
      .MinLength("name", 2)
      .MaxWordCoud("name", 4)
      .IsEmail("email")
      .MinLength("password", 8)
      .MaxLength("password", 64)
      .IsBoolean("isLandAgent")
      .IsNumber("yearOfBirdth");
  }
  //#endregion private
  //#region getMe
  GetMeFromUser(): Promise<User> {
    return this.db.GetUserById(this.uid).then((data) => {
      data.password = "";
      if (data.landAgent) data.landAgent.turkisIdNumber = "";
      return data;
    });
  }
  //#endregion getMe

  //#region delMe

  DelMeFromUser(): Promise<boolean | Error> {
    return this.db.DelUserById(this.uid);
  }

  //#endregion delMe

  //#region updateMe
  UpdateMeFromUser(data: User | any): Promise<boolean> {
    this.UserDartaValidte(data);
    return this.GetMeFromUser().then((me) => {
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
      return this.db.UpdateUserById(this.uid, data);
    });
  }
  //#endregion updateMe

  //#region roomAddToCart
  RoomAddToCartFromUser(roomId: string): Promise<boolean> {
    return this.db.AddRoomToCardWriteToDB(this.uid, roomId);
  }
  //#endregion roomAddToCart

  //#region roomDelToCart
  RoomDelToCartFromUser(roomId: string): Promise<boolean> {
    return this.db.DelRoomToCardWriteToDB(this.uid, roomId);
  }
  //#endregion roomDelToCart

  //#region rankRoom
  RankRoomFromUser(roomId: string, like: boolean): Promise<boolean> {
    return this.db.AddLikeOrDislikeRoomById(roomId, like);
  }
  //#endregion rankRoom
}
