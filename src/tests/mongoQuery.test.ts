import { MongoDB } from "../Abstract/mongoDALClass"
import { DAL } from "../Classes/DAL";
import { QueryStringObj } from "../tipitipler/Extralar"

const db = new DAL()

test('bos query testi', () => {

  const query: QueryStringObj[] = [];

  expect(db.MongoQueryFromQueryStringObjs(query)).toEqual({})

})

test('tek query testi', () => {

  const query: QueryStringObj[] = [{ collOfTable: 'users', query: '==', mustBeData: 'test' }];
  expect(db.MongoQueryFromQueryStringObjs(query)).toEqual({ users: 'test' })
})

test('iki query testi', () => {

  const query: QueryStringObj[] = [
    { collOfTable: 'users', query: '==', mustBeData: 'test' },
    { collOfTable: 'users1', query: '==', mustBeData: 'test1' }
  ];
  expect(db.MongoQueryFromQueryStringObjs(query)).toEqual({ users: 'test', users1: 'test1' })
})

