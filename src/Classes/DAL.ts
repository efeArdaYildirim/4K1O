import * as admin from "firebase-admin";
import { user } from "firebase-functions/lib/providers/auth";
import { ObjectId } from "mongodb";
import { FireBaseStore } from "../Abstract/FireBaseStore";
import { MongoDB } from '../Abstract/mongoDALClass';
import { ListRoomsQueryParams, QueryArr, QueryStringObj } from "../tipitipler/Extralar";
import { SortQuery } from "../tipitipler/FireBaseStoreTypes";
import { Room, Rooms } from "../tipitipler/Room";
import { User } from "../tipitipler/User";

class DAL extends MongoDB {
  tables: { users: string; cards: string; rooms: string };

  constructor(connection?: any) {
    super(connection);
    this.tables = {
      users: "users",
      cards: "cards",
      rooms: "rooms",
    };
  }

  //#region userFuncions

  //#region getUserById
  GetUserById(id: string): Promise<User> {
    return this.GetById({ table: this.tables.users, id }) as Promise<User>;
  }
  //#endregion getUserById

  //#region createUser
  CreatUserToDB({ data, id }: any): Promise<[boolean, string]> {
    return this.WriteADataToDB({ table: this.tables.users, data, id });
  }
  //#endregion createUser

  //#region delUserById
  /**
   * ! card larida silmeli 
   * ! emlakcinin evleride ve fotoraflari  
   */
  DelUserById(id: string): Promise<boolean | Error> {
    return this.DelById({ table: this.tables.users, id });
  }
  //#endregion delUserById

  //#region updateUserById
  UpdateUserById(id: string, data: JSON): Promise<boolean> {
    return this.UpdateById({ table: this.tables.users, id, data })
  }
  //#endregion updateUserById

  //#region searchUserByNameAndPasswd

  SearchUserByEmailAndPasswd(email: string, passwd: string): Promise<User> {
    const queryArr: QueryArr = {
      and: [
        { colonOfTable: "email", query: "==", mustBeData: email },
        { colonOfTable: "passwd", query: "==", mustBeData: passwd },
      ]
    };
    return this.Filter({
      table: this.tables.users,
      queryArr,
    }).then((res: any[]) => {
      return res[0] as User
    });
  }

  //#endregion searchUserByNameAndPasswd

  //#region addRoomToCard
  async AddRoomToCardWriteToDB(userId: string, roomId: string): Promise<boolean> {
    const cardId = await this.Filter({ table: this.tables.cards, queryArr: { and: [{ colonOfTable: 'owner', query: "==", mustBeData: new ObjectId(userId) }] } }) as Room[]
    return this.PushData('rooms', roomId, this.tables.cards, cardId[0]._id)
  }
  //#endregion addRoomToCard

  //#region delRoomToCard
  async DelRoomToCardWriteToDB(userId: string, roomId: string): Promise<boolean> {
    const cardId = await this.Filter({ table: this.tables.cards, queryArr: { and: [{ colonOfTable: 'owner', query: "==", mustBeData: new ObjectId(userId) }] } }) as Room[]
    return this.PullData('rooms', roomId, this.tables.cards, cardId[0]._id)

  }
  //#endregion delRoomToCard

  //#endregion userFuncions

  //#region RoomFunctions

  //#region getRoomById
  GetRoomById(id: string): Promise<Room> {
    return this.GetById({ table: this.tables.rooms, id }) as Promise<Room>;
  }
  //#endregion getRoomById

  //#region createRoom

  CreateRoomToDB(data: Room, id?: string): Promise<[boolean, string]> {
    return this.WriteADataToDB({ table: this.tables.rooms, data, id: id });
  }
  //#endregion createRoom

  //#region delRoomById
  DelRoomById(id: string): Promise<boolean | Error> {
    return this.DelById({ table: this.tables.rooms, id });
  }
  //#endregion delRoomById

  //#region hideRoomById
  HideRoomById(id: string, hide: boolean): Promise<boolean> {
    return this.UpdateById({
      table: this.tables.rooms,
      id,
      data: { hide },
    })
  }
  //#endregion hideRoomById

  //#region addLikeOrDislikeRoomById
  private Dislike(id: string): Promise<boolean> {
    const value = this.IncreementData('Dislike', 1);
    return this.UpdateById({ table: this.tables.rooms, id, data: value })
  }

  private Like(id: string): Promise<boolean> {
    const value = this.IncreementData('Like', 1);
    return this.UpdateById({ table: this.tables.rooms, id, data: value })
  }

  AddLikeOrDislikeRoomById(id: string, like: boolean): Promise<boolean> {
    if (like) return this.Like(id);
    return this.Dislike(id);
  }
  //#endregion addLikeOrDislikeRoomById

  //#region upDateRoomById

  UpDateRoomById(id: string, data: object): Promise<boolean> {
    return this.UpdateById({ table: this.tables.rooms, id, data })
  }

  //#endregion upDateRoomById

  //#region listRoomByRankORCity

  ListRoomByRankORCityFromDB({
    queryArr,
    index,
    sort,
    limit,
    city,
  }: ListRoomsQueryParams) {
    if (city) {
      queryArr.and.push({ colonOfTable: "city", query: "==", mustBeData: city });
    }
    const sortArray: SortQuery[] = [
      { orderBy: "rank", sortBy: "desc" },
      ...sort,
    ];
    return this.Filter({
      table: this.tables.rooms,
      queryArr,
      limit,
      index,
      sort: sortArray,
    }) as Promise<Rooms>;
  }

  //#endregion listRoomByRankORCity

  //#region getMyRooms

  GetMyRoomsFromDB(id: string): Promise<Rooms> {
    const queryArr: QueryArr = {
      and: [
        { colonOfTable: "owner", query: "==", mustBeData: id },
      ]
    };
    return this.Filter({
      table: this.tables.rooms,
      queryArr,
    }) as Promise<Rooms>;
  }

  //#endregion getMyRooms

  //#region updateRankById

  UpdateRankById(id: string, rank: string): Promise<boolean> {
    const data = { rank };
    return this.UpdateById({ table: this.tables.rooms, id, data })
  }

  //#endregion updateRankById

  //#endregion RoomFunctions
}
export { DAL };
