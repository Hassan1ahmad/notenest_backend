const express = require('express')
var cors = require('cors')
const connectToMongo = require('./db')
require('dotenv').config();


connectToMongo();
const app = express()
const port =  process.env.PORT || 5000

app.use(cors())
app.use(express.json())

//Available routes
app.get('/',(req,res)=>{
  res.send('Api started running')
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port  http://localhost:${port}/`)
})