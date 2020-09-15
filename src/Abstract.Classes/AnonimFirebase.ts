import { DAL } from "../Classes/DAL";
import { Validator } from "../Classes/Validator";
import { User } from "../tipitipler/User";

export class AnonimFirebase {
  db: DAL;
  constructor(dal: DAL) {
    this.db = dal;
  }

  validateBaisicUserData(data: any):Validator {
    return new Validator(data)
      .maxLength("name", 64)
      .minLength("name", 2)
      .maxWordCoud("name", 4)
      .isEmail("email")
      .minLength("password", 8)
      .maxLength("password", 64)
      .isBoolean("isLandAgent")
      .isNumber("birdthDay");
  }

  async addUser(user: User): Promise<boolean> {
    return true;
  }
}
