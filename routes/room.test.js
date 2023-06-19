const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const Building = require('../models/building');
const User = require('../models/user');
const Room = require('../models/room');

const { testBuildings } = require("./building.test");

const testRooms = [
  {
    buildingName: "Maine",
    roomNumber: 8,
    duration: 60,
  },
  {
    buildingName: "Maryland",
    roomNumber: 12,
    duration: 30,
  },
];

describe("/room", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  
  afterEach(testUtils.clearDB);

  beforeEach( async () => {
    // Insert Building Info
    let savedBuilding = await Building.insertMany(testBuildings);
    savedBuilding = savedBuilding.map((building) => ({
      ...building.toObject(),
      _id: building._id
    }));

    // // Maine // 123
    testRooms[0].buildingId = savedBuilding[0]._id;
    // testRooms[0].userId = savedUser[0]._id;
    
    // // Maryland // 456
    testRooms[1].buildingId = savedBuilding[1]._id;
    // testRooms[1].userId = savedUser[1]._id;

    // console.log(testRooms)

    // console.log(testRooms)
  })
  

  describe('Before login', () => {
    describe('POST /', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).post("/room").send(testRooms[0]);
        expect(res.statusCode).toEqual(401);
      });
      it('should send 401 with a bad token', async () => {
        const res = await request(server)
        .post("/room")
        .set('Authorization', 'Bearer BAD')
        .send(testRooms[0]);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe('GET /', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get("/room").send(testRooms[0]);
        expect(res.statusCode).toEqual(401);
      });
      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get("/room")
          .set('Authorization', 'Bearer BAD')
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });
  });

  describe('after login', () => {   
    const user0 = {
      email: 'user0@mail.com',
      password: '123password'
    };
    const user1 = {
      email: 'user1@mail.com',
      password: '456password'
    }

    let token0;
    let adminToken;
    beforeEach(async () => {

      await request(server).post("/login/signup").send(user0);
      const res0 = await request(server).post("/login").send(user0);
      token0 = res0.body.token;

      await request(server).post("/login/signup").send(user1);
      await User.updateOne({ email: user1.email }, { $push: { roles: 'admin'} });
      const res1 = await request(server).post("/login").send(user1);
      adminToken = res1.body.token;
    });

    describe("GET /", () => {
      beforeEach(async () => {
        const res0 = await request(server)
          .post("/room")
          .set('Authorization', 'Bearer ' + token0)
          .send(testRooms.map(i => i._id));
        const res1 = await request(server)
          .post("/room")
          .set('Authorization', 'Bearer ' + adminToken)
          .send(testRooms.map(i => i._id));
      });

      it("should return all rooms", async () => {
        const res = await request(server)
        .get("/room")
        .set('Authorization', 'Bearer ' + adminToken)
        .send();
        expect(res.statusCode).toEqual(200);
        // console.log(res.body)
      });
    });

    describe("PUT /:id", () => {
      beforeEach(async () => {
        const res0 = await request(server)
          .post("/room")
          .set('Authorization', 'Bearer ' + token0)
          .send(testBuildings.map(i => i._id));
        const res1 = await request(server)
          .post("/room")
          .set('Authorization', 'Bearer ' + adminToken)
          .send(testBuildings.map(i => i._id));
      });

      describe("DELETE /:id", () => {
        beforeEach(async () => {
          const res0 = await request(server)
            .post("/room")
            .set('Authorization', 'Bearer ' + token0)
            .send(testRooms.map(i => i._id));
          const res1 = await request(server)
            .post("/room")
            .set('Authorization', 'Bearer ' + adminToken)
            .send(testRooms.map(i => i._id));
        });

        it("should reject a bad id", async () => {
          const res = await request(server)
          .delete("/room/fake")
          .set('Authorization', 'Bearer ' + adminToken)
          .send();
          expect(res.statusCode).toEqual(400);
        });
      });
    })  
  })
})