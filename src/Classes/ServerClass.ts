import { https, logger } from "firebase-functions";
import { Room } from '../tipitipler/Room';
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

  async logup({ data, context }: any) {
    try {
      logger.info("addLandAgent", {
        arguments: { data: data, context: context.auth },
      });
      if (context.auth) throw new Error("loginken hesap olusturamasin");
      await this.anon.addSatan(data);
      return { status: true };
    } catch (err) {
      logger.error("addLandAgent", { err, arguments: { data, context } });
      return { status: false };
    }
  }

  async addRoom(data: Room, context: https.CallableContext) {
    try {
      logger.info("addRoom", {
        arguments: { data: data, context: context.auth },
      });
      this.satan.setUid = context.auth!.uid;
      if (!this.satan.amILandAgent())
        throw new Error("satici olmadan oda ekelyemesin");
      const isAdded = await this.satan.addRoom(data);
      return { status: isAdded };
    } catch (err) {
      logger.error("addRoom", {
        err,
        arguments: { data: data, context: context.auth },
      });
      return { status: false };
    }
  }

  
}
