const express = require('express');
const morgan = require('morgan');
const mdb = require('../db/mongoose.js');
const pdb = require('../db/psql.js');
const app = express();
const port = 3001;
const mongoData = require('../db/events.json');

app.use(morgan('dev'));
app.use(express.json());


app.get('/', (req, res) => {
  res.send('options - /logalldata /importmongodb /deletemongodb')
})

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

// get specific event - input params: specific date & trip id - return all events that match input params
app.get('/api/events/:tripId/:date', (req, res) => {
  const { tripId, date } = req.params;
  // const MDB_Query = { trip_id: {tripId} }
  const MDB_Query = { trip_id: tripId, start_time: { $regex: `${date}`}}
  mdb.find(MDB_Query).exec()
  .then((events) => res.send(events))
  .catch((error) => {
    console.log(error);
    res.sendStatus(400);
  })
})

// post events
{
  "trip_id": Number,
  "event_name": String,
  "location": String,
  "latitude": Number,
  "longitude": Number,
  "photos": [String],
  "start_time": String,
  "end_time": String,
  "description": String,
  "start_date": String,
  "end_date": String,
  "cost": Number,
  "transportation": String,
  "mandatory": Boolean,
  "important_info": {
    "embassy_phone": Number,
    "embassy_location_latitude": Number,
    "embassy_location_longitude": Number,
    "popo_phone": Number,
    "popo_location_latitude": Number,
    "popo_location_longitude": Number,
    "hospital_location_latitude": Number,
    "hospital_location_longitude": Number,
  }
}

// get event - event_id - all
app.get('/api/events/:event_id', (req, res) => {
  const { event_id } = req.params;
  const MDB_Query = `${event_id}`
  mdb.findById(MDB_Query)
  .then((response) => {
    console.log(response);
    res.send(response);
  })
  .catch((error) => {
    console.log(error);
    res.status(500);
    res.send('No event exists with that id');
  })
})

// post notes - user_id - notes
app.post('/api/notes', (req, res) => {
  const { id } = req.body;
  const PDB_Query = `SELECT * FROM users WHERE id = $1`;
  pdb.query(PDB_Query, [id])
  .then(response => {
    res.status(201);
    res.send(response.rows);
  })
  .catch((error) => {
    console.log(error);
    res.status(500);
    res.send('No user exists with that given email');
  });
});

// get user info - user_id - notes
app.get('/api/users/:email', (req, res) => {
  const { email } = req.params;
  const PDB_Query = `SELECT * FROM users WHERE email = $1`;

  pdb.query(PDB_Query, [email])
  .then(response => {
    res.send(response.rows);
  })
  .catch((error) => {
    console.log(error);
    res.status(500);
    res.send('No user exists with that given email');
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
