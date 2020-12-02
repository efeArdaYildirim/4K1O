export interface ServerI {
  Login(data: any, context: any): any;
  Logup({ data, context }: any): any;
  RoomList(data: any, context: any): any;
  RoomSearch(data: any, context: any): any;
  RoomLook(data: any, context: any): any;
  AddRoom(data: any, context: any): any;
  GetMyRooms(data: any, context: any): any;
  DelRoom(data: any, context: any): any;
  UpdateRoom(data: any, context: any): any;
  DeleteMe(data: any, context: any): any;
  UpdateMe(data: any, context: any): any;
  Rank(data: any, context: any): any;
  CardJobs(data: any, context: any): any;
}
