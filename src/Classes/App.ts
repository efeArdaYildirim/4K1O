import * as functions from "firebase-functions";
import { DAL } from "./DAL";

export class App {
  db: DAL;
  constructor(dal: DAL) {
    this.db = dal;
  }
  async rankCalcByLikefromRoom(roomId: string, isLke: boolean): Promise<void> {
    try {
      const { like, dislike } = await this.db.getRoomById(roomId);
      const rank: number = like - dislike;
      this.db
        .upDateRoomById(roomId, { rank })
        .then((result) => result)
        .catch((err) => err);
      return;
    } catch (err) {
      functions.logger.error("ranking", { err, arguments });
      return;
    }
  }
}
