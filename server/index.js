const express = require('express');
const morgan = require('morgan');
const mdb = require('../db/mongoose.js');
const pdb = require('../db/psql.js');
const app = express()
const port = 3000

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!')

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
