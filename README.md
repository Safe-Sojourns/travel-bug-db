# travel-bug-db

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[!Issues][issues-shield]][issues-url]
[![Mongoose][mongoose-shield]]
<!-- [![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
-->



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Safe-Sojourns/travel-bug-db">
    <img src="images/ladybug.png" alt="Logo" width="90" height="90">
  </a>

  <h3 align="center">TravelBug API</h3>
</p>


<!-- GETTING STARTED -->
## Getting Started

npm install

Check these to get your API working:

1. Make sure that postgresql and mongodb service are running

2. Make sure to change the absolute path to your csv files in schema.sql
COPY trips("name", "description")
FROM '/Users/chrisholley/hackReactor/blueOcean/travel-bug-db/db/trips.csv'
DELIMITER ','
CSV HEADER;

3. Run command in terminal to setup PostgreSQL database: psql postgres < ./db/schema.sql

4. Start the server: npm start

API should run on port [3001]

5. Import the mongo database by connecting to the endpoint: http://localhost:3001/importmongodb

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

**/** -
Sends routes options

**/logallevents** -
Endpoint to log all Events

**/logallusers** -
Endpoint to log all users

**/logalltrips** -

**/importmongodb** -
Endpoint to import entire dummy mongo data

**/deletemongodb** -
Endpoint to delete entire mongo database. Big red button

**/api/events/:tripId/:date** -
Engpoint to get all events on a specific trip and date. Requires trip id and date passed into url. DATE MUST BE IN YEAR-MONTH-DAY (0000-00-00)

**/api/events** -
Endpoint to create event. Passed into body property.

**/api/events/:event_id** -
Enpoint to get all information about a specific event. Requires event if passed into url

**/api/notes** -
Endpoint to update a users notes. Requires users id and notes string passed into body

**/api/users/:email** -
Endpoint to get all users information. Requires an email passed into url:

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/badge/Contributors-2-blue
[contributors-url]: https://github.com/Safe-Sojourns/travel-bug-db/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/Safe-Sojourns/travel-bug-db/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/Safe-Sojourns/travel-bug-db/stargazers
[mongoose-shield]: https://img.shields.io/badge/mongoose-v5.12.3-blue
[issues-shield]: https://img.shields.io/github/issues/Safe-Sojourns/travel-bug-db
[issues-url]: https://github.com/Safe-Sojourns/travel-bug-db/issues
