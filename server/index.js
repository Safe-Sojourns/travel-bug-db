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

//  Endpoint to log all important info by trip id
app.get('/logallimportantinfo/:tripid', (req, res) => {
  const PDB_Query = `SELECT * FROM trip_important_info WHERE trip_id = $1`
  const { tripid } = req.params;
  pdb.query(PDB_Query, [tripid])
  .then(response => res.send(response.rows))
  .catch(error => console.log(error));
});

//  Endpoint to log all important info
app.get('/logallimportantinfo', (req, res) => {
  const PDB_Query = `SELECT * FROM trip_important_info`
  pdb.query(PDB_Query)
  .then(response => res.send(response.rows))
  .catch(error => console.log(error));
});

//  Endpoint to log all trips
app.get('/logalltrips', (req, res) => {
  pdb.query('SELECT * FROM trips')
  .then(response => res.send(response.rows))
  .catch(error => console.log(error));
});

// Endpoint to log all messages by trip id
app.get('/logallmessages/:tripid', (req, res) => {
  const PDB_Query = `SELECT * FROM messages WHERE trip_id =$1`
  const { tripid }= req.params;
  pdb.query(PDB_Query, [tripid])
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
  const MDB_Query = { trip_id: tripId, start_date: { $regex: `${date}`}}
  mdb.eventModel.find(MDB_Query).exec()
  .then((events) => {
    res.send(events)
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(400);
  })
})

//  Endpoint to create event. Passed into body property.
app.post('/api/events', (req, res) => {
  const MDB_Query = {
    "trip_id": req.body.tripid,
    "event_name": req.body.title,
    "location": req.body.location,
    "latitude": req.body.latitude,
    "longitude": req.body.longitude,
    // "photos": req.body.photos,
    "photos": "https://unsplash.com/photos/iUBgeNeyVy8", //stock photo for now
    "start_time": req.body.start_time,
    "end_time": req.body.end_time,
    "description": req.body.description,
    "start_date": req.body.start_date,
    "end_date": req.body.end_date,
    "cost": req.body.cost,
    "transportation": req.body.transportation,
    "mandatory": req.body.mandatory
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
    res.send(response);
  })
  .catch((error) => {
    console.log(error);
    res.status(500);
    res.send('No event exists with that id');
  })
});

//  Enpoint to get all information about a specific event. Requires event if passed into url
app.get('/api/eventstrip/:trip_id', (req, res) => {
  const { trip_id } = req.params;
  const MDB_Query = {trip_id: trip_id}
  mdb.eventModel.find(MDB_Query)
  .then((response) => {
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
  mdb.criticalMessageModel.find({ _id: _id, seen_by_user_email: email})
  .then((results) => {
    if (results.length === 0) {
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
    } else {
      res.send('This email is already on the seen list');
    }
    })
});

// Endpoint to POST a message.
app.post('/api/postmessage', (req, res) => {
  const { tripid, message, userEmail, critical, date } = req.body;
  const PDB_Query = `INSERT INTO messages(trip_id, message, user_email, critical, date) VALUES ($1, $2, $3, $4, $5) RETURNING id`
  pdb.query(PDB_Query, [tripid, message, userEmail, critical, date])
  .then(response => {
    if (critical === true) {
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
});

//  Endpoint to send back important information and staff information. Requires trip id
app.get('/api/staffimportant', (req, res) => {
  const { trip_id } = req.query;
  const PDB_Query_Important = `SELECT * FROM trip_important_info WHERE trip_id = $1;`;
  const PDB_Query_Staff = `SELECT * FROM users WHERE trip_id = $1 AND "admin" = true;`;
  pdb.query(PDB_Query_Important, [trip_id])
  .then(responseImportant => {
    pdb.query(PDB_Query_Staff, [trip_id])
    .then(responseStaff => {
      res.send({important: responseImportant.rows, staff: responseStaff.rows})
    })
    .catch(() => res.status(500));
  })
  .catch(err => {
    console.log(err);
    res.status(500);
    res.send('Error with database');
  })
});

//  Endpoint to create a user. Requires trip_id and email
app.post('/api/createuser', (req, res) => {
  const { email, admin, trip_id } = req.body;
  let PDB_Query = '';
  if (admin) {
    PDB_Query = `INSERT INTO users (email, admin, trip_id) VALUES ($1, $2, $3)`;
    pdb.query(PDB_Query, [email, admin, trip_id])
    .then(results => res.send(201))
    .catch(err => {
      console.log(err);
      res.send(500);
    })
  } else {
    PDB_Query = `INSERT INTO users (email, admin, trip_id) VALUES ($1, FALSE, $2)`;
    pdb.query(PDB_Query, [email, trip_id])
    .then(results => res.send(201))
    .catch(err => {
      console.log(err);
      res.send(500);
    })
  }
});

//  Endpoint to create an admin from a specific url. Requires email, trip_id, and number
app.get('/api/createadmin', (req, res) => {
  const { email, trip_id, number } = req.query;
  const PDB_Query = `INSERT INTO users (email, admin, trip_id, number) VALUES ($1, TRUE, $2, $3)`;
  pdb.query(PDB_Query, [email, trip_id, number])
    .then(results => res.send(201))
    .catch(err => {
      console.log(err);
      res.send(500);
    })
});

//  Endpoint to create new trip and return the id of that trip. Requires a trip name.
app.get('/api/createtrip', (req, res) => {
  const { trip } = req.query;
  console.log(req.query);
  const PDB_Query = `INSERT INTO trips (name) VALUES ($1) RETURNING id`;
  pdb.query(PDB_Query, [trip])
    .then(results => {
      res.send(`Trip id for ${trip} is ${results.rows[0].id}`)
    })
    .catch(err => {
      console.log(err);
      res.send(500);
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
