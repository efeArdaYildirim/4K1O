import { ObjectId } from "mongodb"
import { DAL } from "../Classes/DAL";

export const db = new DAL('1');

export const tables = ['users', 'cards', 'rooms']
export const data = {
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
      m2: 15
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