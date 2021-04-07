const express = require('express');
const morgan = require('morgan');
const mdb = require('../db/mongoose.js');
const pdb = require('../db/psql.js');
const app = express();
const port = 3001;
const mongoData = require('../db/events.json');
const mongoMessageData = require('../db/messages.json');

app.use(morgan('dev'));
app.use(express.json());


app.get('/', (req, res) => {
  res.send('options - /logallevents /importmongodb /deletemongodb')
})

//  Endpoint to log all Events
app.get('/logallevents', (req, res) => {
  mdb.eventModel.find({})
  .then((eventResponse) => {
    mdb.criticalMessageModel.find({})
    .then((criticalMessageResponse) => {
      res.send({events: eventResponse, criticalMessages: criticalMessageResponse});
    })
    .catch(() => res.status(500))
  })
  .catch(err => console.log(err));
});

//  Endpoint to log all users
app.get('/logallusers', (req, res) => {
  pdb.query('SELECT * FROM users')
  .then(response => res.send(response.rows))
  .catch(error => console.log(error));
});

//  Endpoint to log all important info
app.get('/logallimportantinfo', (req, res) => {
  pdb.query('SELECT * FROM trip_important_info')
  .then(response => res.send(response.rows))
  .catch(error => console.log(error));
});

//  Endpoint to log all trips
app.get('/logalltrips', (req, res) => {
  pdb.query('SELECT * FROM trips')
  .then(response => res.send(response.rows))
  .catch(error => console.log(error));
});

// Endpoint to log all messages
app.get('/logallmessages', (req, res) => {
  pdb.query('SELECT * FROM messages')
  .then(messages => {
    mdb.criticalMessageModel.find({})
    .then(criticalInfo => res.send({"messages": messages.rows, "criticalInfo": criticalInfo}))
  })
})

//  Endpoint to import entire dummy mongo data
app.get('/importmongodb', (req, res) => {
  mdb.eventModel.insertMany(mongoData)
  .then(() => {
    mdb.criticalMessageModel.insertMany(mongoMessageData)
    .then(() => res.send('Successfully inserted fake data'))
    .catch(() => res.status(500))
  })
  .catch((error) => {
    console.log(err);
    res.status(500)
    res.send('Issue importing fake data');
  })
});

//  Endpoint to delete entire mongo database. Big red button
app.get('/deletemongodb', (req, res) => {
  mdb.eventModel.deleteMany({})
  .then(() => {
    mdb.criticalMessageModel.deleteMany({})
    .then(() => res.send('Successfully deleted fake data'))
    .catch(() => res.status(500))
  })
  .catch((error) => {
    console.log(err);
    res.send('Issue deleting fake data');
  })
});

//  Engpoint to get all events on a specific trip and date. Requires trip id and date passed into url. DATE MUST BE IN YEAR-MONTH-DAY (0000-00-00)
app.get('/api/events/:tripId/:date', (req, res) => {
  const { tripId, date } = req.params;
  const MDB_Query = { trip_id: tripId, start_time: { $regex: `${date}`}}
  mdb.eventModel.find(MDB_Query).exec()
  .then((events) => res.send(events))
  .catch((error) => {
    console.log(error);
    res.sendStatus(400);
  })
})

//  Endpoint to create event. Passed into body property.
app.post('/api/events', (req, res) => {
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
  mdb.eventModel.create(MDB_Query)
  .then(() => {
    res.status(201);
    res.send('Successfully created event');
  })
  .catch((error) => {
    res.status(500);
    res.send('Error creating event');
  });
});

//  Enpoint to get all information about a specific event. Requires event if passed into url
app.get('/api/events/:event_id', (req, res) => {
  const { event_id } = req.params;
  const MDB_Query = `${event_id}`
  mdb.eventModel.findById(MDB_Query)
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

//  Endpoint to update a users notes. Requires users id and notes string passed into body
app.post('/api/notes', (req, res) => {
  const { id, notes } = req.body;
  const PDB_Query = `UPDATE users SET notes = $1 WHERE id = $2`;
  console.log('testing postgres');
  pdb.query(PDB_Query, [notes, id])
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

//  Endpoint to get all users information. Requires an email passed into url
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

//  Endpoint to get all trip important information. Requires trip id passed into url
app.get('/api/trips/:trip_id', (req, res) => {
  const { trip_id } = req.params;
  console.log(trip_id);
  const PDB_Query = `SELECT * FROM trip_important_info WHERE trip_id = $1`;

  pdb.query(PDB_Query, [trip_id])
  .then(response => {
    res.send(response.rows);
  })
  .catch((error) => {
    console.log(error);
    res.status(500);
    res.send('No trips exists with that given id');
  });
});

//  Endpoint to update critical messsage. Requires critcal message id and user email
app.put('/api/criticalseen', (req, res) => {
  const { _id, email } = req.body;
  mdb.criticalMessageModel.update(
    { _id: _id },
    { $push: {seen_by_user_email: email}}
  )
  .then(() => res.send('Successfully Updated'))
  .catch((err) => {
    console.log(err);
    res.status(400);
    res.send('Error Updating');
  })
});

// Endpoint to POST a message.
app.post('/api/postmessage', (req, res) => {
  const { tripid, message, userEmail, critical, date } = req.body;
  const PDB_Query = `INSERT INTO messages(trip_id, message, user_email, critical, date) VALUES ($1, $2, $3, $4, $5) RETURNING id`
  pdb.query(PDB_Query, [tripid, message, userEmail, critical, date])
  .then(response => {
    console.log('userEmail', userEmail);
    if (critical === 'true') {
      console.log('critcal if running')
      mdb.criticalMessageModel.create({'trip_id': tripid, 'message_id': response.rows[0].id, 'seen_by_user_email': [userEmail]})
      .then(response => res.send('Inserted into critical and normal message database'))
      .catch((error) => {
        console.log(error);
        res.status(400);
      });
    } else {
      res.send(('Inserted message into database'))
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(400);
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
