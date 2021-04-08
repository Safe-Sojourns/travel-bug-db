const app = require('../server/index.js');
const mongoose = require('mongoose');
const supertest = require('supertest');
const mdb = require('../db/mongoose.js')

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

test("GET /deletemongodb", async () => {
  await supertest(app).get("/deletemongodb")
})

it('Should return empty db', async done => {
  const events = await mdb.eventModel.find({})
  expect(events.criticalMessages).toBeTruthy()
  done()
  console.log('this should be empty events collection', events)
})

// test("check for empty mdb events" async () => {

// })

test("GET /importmongodb", async () => {
  await supertest(app).get("/importmongodb")
  .expect(200)
})