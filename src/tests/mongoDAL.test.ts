//@ts-nocheck
import { ObjectId } from "mongodb"
import { DAL } from "../Classes/DAL"
import { QueryArr, QueryStringObj } from "../tipitipler/Extralar"
import { data, tables, db } from './data'


afterAll(async (done) => {
  try {
    await db.Close()
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
      and: [{ colonOfTable: "owner", query: "==", mustBeData: 1 }],
      or: [
        { colonOfTable: "price", query: "==", mustBeData: 10000 },
        { colonOfTable: 'm2', query: '<', mustBeData: 10 }
      ]
    }
  })
  expect(result).toEqual([data.rooms[0]])
})

test('Mongo query str', () => {

  const result = db.MongoQueryFromQueryStringObjs({
    and: [{ colonOfTable: 'name', query: '==', mustBeData: 'efe' }],
    or: [
      { colonOfTable: "age", query: '<', mustBeData: 30 },
      { colonOfTable: 'surname', query: '==', mustBeData: 'yildirim' }
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
  const result = db.IncreementData('m2', 15)
  expect(result).toStrictEqual({ '$inc': { m2: 15 } })
})

test('update', async () => {
  const inc = db.IncreementData('m2', 15)
  const result = await db.UpdateById({
    table: 'rooms',
    id: '5fcc51e3f02fe1b97d2ee1d7',
    data: { ...db.SetUpdateData({ title: 'merkez gobek' }), ...inc }
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
  const cardrs = await db.Filter({
    table: "cards", queryArr:
    {
      and: [
        { colonOfTable: 'owner', query: '==', mustBeData: new ObjectId(data.users[0]._id) }
      ]
    }
  })
  const { _id } = cardrs[0]
  const result = await db.PushData('rooms', 3, 'cards', _id)
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
        { colonOfTable: 'owner', query: '==', mustBeData: new ObjectId('5fcbf7be4f5cd1517c99cb5c') }
      ]
    }
  })
  const { _id } = cardres[0]
  const result = await db.PullData('rooms', 3, 'cards', _id)
  const newcard = await db.GetById({ table: 'cards', id: _id })
  newcard.owner = newcard.owner + ''
  expect(result).toBeTruthy()
  expect(newcard).toStrictEqual({ ...data.cards[1], _id })
})
