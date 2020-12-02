import { App } from '../Classes/App';
import { DAL } from '../Classes/DAL';
import { Validator } from '../Classes/Validator';
import { User } from '../tipitipler/User';

export abstract class AnonimBaisic {


  db: DAL;
  app: App;
  constructor(dal: DAL) {
    this.db = dal;
    this.app = new App(dal);
  }

  private ValidateBaisicUserData(data: User): void {
    new Validator(data)
      .ItIsshouldToBeThere([
        "landAgent",
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
    new Validator(data.landAgent).ItIsshouldToBeThere([
      "turkisIdNumber",
      "firstName",
      "lastName",
      "phoneNumber",
    ]);
  }

  async AddSatan(user: User): Promise<boolean> {
    // this.ValidateBaisicUserData(user);

    // if (!user.landAgent) throw new Error("eksik veri");
    // this.app.TurkisIdCheck(user.landAgent);

    const isCreated = this.db.CreatUserToDB({ data: user });

    if (isCreated) return isCreated;
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
