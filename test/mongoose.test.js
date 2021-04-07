const app = require('../server/index.js');
const mongoose = require('mongoose');
const supertest = require('supertest');

app.listen(5000, () => {
  console.log("Test server has started!")
})

// beforeAll((done) => {
//   const mdb = mongoose.connection;
//   mdb.on('error', console.error.bind(console, 'connection error:'));
// });

// afterAll((done) => {
//   mongoose.connection.db.dropDatabase(() => {
//     mongoose.connection.close(() => done())
//   });
// });

test("GET /importmongodb", async () => {
  await supertest(app).get("/importmongodb")
  .expect(200)
})