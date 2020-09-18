export interface ServerI {
  login(data: any, context: any): any;
  logup({ data, context }: any): any;
  roomList(data: any, context: any): any;
  roomSearch(data: any, context: any): any;
  roomLook(data: any, context: any): any;
  addRoom(data: any, context: any): any;
  getMyRooms(data: any, context: any): any;
  delRoom(data: any, context: any): any;
  updateRoom(data: any, context: any): any;
  deleteMe(data: any, context: any): any;
  updateMe(data: any, context: any): any;
  rank(data: any, context: any): any;
  cardJobs(data: any, context: any): any;
}
