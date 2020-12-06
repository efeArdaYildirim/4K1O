import { DAL } from "../Classes/DAL"

const db = new DAL('4k10')


const result = db.DelById({ table: 'rooms', id: '5fcc51e3f02fe1b97d2ee1d7' })
  .then(result => {

    console.log(result)
  })