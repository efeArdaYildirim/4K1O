import { DAL } from "../Classes/DAL";
import { Validator } from "../Classes/Validator";
import { User } from "../tipitipler/User";

export class AnonimFirebase {
  db: DAL;
  constructor(dal: DAL) {
    this.db = dal;
  }

  validate(data: any) {
    new Validator(data)
      .maxLength("name", 64)
      .minLength("name", 2)
      .maxWordCoud("name", 4).;
  }

  async addUser(user: User): Promise<boolean> {
    return true;
  }
}
