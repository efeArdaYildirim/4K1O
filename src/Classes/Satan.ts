import { Room, Rooms } from "../tipitipler/Room";
import { User } from "../tipitipler/User";
import { DAL } from "./DAL";
import { UserClass } from "./User";
import { Validator } from "./Validator";

export class LandAgent extends UserClass {
  db: DAL;
  // uid: string;
  constructor(dal: DAL) {
    super(dal);
    this.db = dal;
    // this.uid = uid;
  }

  public test() {
    console.error("nbr");
  }

  private roomDataValidator(room: Room): void {
    new Validator(room)
      .itIsshouldNotToBeThere(["rank", "look", "like", "dislike", "id"])
      .isNumber("m2")
      .maxLength("title", 64)
      .minLength("title", 3)
      .minLength("explain", 10)
      .maxLength("explain", 500)
      .minWordCount("explain", 5)
      .isBoolean("isActive")
      .isNumber("price");
    if (room.location) new Validator(room.location).isItUrl("mapsLink");
  }

  addRoom(room: Room) {
    this.roomDataValidator(room);
    return this.db.createRoom({ ...room, owner: this.uid });
  }

  getMyRooms(): Promise<Rooms> {
    return this.db.getMyRooms(this.uid);
  }

  delMyRoom(roomId: string): Promise<boolean | Error> {
    return this.db
      .getRoomById(roomId)
      .then((room: Room) => {
        const roomOwner = room.owner;
        if (roomOwner !== this.uid)
          throw new Error("basksinin odasini silemesin");
        else return this.db.delRoomById(roomId);
      })
      .catch((err) => {
        throw err;
      });
  }

  updateMyRoom(roomId: string, updateRoomData: Room): Promise<Room> {
    this.roomDataValidator(updateRoomData);
    new Validator(updateRoomData).itIsshouldNotToBeThere(["owner"]);
    return this.db.upDateRoomById(roomId, updateRoomData);
  }

  amILandAgent(): Promise<boolean> {
    return this.getMe().then((me: User) => {
      return me.isLandAgent;
    });
  }
}
