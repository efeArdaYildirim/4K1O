import { https, logger } from "firebase-functions";
import { ServerI } from "../implements/ServerI";
import { Room } from "../tipitipler/Room";
import { Anonim } from "./Anonim";
import { DAL } from "./DAL";
import { LandAgent } from "./Satan";
import { UserClass } from "./User";

export class ServerClass implements ServerI {
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
  login(data: any, context: any) {
    throw new Error("Method not implemented.");
  }
  roomList(data: any, context: any) {
    throw new Error("Method not implemented.");
  }
  roomSearch(data: any, context: any) {
    throw new Error("Method not implemented.");
  }
  roomLook(data: any, context: any) {
    throw new Error("Method not implemented.");
  }
  getMyRooms(data: any, context: any) {
    throw new Error("Method not implemented.");
  }

  async updateMe(data: any, context: any) {
    try {
      logger.info("updateMe", {
        arguments: { data: data, context: context.auth },
      });
      this.user.setUid = context.auth.uid;
      this.user.amIauth();
      return { status: true, data: await this.user.updateMe(data) };
    } catch (err) {
      logger.error("updateMe", {
        err: err.message,
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
      this.user.setUid = context.auth.uid;
      this.user.amIauth();
      await this.anon.addSatan(data);
      return { status: true };
    } catch (err) {
      logger.error("addLandAgent", {
        err: err.message,
        arguments: { data, context },
      });
      return { status: false };
    }
  }

  async addRoom(data: Room, context: https.CallableContext) {
    try {
      logger.info("addRoom", {
        arguments: { data: data, context: context.auth },
      });
      this.satan.setUid = context.auth!.uid;
      await this.satan.amILandAgent();
      const isAdded = await this.satan.addRoom(data);
      return { status: isAdded };
    } catch (err) {
      logger.error("addRoom", {
        err: err.message,
        arguments: { data: data, context: context.auth },
      });
      return { status: false };
    }
  }

  async delRoom(data: string, context: https.CallableContext) {
    try {
      logger.info("delRoom", {
        arguments: { data: data, context: context.auth },
      });
      this.satan.setUid = context.auth!.uid;
      await this.satan.amILandAgent();
      const isDeleted = (await this.satan.delMyRoom(data)) as boolean;
      return { status: isDeleted };
    } catch (err) {
      logger.error("delRoom", {
        err: err.message,
        arguments: { data: data, context: context.auth },
      });
      return { status: false };
    }
  }

  async updateRoom(
    data: { room: Room; id: string },
    context: https.CallableContext
  ) {
    try {
      logger.info("updateRoom", {
        arguments: { data: data, context: context.auth },
      });
      this.satan.setUid = context.auth!.uid;
      await this.satan.amILandAgent();
      const updated = await this.satan.updateMyRoom(data.id, data.room);
      return { status: true, updated };
    } catch (err) {
      logger.error("updateRoom", {
        err: err.message,
        arguments: { data: data, context: context.auth },
      });
      return { status: false };
    }
  }

  async deleteMe(_data: any, context: https.CallableContext) {
    try {
      logger.info("deleteMe", {
        arguments: { data: _data, context: context.auth },
      });
      this.user.setUid = context.auth!.uid;
      this.user.amIauth();
      return { status: true, data: await this.user.delMe() };
    } catch (err) {
      logger.error("deleteMe", {
        err: err.message,
        arguments: { data: _data, context: context.auth },
      });
      return { statu: false };
    }
  }

  async cardJobs(
    data: { id: string; add: boolean },
    context: https.CallableContext
  ) {
    try {
      logger.info("addCard", {
        arguments: { data: data, context: context.auth },
      });
      this.user.setUid = context.auth!.uid;
      this.user.amIauth();
      if (data.add) await this.user.roomAddToCart(data.id);
      else await this.user.roomDelToCart(data.id);
      return { status: true };
    } catch (err) {
      logger.error("addCard", {
        err: err.message,
        arguments: { data: data, context: context.auth },
      });
      return { status: false };
    }
  }

  async rank(
    data: { id: string; rank: boolean },
    context: https.CallableContext
  ) {
    try {
      logger.info("rank", { arguments: { data: data, context: context.auth } });
      this.user.setUid = context.auth!.uid;
      this.user.amIauth();
      await this.user.rankRoom(data.id, data.rank);
      return { status: true };
    } catch (err) {
      logger.error("rank", {
        err: err.message,
        arguments: { data: data, context: context.auth },
      });
      return { status: false };
    }
  }
}
