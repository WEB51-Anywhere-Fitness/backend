const request = require("supertest");
const server = require("../api/server");
const db = require("../data/db-config");
const bcrypt = require("bcryptjs");
const jwtDecode = require("jwt-decode");

const Class = require("./class/class-model");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});
afterAll(async () => {
  await db.destroy();
});

test("sanity check", () => {
  expect(1).toBe(1);
});

test("testing findAll function", async () => {
  let result;
  // findAll
  result = await Class.findAll();
  expect(result).toHaveLength(1);
});

test("testing add function", async () => {
  result = await Class.add({
    name: "the great hamstring pull",
    type: "break your body type",
    start_time: "right now",
    duration: "lifelong",
    intensity_level: "way hard",
    location: "that one smelly gym",
    registered_attendees: 13,
    max_class_size: 13,
    instructor_id: 2,
  });
  expect(result).toMatchObject({
    name: "the great hamstring pull",
    class_id: 2,
  });
  result = await Class.findAll();
  expect(result).toHaveLength(2);
});

test("testing findById", async () => {
  let result;
  result = await Class.findAll();
  result = await Class.add({
    name: "the great hamstring pull",
    type: "break your body type",
    start_time: "right now",
    duration: "lifelong",
    intensity_level: "way hard",
    location: "that one smelly gym",
    registered_attendees: 13,
    max_class_size: 13,
    instructor_id: 2,
  });
  // findById
  result = await Class.findById(2);
  expect(result).toBeDefined();
  expect(result).toMatchObject({ name: "the great hamstring pull" });
});

test("testing update", async () => {
  let result;
  result = await Class.findAll();
  result = await Class.add({
    name: "the great hamstring pull",
    type: "break your body type",
    start_time: "right now",
    duration: "lifelong",
    intensity_level: "way hard",
    location: "that one smelly gym",
    registered_attendees: 13,
    max_class_size: 13,
    instructor_id: 2,
  });
  // update
  expect(result).toHaveProperty("name", "the great hamstring pull");
  result = await Class.update(2, { name: "the great groin pull" });
  expect(result).toHaveProperty("name", "the great groin pull");
  result = await Class.findById(2);
  expect(result).toHaveProperty("name", "the great groin pull");
});

test("testing deleteById", async () => {
  let result;
  result = await Class.findAll();
  result = await Class.add({
    name: "the great hamstring pull",
    type: "break your body type",
    start_time: "right now",
    duration: "lifelong",
    intensity_level: "way hard",
    location: "that one smelly gym",
    registered_attendees: 13,
    max_class_size: 13,
    instructor_id: 2,
  });
  // deleteById
  result = await Class.deleteById(42);
  expect(result).not.toBeDefined();
  result = await Class.findAll();
  expect(result).toHaveLength(2);
  result = await Class.deleteById(2);
  expect(result).toMatchObject({ name: "the great hamstring pull" });
  result = await Class.findAll();
  expect(result).toHaveLength(1);
});
