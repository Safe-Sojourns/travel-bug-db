CREATE DATABASE travelbug_db;

CREATE USER travelbug WITH PASSWORD 'travelbug';

\c travelbug_db;

CREATE TABLE trips(
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(20),
  "description" VARCHAR(450)
);

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(20),
  lastName VARCHAR(20),
  email VARCHAR(100),
  "admin" BOOLEAN,
  notes VARCHAR(450),
  trip_id INT,
  "number" VARCHAR(12),
  homebase_long NUMERIC(17, 14),
  homebase_lat NUMERIC(17, 14),
  homebase_location VARCHAR(200),
  FOREIGN KEY (trip_id) REFERENCES trips (id)
);

CREATE TABLE trip_important_info (
  id SERIAL PRIMARY KEY,
  popo_phone VARCHAR(12),
  popo_location VARCHAR(100),
  popo_latitude NUMERIC(17, 14),
  popo_longitude NUMERIC(17, 14),
  hospital_location VARCHAR(100),
  hospital_latitude NUMERIC(17, 14),
  hospital_longitude NUMERIC(17, 14),
  trip_id INT,
  us_embassy_location VARCHAR(200),
  us_embassy_latitude NUMERIC(17, 14),
  us_embassy_longitude NUMERIC(17, 14),
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);

COPY trips("name", "description")
FROM '/Users/chrisholley/hackReactor/blueOcean/travel-bug-db/db/trips.csv'
DELIMITER ','
CSV HEADER;

COPY users(firstName, lastName, email, "admin",trip_id , "number", homebase_long, homebase_lat, homebase_location)
FROM '/Users/chrisholley/hackReactor/blueOcean/travel-bug-db/db/users.csv'
DELIMITER ','
CSV HEADER;

COPY trip_important_info(popo_phone, popo_location, popo_latitude, popo_longitude, hospital_location, hospital_latitude, hospital_longitude, trip_id, us_embassy_location, us_embassy_latitude, us_embassy_longitude)
FROM '/Users/chrisholley/hackReactor/blueOcean/travel-bug-db/db/trip_important_info.csv'
DELIMITER ','
CSV HEADER;

GRANT ALL ON TABLE users TO travelbug;
GRANT ALL ON TABLE trips TO travelbug;
GRANT ALL ON TABLE trip_important_info TO travelbug;
