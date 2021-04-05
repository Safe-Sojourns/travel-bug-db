
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
);

module.exports = mongoose.model('Event', eventSchema);
