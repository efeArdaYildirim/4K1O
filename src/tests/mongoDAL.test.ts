import { DAL } from "../Classes/DAL"
import { QueryStringObj } from "../tipitipler/Extralar"

const db = new DAL('test')
const results = [{ _id: "5fc8f7a63228cef3332653f3", t: "t" }, { "_id": "5fc96a45edf706f0821ea967", "t": "1" }]
test('connection', async () => {
  const query: QueryStringObj[] = [{
    collOfTable: "t", query: "==", mustBeData: 'i'
  }]
  let res = await db.Filter({ table: 'i', queryArr: query, })
  expect(res).toBe(res);
})

test('get by ID', async () => {
  const result = await db.GetById({ table: "i", id: "5fc8f7a63228cef3332653f3" })
  expect(result).toStrictEqual(results[0])
})

test('filter', async () => {
  const result = await db.Filter({ table: "i", queryArr: [{ collOfTable: "t", query: "==", mustBeData: "t" }] })
  expect(result).toStrictEqual([results[0]])
})

test('Mongo query str obj', () => {

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