//@ts-nocheck
import { ObjectId } from "mongodb"
import { DAL } from "../Classes/DAL"
import { QueryArr, QueryStringObj } from "../tipitipler/Extralar"
import { data, tables, db } from './data'

test('get user by id', async () => {
  const result = await db.GetUserById(data.users[0]._id)
  delete data.createdTime;
  expect(result).toStrictEqual(data.users[0])
})

test("update user by id", async () => {
  const result = await db.UpdateUserById(data.users[0]._id, { name: 'e' })
  expect(result).toBeTruthy()
  const check = await db.GetUserById(data.users[0]._id)
  delete check.lastModified
  expect(check).toStrictEqual({ ...data.users[0], name: 'e' })

})

test('del user by Id', async () => {
  const result = await db.DelUserById(data.users[0]._id)
  expect(result).toBeTruthy()
})

test('create user To db', async () => {
  const user = { ...data.users[0] }
  delete user._id
  const result = await db.CreatUserToDB({ data: user, id: data.users[0]._id })
  expect(result.ok).toBeTruthy()
})

test("search user by email and passwd", async () => {
  const result = await db.SearchUserByEmailAndPasswd(data.users[0].email, data.users[0].passwd)
  expect(result).toStrictEqual(data.users[0])
})

test("add room to card", async () => {
  const result = await db.AddRoomToCardWriteToDB(data.users[0]._id, data.rooms[0]._id)
  expect(result.ok).toBeTruthy()
})


test("del room to card", async () => {
  const result = await db.DelRoomToCardWriteToDB(data.users[0]._id, data.rooms[0]._id)
  expect(result).toBeTruthy()
})

test("get room by id", async () => {
  const result = await db.GetRoomById(data.rooms[0]._id)
  expect(result).toStrictEqual(data.rooms[0])
})

test("del room by id", async () => {
  const result = await db.DelRoomById(data.rooms[0]._id)
  expect(result).toBeTruthy()
  // expect(await db.GetRoomById(data.rooms[0]._id)).toThrow(new Error("no data"))

})


test("create room to db", async () => {
  const { _id: id, ...room } = data.rooms[0];
  const result = await db.CreateRoomToDB(room, id)
  expect(result).toBeTruthy()
  const check = await db.GetRoomById(id)
  expect(check).toStrictEqual(data.rooms[0])
})
