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

  private validateBaisicUserData(data: User): void {
    new Validator(data)
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
    new Validator(data.landAgent).itIsshouldToBeThere([
      "turkisIdNumber",
      "firstName",
      "lastName",
      "phoneNumber",
    ]);
  }

  async addSatan(user: User): Promise<boolean> {
    this.validateBaisicUserData(user);

    if (!user.landAgent) throw new Error("eksik veri");
    this.app.turkisIdCheck(user.landAgent);

    const createdUser: admin.auth.UserRecord = await admin.auth().createUser({
      email: user.email,
      phoneNumber: user.landAgent.phoneNumber,
      password: user.password,
      displayName: user.name,
      disabled: true,
    });

    const isCreated = this.db.creatUser({ data: user, id: createdUser.uid });

    if (isCreated) return isCreated;
    await admin.auth().deleteUser(createdUser.uid);
    return false;
    /* // bu kod fire base de calismiyacak
    this.app.sendMailToReciver({
      to: user.email,
      text: "heasbi dogrulamak icin tikla",
      subject: "hesap dogrulama",
      html: "",
    });
    */
  }
}
