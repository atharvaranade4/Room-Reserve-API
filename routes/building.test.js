const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const Buildings = require('../models/building');

const testBuildings = [
  {
    name: "Maine",
  },
  {
    name: "Maryland",
  },
  {
    name: "Massachusetts",
  }
]

module.exports = { testBuildings };