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
    _id: new ObjectId('5fcbf7be4f5cd1517c99cb5c') + '',
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
    _id: new ObjectId('5fcbf7be4f5cd1517c99cb5d') + '',
    rank: 2,
    yearOfBirdth: 1999,
    isLandAgent: false,
    disabled: false,
  }],
  cards: [
    {
      owner: new ObjectId('5fcbf7be4f5cd1517c99cb5d') + '',
      rooms: [3, 4, 6]
    },
    {
      owner: new ObjectId('5fcbf7be4f5cd1517c99cb5c') + '',
      rooms: [5]
    }],
  rooms: [
    {
      _id: new ObjectId('5fcbf7be4f5cd1517c99cb60') + '',
      title: 'instanbulun gobegi',
      owner: 1,
      isActive: true,
      price: 10_000,
      rank: 2,
      m2: 30
    },
    {
      _id: new ObjectId('5fcbf7be4f5cd1517c99cb61') + '',
      title: 'adana gobegi',
      owner: 1,
      isActive: true,
      price: 5,
      rank: 2,
      m2: 30
    },
    {
      _id: new ObjectId('5fcbf7be4f5cd1517c99cb62') + '',
      title: 'mersin gobegi',
      owner: 1,
      isActive: true,
      price: 10,
      rank: 2,
      m2: 5
    },
    {
      _id: new ObjectId('5fcbf7be4f5cd1517c99cb63') + '',
      title: 'ankar gobegi',
      owner: 1,
      isActive: true,
      price: 10_00,
      rank: 2,
      m2: 30
    },
  ]
}

afterAll(async (done) => {
  try {
    await db.close()
    done()
  } catch (err) {
    console.log('zaten kapali')
  }
})

test('get by ID', async () => {
  const result = await db.GetById({ table: "users", id: '' + data.users[1]._id })
  expect(result).toStrictEqual(data.users[1])
})

test('filter', async () => {
  const result = await db.Filter({
    table: "rooms", queryArr:
    {
      and: [{ collOfTable: "owner", query: "==", mustBeData: 1 }],
      or: [
        { collOfTable: "price", query: "==", mustBeData: 10_000 },
        { collOfTable: 'm2', query: '<', mustBeData: 10 }
      ]
    }
  })
  expect(result).toEqual([data.rooms[0], data.rooms[2]])
})

test('Mongo query str', () => {

  const result = db.MongoQueryFromQueryStringObjs({
    and: [{ collOfTable: 'name', query: '==', mustBeData: 'efe' }],
    or: [
      { collOfTable: "age", query: '<', mustBeData: 30 },
      { collOfTable: 'surname', query: '==', mustBeData: 'yildirim' }
    ]
  })

  expect(result).toStrictEqual({
    name: "efe",
    $or: [{ age: { $lt: 30 } }, { surname: "yildirim" }]
  })

})

test('write a data to db', () => {
  const result = db.WriteADataToDB({
    table: 'rooms',
    data: {
      // _id: new ObjectId('add1') + '',
      title: 'tire gobegi',
      owner: 1,
      isActive: true,
      price: 10,
      rank: 2,
      m2: 300
    },
    id: '5fcc51e3f02fe1b97d2ee1d7'
  })
  expect(result).toBeTruthy()
})

test('inc data', () => {
  const result = db.increementData('m2', 15)
  expect(result).toStrictEqual({ '$inc': { m2: 15 } })
})

test('update', async () => {
  const inc = db.increementData('m2', 15)
  const result = await db.UpdateById({
    table: 'rooms',
    id: '5fcc51e3f02fe1b97d2ee1d7',
    data: { ...db.setUpdateData({ title: 'merkez gobek' }), ...inc }
  })

  const data = await db.GetById({ table: 'rooms', id: '5fcc51e3f02fe1b97d2ee1d7' })

  delete data.createdTime;
  delete data.lastModified;

  expect(result).toBeTruthy()
  expect(data).toStrictEqual({
    _id: '5fcc51e3f02fe1b97d2ee1d7',
    title: 'merkez gobek',
    owner: 1,
    isActive: true,
    price: 10,
    rank: 2,
    m2: 315
  })
})

test('del by id', async () => {
  const result = await db.DelById({ table: 'rooms', id: '5fcc51e3f02fe1b97d2ee1d7' })
  expect(result).toBeTruthy()
})

test('push data', async () => {
  const cardres = await db.Filter({
    table: "cards", queryArr:
    {
      and: [
        { collOfTable: 'owner', query: '==', mustBeData: new ObjectId('5fcbf7be4f5cd1517c99cb5c') }
      ]
    }
  })
  const { _id } = cardres[0]
  const result = await db.pushData('rooms', 3, 'cards', _id)
  const newcard = await db.GetById({ table: 'cards', id: _id })
  newcard.owner = newcard.owner + ''
  expect(result).toBeTruthy()
  expect(newcard).toStrictEqual({ _id, owner: data.cards[1].owner, rooms: [5, 3] })
})

test('pull data', async () => {
  const cardres = await db.Filter({
    table: "cards", queryArr:
    {
      and: [
        { collOfTable: 'owner', query: '==', mustBeData: new ObjectId('5fcbf7be4f5cd1517c99cb5c') }
      ]
    }
  })
  const { _id } = cardres[0]
  const result = await db.pullData('rooms', 3, 'cards', _id)
  const newcard = await db.GetById({ table: 'cards', id: _id })
  newcard.owner = newcard.owner + ''
  expect(result).toBeTruthy()
  expect(newcard).toStrictEqual({ ...data.cards[1], _id })
})
