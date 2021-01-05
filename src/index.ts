import { ServerClass } from "./Classes/ServerClass";
import express = require('express');
import { json } from 'body-parser'

const app = express();

const sv = new ServerClass('4k1o');



app.post('/login', async (req, res) => {
  const us = await sv.Login({
    email: 'efeardayildirim@gmail.com',
    password: '123'
  }, null)
  res.send(us)
  return
})

app.post('/logup', async (req, res) => {
  const us = await sv.Logup({
    data: {
      email: 'efeardayildirim@gmail.com',
      password: '123'
    }
  })

  res.send(us)
  return
})

app.listen(3000, () => {
  console.log('yasiyor')
})
