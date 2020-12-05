import { DAL } from "../Classes/DAL"
import { QueryArr, QueryStringObj } from "../tipitipler/Extralar"

const db = new DAL('test')
const results = [{ _id: "5fc8f7a63228cef3332653f3", t: "t" }, { "_id": "5fc96a45edf706f0821ea967", "t": "1" }]
test('connection', async () => {
  const queryArr: QueryArr = {}
  queryArr.and = [{
    collOfTable: "t", query: "==", mustBeData: 'i'
  }]
  let res = await db.Filter({ table: 'i', queryArr, })
  expect(res).toBe(res);
})

test('get by ID', async () => {
  const result = await db.GetById({ table: "i", id: "5fc8f7a63228cef3332653f3" })
  expect(result).toStrictEqual(results[0])
})

test('filter', async () => {
  const result = await db.Filter({ table: "i", queryArr: { and: [{ collOfTable: "t", query: "==", mustBeData: "t" }] } })
  expect(result).toStrictEqual([results[0]])
})

test('Mongo query str obj', () => {

  const result = db.MongoQueryFromQueryStringObjs({ and: [{ collOfTable: "t", query: "==", mustBeData: "t" }] })

  expect(result).toStrictEqual({ t: 't' })

})