const request = require("supertest");
const server = require("../server");
const testUtils = require('../test-utils');

const User = require('../models/user');
const Building = require('../models/building');

const testBuildings = [
  { name: "Maine"},
  { name: "Maryland" },
  { name: "Massachusetts" }
];
module.exports = { testBuildings };

describe("/building", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  beforeEach(async () => {
    const savedBuildings = await Building.insertMany(testBuildings);
    testBuildings.forEach((building, index) => {
      building._id = savedBuildings[index]._id.toString();
    });
    // console.log(savedBuildings)
  });

  describe('Before login', () => {
    describe('POST /', () => {
      it('should send 401 without a token', async () => {
        const building = {};
        const res = await request(server).post("/building").send(building);
        expect(res.statusCode).toEqual(401);
      });
      it('should send 401 with a bad token', async () => {
        const building = {};
        const res = await request(server)
          .post("/building")
          .set('Authorization', 'Bearer BAD')
          .send(building);
        expect(res.statusCode).toEqual(401);
      });
    });
    describe('GET /', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get("/building");
        expect(res.statusCode).toEqual(401);
      });
      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get("/building")
          .set('Authorization', 'Bearer BAD')
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });
  });
  // console.log(testBuildings)

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
          .post("/building")
          .set('Authorization', 'Bearer ' + token0)
          .send(testBuildings);
        const res1 = await request(server)
          .post("/building")
          .set('Authorization', 'Bearer ' + adminToken)
          .send(testBuildings);
      });

      it('should send 200 for normal user all building', async () => {
        const res = await request(server)
          .get("/building")
          .set('Authorization', 'Bearer ' + token0)
          .send();
        expect(res.statusCode).toEqual(200);
        // console.log(res.body)
      });
      it("should send 200 for admin user all building", async () => {
        const res = await request(server)
          .get("/building")
          .set('Authorization', 'Bearer ' + adminToken)
          .send();
        expect(res.statusCode).toEqual(200);
      });
    });
    
    describe("POST /", () => {
      it('should send 400 for no building', async () => {
        const res = await request(server)
          .post("/building")
          .set('Authorization', 'Bearer ' + adminToken)
          .send();
        expect(res.statusCode).toEqual(400);

      });
      it('should send 403 to normal user', async () => {
        const res = await request(server)
          .post("/building")
          .set('Authorization', 'Bearer ' + token0)
          .send(testBuildings[0]);
        expect(res.statusCode).toEqual(403);
        const building = {...testBuildings[0]}
        const savedBuilding = await Building.findOne({ _id: building._id }).lean();
        savedBuilding._id = savedBuilding._id.toString();
        expect(savedBuilding).toMatchObject(building);
      });
      it('should send 200 to admin user and create building', async () => {
        const building = {
          name: 'Maryland',
        };
        const res = await request(server)
          .post("/building")
          .set('Authorization', 'Bearer ' + adminToken)
          .send(building);
        expect(res.statusCode).toEqual(200);
        const { _id } = res.body;
        const savedBuilding = await Building.findOne({ _id }).lean();
        expect(savedBuilding).toMatchObject(building);
      });
    });

    describe("PUT /:id", () => {
      beforeEach(async () => {
        const res0 = await request(server)
          .post("/building")
          .set('Authorization', 'Bearer ' + token0)
          .send(testBuildings.map(i => i._id));
        const res1 = await request(server)
          .post("/building")
          .set('Authorization', 'Bearer ' + adminToken)
          .send(testBuildings.map(i => i._id));
      });

      it("should reject an room with an empty body", async () => {
        const { _id } = testBuildings[0];
        const res = await request(server)
        .put("/building/" + _id)
        .set('Authorization', 'Bearer ' + adminToken)
        .send({});
        expect(res.statusCode).toEqual(400);
      });

      it("should reject a bad id", async () => {
        const res = await request(server)
        .put("/building/fake")
        .set('Authorization', 'Bearer ' + adminToken)
        .send();
        expect(res.statusCode).toEqual(400);
      });

      it("should update a building", async () => {
        const originalBuilding = testBuildings[2];
        const building = { ...originalBuilding };
        building.name = "Updated";
        const res = await request(server)
        .put("/building/" + building._id)
        .set('Authorization', 'Bearer ' + adminToken)
        .send(building);
        expect(res.statusCode).toEqual(200);
       
        const savedBuilding = await Building.findOne({ _id: building._id }).lean();
        savedBuilding._id = savedBuilding._id.toString();
        expect(savedBuilding).toMatchObject(building);
      });

    });

    describe("DELETE /:id", () => {
      beforeEach(async () => {
        const res0 = await request(server)
          .post("/building")
          .set('Authorization', 'Bearer ' + token0)
          .send(testBuildings.map(i => i._id));
        const res1 = await request(server)
          .post("/building")
          .set('Authorization', 'Bearer ' + adminToken)
          .send(testBuildings.map(i => i._id));
      });

      it("should reject a bad id", async () => {
        const res = await request(server)
        .delete("/building/fake")
        .set('Authorization', 'Bearer ' + adminToken)
        .send();
        expect(res.statusCode).toEqual(400);
      });
      it("should delete the expected building", async () => {
        const { _id } = testBuildings[1];
        const res = await request(server)
        .delete("/building/" + _id)
        .set('Authorization', 'Bearer ' + adminToken)
        .send();
        expect(res.statusCode).toEqual(200);
        const storedBuilding = await Building.findOne({ _id });
        expect(storedBuilding).toBeNull();
      });
    });
  });
});