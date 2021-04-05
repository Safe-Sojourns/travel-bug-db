
\c travelbug_db;

DROP TABLE IF EXISTS trip_important_info;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS trips;

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
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);

COPY trips("name", "description")
FROM '/Users/chrisholley/hackReactor/blueOcean/travel-bug-db/db/trips.csv'
DELIMITER ','
CSV HEADER;

COPY users(firstName, lastName, email, "admin",trip_id , "number")
FROM '/Users/chrisholley/hackReactor/blueOcean/travel-bug-db/db/users.csv'
DELIMITER ','
CSV HEADER;

COPY trip_important_info(popo_phone, popo_location, popo_latitude, popo_longitude, hospital_location, hospital_latitude, hospital_longitude, trip_id)
FROM '/Users/chrisholley/hackReactor/blueOcean/travel-bug-db/db/trip_important_info.csv'
DELIMITER ','
CSV HEADER;
