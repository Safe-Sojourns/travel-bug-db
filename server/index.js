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
  .then(response => res.send(response))
  .catch(err => console.log(err));
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
  const MDB_Query = { trip_id: tripId, start_time: { $regex: `${date}`}}
  mdb.find(MDB_Query).exec()
  .then((events) => res.send(events))
  .catch((error) => {
    console.log(error);
    res.sendStatus(400);
  })
})

// post events
app.post('/api/events', (req, res) => {
  console.log(req.body);
  const MDB_Query = {
    "trip_id": req.body.trip_id,
    "event_name": req.body.event_name,
    "location": req.body.location,
    "latitude": req.body.latitude,
    "longitude": req.body.longitude,
    "photos": req.body.photos,
    "start_time": req.body.start_time,
    "end_time": req.body.end_time,
    "description": req.body.description,
    "start_date": req.body.start_date,
    "end_date": req.body.end_date,
    "cost": req.body.cost,
    "transportation": req.body.transportation,
    "mandatory": req.body.mandatory,
    "important_info": {
      "embassy_phone": req.body.embassy_phone,
      "embassy_location_latitude": req.body.embassy_location_latitude,
      "embassy_location_longitude": req.body.embassy_location_longitude,
      "popo_phone": req.body.popo_phone,
      "popo_location_latitude": req.body.popo_location_latitude,
      "popo_location_longitude": req.body.popo_location_longitude,
      "hospital_location_latitude": req.body.hospital_location_latitude,
      "hospital_location_longitude": req.body.hospital_location_longitude,
    }
  };
  mdb.create(MDB_Query)
  .then(() => {
    res.status(201);
    res.send('Successfully created event');
  })
  .catch((error) => {
    res.status(500);
    res.send('Error creating event');
  });
});

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
