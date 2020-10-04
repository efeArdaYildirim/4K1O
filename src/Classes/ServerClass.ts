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
  async Login(data: any, context: any) {
    console.log(data)
    return await this.db.SearchUserByEmailAndPasswd(data.email, data.password)
    throw new Error('Method not implemented.');
  }
  RoomList(data: any, context: any) {
    return this.db.ListRoomByRankORCityFromDB({
      index: 0,
      limit: 50,
      queryArr: [],
      sort: []
    })
    throw new Error('Method not implemented.');
  }
  RoomSearch(data: any, context: any) {
    throw new Error('Method not implemented.');
  }
  RoomLook(data: any, context: any) {
    throw new Error('Method not implemented.');
  }
  GetMyRooms(data: any, context: any) {
    throw new Error('Method not implemented.');
  }

  async UpdateMe(data: any, context: any) {
    try {
      logger.info("updateMe", {
        arguments: { data: data, context: context.auth },
      });
      this.user.setUid = context.auth.uid;
      this.user.AmIauth();
      return { status: true, data: await this.user.UpdateMeFromUser(data) };
    } catch (err) {
      logger.error("updateMe", {
        err: err.message,
        arguments: { data: data, context: context.auth },
      });
      return { statu: false };
    }
  }

  async Logup({ data, context }: any) {
    try {
      // logger.info("addLandAgent", {
      // arguments: { data: data, context: context.auth },
      // });
      // this.user.setUid = context.auth?.uid;
      // this.user.AmIauth();
      await this.anon.AddSatan(data);
      return { status: true };
    } catch (err) {
      logger.error("addLandAgent", {
        err: err.message,
        arguments: { data, context },
      });
      return { status: false };
    }
  }

  async AddRoom(data: Room, context: https.CallableContext) {
    try {
      logger.info("addRoom", {
        arguments: { data: data, context: context.auth },
      });
      this.satan.setUid = context.auth!.uid;
      await this.satan.AmILandAgent();
      const isAdded = await this.satan.AddRoom(data);
      return { status: isAdded };
    } catch (err) {
      logger.error("addRoom", {
        err: err.message,
        arguments: { data: data, context: context.auth },
      });
      return { status: false };
    }
  }

  async DelRoom(data: string, context: https.CallableContext) {
    try {
      logger.info("delRoom", {
        arguments: { data: data, context: context.auth },
      });
      this.satan.setUid = context.auth!.uid;
      await this.satan.AmILandAgent();
      const isDeleted = (await this.satan.DelMyRoom(data)) as boolean;
      return { status: isDeleted };
    } catch (err) {
      logger.error("delRoom", {
        err: err.message,
        arguments: { data: data, context: context.auth },
      });
      return { status: false };
    }
  }

  async UpdateRoom(
    data: { room: Room; id: string },
    context: https.CallableContext
  ) {
    try {
      logger.info("updateRoom", {
        arguments: { data: data, context: context.auth },
      });
      this.satan.setUid = context.auth!.uid;
      await this.satan.AmILandAgent();
      const updated = await this.satan.UpdateMyRoom(data.id, data.room);
      return { status: true, updated };
    } catch (err) {
      logger.error("updateRoom", {
        err: err.message,
        arguments: { data: data, context: context.auth },
      });
      return { status: false };
    }
  }

  async DeleteMe(_data: any, context: https.CallableContext) {
    try {
      logger.info("deleteMe", {
        arguments: { data: _data, context: context.auth },
      });
      this.user.setUid = context.auth!.uid;
      this.user.AmIauth();
      return { status: true, data: await this.user.DelMeFromUser() };
    } catch (err) {
      logger.error("deleteMe", {
        err: err.message,
        arguments: { data: _data, context: context.auth },
      });
      return { statu: false };
    }
  }

  async CardJobs(
    data: { id: string; add: boolean },
    context: https.CallableContext
  ) {
    try {
      logger.info("addCard", {
        arguments: { data: data, context: context.auth },
      });
      this.user.setUid = context.auth!.uid;
      this.user.AmIauth();
      if (data.add) await this.user.RoomAddToCartFromUser(data.id);
      else await this.user.RoomDelToCartFromUser(data.id);
      return { status: true };
    } catch (err) {
      logger.error("addCard", {
        err: err.message,
        arguments: { data: data, context: context.auth },
      });
      return { status: false };
    }
  }

  async Rank(
    data: { id: string; rank: boolean },
    context: https.CallableContext
  ) {
    try {
      logger.info("rank", { arguments: { data: data, context: context.auth } });
      this.user.setUid = context.auth!.uid;
      this.user.AmIauth();
      await this.user.RankRoomFromUser(data.id, data.rank);
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
