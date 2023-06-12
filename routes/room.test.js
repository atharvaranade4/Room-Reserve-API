const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const Building = require('../models/building');
const User = require('../models/user');
const Room = require('../models/room');

const { testBuildings } = require("./building.test");
const { testUsers } = require("./login.test");

describe("/room", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

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
    {
      buildingName: "Massachusetts",
      roomNumber: 14,
      duration: 120,
    }
  ];

  let token0;
  let adminToken;

  let savedBuilding;
  let savedUser;
  
  beforeEach(async () => {
    const user0 = {
      email: 'user0@mail.com',
      password: '123password'
    };
    const user1 = {
      email: 'user1@mail.com',
      password: '456password'
    }
    await request(server).post("/login/signup").send(user0);
    const res0 = await request(server).post("/login").send(user0);
    token0 = res0.body.token;
    await request(server).post("/login/signup").send(user1);
    await User.updateOne({ email: user1.email }, { $push: { roles: 'admin'} });
    const res1 = await request(server).post("/login").send(user1);
    adminToken = res1.body.token;

    // Insert Building Info
    savedBuilding = await Building.insertMany(testBuildings);
    savedBuilding = savedBuilding.map((building) => ({
      ...building.toObject(),
      _id: building._id.toString()
    }));
    // console.log('savedBuilding = ', savedBuilding)

    // Insert User Info
    savedUser = await User.insertMany(testUsers);
    savedUser = savedUser.map((user) => ({
      ...user.toObject(),
      _id: user._id.toString()
    }));
    // console.log('savedUser = ', savedUser)

    // Maine // 123
    testRooms[0].buildingId = savedBuilding[0]._id;
    testRooms[0].userId = savedUser[0]._id;

    // Maryland // 456
    testRooms[1].buildingId = savedBuilding[1]._id;
    testRooms[1].userId = savedUser[1]._id;

    // Massachusetts // 789
    testRooms[2].buildingId = savedBuilding[2]._id;
    testRooms[2].userId = savedUser[2]._id;

    let savedRooms = await Room.insertMany(testRooms);
    testRooms.forEach((room, index) => {
      room._id = savedRooms[index]._id.toString();
      // console.log('savedRooms = ', savedRooms)
      });
    });
  });
  afterEach(testUtils.clearDB);

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
    describe("GET /", () => {
        it("should return all rooms", async () => {
            const res = await request(server)
            .get("/room")
            .set('Authorization', 'Bearer ' + token0)
            .send();
            expect(res.statusCode).toEqual(200);
            testRooms.forEach(room => {
                expect(res.body).toContainEqual(
                expect.objectContaining(room)
                )
                // console.log(testRooms)
            })
        });
    });

  // describe("POST /", () => {
  //     it("should reject a room with an empty body", async () => {
  //       const room = {};
  //       const res = await request(server).post("/room").send(room);
  //       expect(res.statusCode).toEqual(400);
  //     });
  
  //     const fullRoom = {
  //         buildingName: "Maine",
  //         roomNumber: 8,
  //         duration: 60,
  //     };

  //     // it.each(["buildingName", "roomNumber", "duration", "userId", "buildingId"])
  //     //     ("should reject a room without a %s", async (fieldToRemove) => {
  //     //     const room = { ...fullRoom, userId: savedUser._id, buildingId: savedBuilding._id };
  //     //     console.log(room)    
  //     //     delete room[fieldToRemove];
  //     //     console.log(room)    
  //     //     const res = await request(server).post("/room").send(room);
  //     //     expect(res.statusCode).toEqual(400);
  //     // });
  
  //     it("should create a room", async () => {
  //       const room = { ...fullRoom, userId: savedUser[0]._id, buildingId: savedBuilding[0]._id };
  //       console.log(room)
  //       const res = await request(server).post("/room").send(room);
  //       expect(res.statusCode).toEqual(200);
  //       const { _id } = res.body;
  //       const savedRoom = await Room.findOne({ _id }).lean();
  //       savedRoom.buildingId = savedRoom.buildingId.toString();
  //       expect(savedRoom).toMatchObject(Room);
  //     });
  // });

  // describe("DELETE /:id", () => {
  //     it("should reject a bad id", async () => {
  //       const res = await request(server).delete("/room/fake").send();
  //       expect(res.statusCode).toEqual(400);
  //     });
      
  //     it("should delete the expected room", async () => {
  //       const { _id } = testRooms[1];
  //       const res = await request(server).delete("/room/" + _id).send({});
  //       expect(res.statusCode).toEqual(200);
  //       const storedRoom = await Room.findOne({ _id });
  //       expect(storedRoom).toBeNull();
  //     });
  // });
});