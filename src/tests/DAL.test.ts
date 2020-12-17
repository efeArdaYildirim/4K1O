//@ts-nocheck
import { ObjectId } from "mongodb"
import { DAL } from "../Classes/DAL"
import { QueryArr, QueryStringObj } from "../tipitipler/Extralar"

const db = new DAL('4k10')

let tables = ['users', 'cards', 'rooms']
const data = {
  users: [{
    email: 'efeardayildirim@gmail.com',
    passwd: 'qazxsw',
    name: 'Efe Arda Yildirim',
    rank: 1,
    _id: '5fcbf7be4f5cd1517c99cb5c',
    yearOfBirdth: 2000,
    isLandAgent: true,
    disabled: false,
    landAgent: {
      turkisIdNumber: '100000381',
      firstName: 'Efe Arda',
      lastName: 'Yildirim',
      phoneNumber: '05425123000'
    }
  },
  {
    email: 'ayse@gmai.com',
    passwd: 'qwert',
    name: 'Ayse',
    _id: '5fcbf7be4f5cd1517c99cb5d',
    rank: 2,
    yearOfBirdth: 1999,
    isLandAgent: false,
    disabled: false,
  }],
  cards: [
    {
      owner: '5fcbf7be4f5cd1517c99cb5d',
      rooms: [3, 4, 6]
    },
    {
      owner: '5fcbf7be4f5cd1517c99cb5c',
      rooms: [5]
    }],
  rooms: [
    {
      _id: '5fcbf7be4f5cd1517c99cb60',
      title: 'instanbulun gobegi',
      owner: 1,
      isActive: true,
      price: 10_000,
      rank: 2,
      m2: 30
    },
    {
      _id: '5fcbf7be4f5cd1517c99cb61',
      title: 'adana gobegi',
      owner: 1,
      isActive: true,
      price: 5,
      rank: 2,
      m2: 30
    },
    {
      _id: '5fcbf7be4f5cd1517c99cb62',
      title: 'mersin gobegi',
      owner: 1,
      isActive: true,
      price: 10,
      rank: 2,
      m2: 5
    },
    {
      _id: '5fcbf7be4f5cd1517c99cb63',
      title: 'ankar gobegi',
      owner: 1,
      isActive: true,
      price: 10_00,
      rank: 2,
      m2: 30
    },
  ]
}

test('get user by id', async () => {
  const result = await db.GetUserById(data.users[0]._id)
  delete data.createdTime;
  expect(result).toStrictEqual(data.users[0])
})

test('del user by Id', async () => {
  const result = await db.DelUserById(data.users[0]._id)
  expect(result).toBeTruthy()
})

test('create user To db', async () => {
  const user = { ...data.users[0] }
  delete user._id
  const result = await db.CreatUserToDB({ data: user, id: data.users[0]._id })
  expect(result).toBeTruthy()
})