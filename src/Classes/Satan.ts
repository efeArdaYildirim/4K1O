import { Room } from "../tipitipler/Room";
import { DAL } from "./DAL";
import { UserClass } from "./User";

export class LandAgent extends UserClass {
  db: DAL;
  uid: string;
  constructor(uid: string, dal: DAL) {
    super(uid, dal);
    this.db = dal;
    this.uid = uid;
  }

  addRoom(room: Room) {
    
   }

}
