import admin = require("firebase-admin");
import { DAL } from "../Classes/DAL";
import { Validator } from "../Classes/Validator";
import { User } from "../tipitipler/User";
import { App } from "../Classes/App";
export class AnonimFirebase {
  db: DAL;
  app: App;
  constructor(dal: DAL) {
    this.db = dal;
    this.app = new App(dal);
  }

  private validateBaisicUserData(data: any): Validator {
    return new Validator(data)
      .itIsshouldToBeThere([
        "landAgent",
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

  async addSatan(user: User): Promise<boolean> {
    this.validateBaisicUserData(user);
    new Validator(user.landAgent!).itIsshouldToBeThere([
      "turkisIdNumber",
      "firstName",
      "lastName",
      "phoneNumber",
    ]);
    if (user.landAgent) this.app.turkisIdCheck(user.landAgent);
    else throw new Error("eksik veri");
    const createdUser: admin.auth.UserRecord = await admin.auth().createUser({
      email: user.email,
      phoneNumber: user.landAgent.phoneNumber,
      password: user.password,
      displayName: user.name,
      disabled: true,
    });
    /* // bu kod fire base de calismiyacak
    this.app.sendMailToReciver({
      to: user.email,
      text: "heasbi dogrulamak icin tikla",
      subject: "hesap dogrulama",
      html: "",
    });
    */
    return this.db.creatUser({ data: user, id: createdUser.uid });
  }
}
