const express = require('express');
const morgan = require('morgan');
const mdb = require('../db/mongoose.js');
const pdb = require('../db/psql.js');
const app = express();
const port = 3001;
const mongoData = require('../db/events.json');

app.use(morgan('dev'));

app.get('/logalldata', (req, res) => {
  mdb.find({})
  .then(response => console.log(response))
  .catch(err => console.log(err));
  res.send('Data logged in server')

})

app.get('/importmongodb', (req, res) => {
  mdb.insertMany(mongoData)
  .then(() => res.send('Successfully inserted fake data'))
  .catch((error) => {
    console.log(err);
    res.send('Issue importing fake data');
  })
});

app.get('/deletemongodb', (req, res) => {
  mdb.deleteMany({})
  .then(() => res.send('Successfully deleted fake data'))
  .catch((error) => {
    console.log(err);
    res.send('Issue deleting fake data');
  })
});

// get specific event - specific date trip id - all

// post events

// get event - event_id - all

// post notes - user_id - notes

// get notes - user_id - notes

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
