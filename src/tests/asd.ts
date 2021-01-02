import { DAL } from "../Classes/DAL"
import { data } from "./data"
const db = new DAL('1')

async function main() {
  /*
  const result = await db.DelRoomById(data.rooms[0]._id)
  console.assert(result, 'del room by id: false')
  try {
    await db.GetRoomById(data.rooms[0]._id)
    console.log('veri hala var')
  } catch (err) {
    console.error("basrili: ", err)
  }*/
  const { _id: id, ...room } = data.rooms[0];
  const result1 = await db.CreateRoomToDB(room, id)
  console.assert(result1, 'create room to db write: false')
  const check = db.GetRoomById("5fcbf7be4f5cd1517c99cb60")
  console.assert(check != data.rooms[0], 'create room to db check : false')
}


main()