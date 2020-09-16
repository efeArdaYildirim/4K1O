import { Room, Rooms } from "../tipitipler/Room";
import { DAL } from "./DAL";
import { UserClass } from "./User";
import { Validator } from "./Validator";

export class LandAgent extends UserClass {
  db: DAL;
  uid: string;
  constructor(dal: DAL, uid: string) {
    super(uid, dal);
    this.db = dal;
    this.uid = uid;
  }

  private roomDataValidator(room: Room): void {
    new Validator(room).itIsshouldNotToBeThere([
      "rank",
      "look",
      "like",
      "dislike",
      "id",
    ]);
  }

  addRoom(room: Room) {
    this.roomDataValidator(room);
    return this.db.createRoom(room);
  }

  getMyRooms(): Promise<Rooms> {
    return this.db.getMyRooms(this.uid);
  }

  delMyRoom(roomId: string): Promise<boolean | Error> {
    return this.db.delRoomById(roomId);
  }

  updateMyRoom(roomId: string, updateRoomData: Room): Promise<Room> {
    this.roomDataValidator(updateRoomData);
    new Validator(updateRoomData).itIsshouldNotToBeThere(["owner"]);
    return this.db.upDateRoomById(roomId, updateRoomData);
  }
}
