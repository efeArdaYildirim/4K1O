import { DAL } from "./DAL";

export class App {
  db: DAL;
  constructor(dal: DAL) {
    this.db = dal;
  }
  async rankCalcByLikefromRoom(roomId: string, isLke: boolean) {
    try {
      const { like, dislike } = await this.db.getRoomById(roomId);
    } catch (err) {}
  }
}
