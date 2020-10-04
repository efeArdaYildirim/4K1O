import { ServerClass } from "./Classes/ServerClass";
import express = require('express');
import { json } from 'body-parser'

const app = express();

const sv = new ServerClass('4k1O');



app.post('/login', async (req, res) => {
  const us = await sv.Login({
    email: 'efeardayildirim@gmail.com',
    password: '123'
  }, null)
  console.log(us)
  res.send(us)
})

app.listen(3000, () => {
  console.log('yasiyor')
})
