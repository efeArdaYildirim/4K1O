import { logger } from "firebase-functions";
import { Anonim } from "./Anonim";
import { DAL } from "./DAL";
import { LandAgent } from "./Satan";
import { UserClass } from "./User";

export class ServerClass {
  anon: Anonim;
  user: UserClass;
  db: DAL;
  satan: LandAgent;
  constructor(dbConnection: any) {
    this.db = new DAL(dbConnection);
    this.anon = new Anonim(this.db);
    this.user = new UserClass(this.db);
    this.satan = new LandAgent(this.db);
  }

  async updateMe(data: any, context: any) {
    try {
      logger.info("updateMe", {
        arguments: { data: data, context: context.auth },
      });
      if (!context.auth)
        throw new Error("login olmada kullanici update etmeye calisma islemi");
      this.user.setUid = context.auth.uid;
      return { status: true, data: await this.user.updateMe(data) };
    } catch (err) {
      logger.error("updateMe", {
        err,
        arguments: { data: data, context: context.auth },
      });
      return { statu: false };
    }
  }
}
