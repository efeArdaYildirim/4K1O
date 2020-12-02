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

  private RoomDataValidator(room: Room): void {
    new Validator(room)
      .ItIsshouldNotToBeThere(["rank", "look", "like", "dislike", "id"])
      .IsNumber("m2")
      .MaxLength("title", 64)
      .MinLength("title", 3)
      .MinLength("explain", 10)
      .MaxLength("explain", 500)
      .MinWordCount("explain", 5)
      .IsBoolean("isActive")
      .IsNumber("price");
    if (room.location) new Validator(room.location).IsItUrl("mapsLink");
  }

  private isItMyRoom(room: Room): void {
    const roomOwner = room.owner;
    if (roomOwner !== this.uid) throw new Error("sesnin odan degil");
  }

  AddRoom(room: Room) {
    this.RoomDataValidator(room);
    return this.db.CreateRoomToDB({ ...room, owner: this.uid });
  }

  GetMyRooms(): Promise<Rooms> {
    return this.db.GetMyRoomsFromDB(this.uid);
  }

  DelMyRoom(roomId: string): Promise<boolean | Error> {
    return this.db
      .GetRoomById(roomId)
      .then((room: Room) => {
        this.isItMyRoom(room);
        return this.db.DelRoomById(roomId);
      })
      .catch((err: any) => {
        throw err;
      });
  }

  UpdateMyRoom(roomId: string, updateRoomData: Room): Promise<Room> {
    this.RoomDataValidator(updateRoomData);
    new Validator(updateRoomData).ItIsshouldNotToBeThere(["owner"]);
    return this.db.GetRoomById(roomId).then((room: Room) => {
      this.isItMyRoom(room);
      return this.db.UpDateRoomById(roomId, updateRoomData);
    });
  }

  AmILandAgent(): Promise<void> {
    return this.GetMeFromUser().then((me: User) => {
      if (me.isLandAgent) throw new Error("satici degilsin");
    });
  }
}
