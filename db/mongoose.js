
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/events', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoose connected')

});

const eventSchema = new mongoose.Schema(
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
    "mandatory": Boolean
  }
);

const criticalMessageSchema = new mongoose.Schema(
  {
    "trip_id": Number,
    "message_id": Number,
    "seen_by_user_email": [
      String
    ]
  }
);

const eventModel = mongoose.model('Event', eventSchema);
const criticalMessageModel = mongoose.model('Critical Message', criticalMessageSchema);

module.exports = { eventModel, criticalMessageModel }
