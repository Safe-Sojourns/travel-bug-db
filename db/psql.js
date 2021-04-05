const { Pool } = require('pg');

const instance = new Pool ({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'travel_bug_db',
});

instance.connect((error, response) => {
  if (error) {
    console.log('ERROR CONNECTING TO PostgreSQL', error);
  } else {
    console.log('Successfully connected to PostgreSQL');
  }
});

module.exports = instance;
