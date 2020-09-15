<<<<<<< HEAD
import { Room, Rooms } from "../tipitipler/Room";
=======
import { Room } from "../tipitipler/Room";
>>>>>>> ValidatorClass
import { DAL } from "./DAL";
import { UserClass } from "./User";

export class LandAgent extends UserClass {
  db: DAL;
  uid: string;
<<<<<<< HEAD
  constructor(dal: DAL, uid: string) {
=======
  constructor(uid: string, dal: DAL) {
>>>>>>> ValidatorClass
    super(uid, dal);
    this.db = dal;
    this.uid = uid;
  }

  private roomDataValidator(room: Room): boolean {
    try {
      // new Validator()
    } catch (err) {}
    return true;
  }

  addRoom(room: Room) {}

  getMyRooms(): Promise<Rooms> {
    return this.db.getMyRooms(this.uid);
  }

  delMyRoom(roomId: string): Promise<boolean | Error> {
    return this.db.delRoomById(roomId);
  }

  updateMyRoom(roomId: string, updateRoomData: Room): Promise<Room> {}
}
