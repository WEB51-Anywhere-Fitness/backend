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

describe("DB Access Functions", () => {
  test("[1] sanity check", () => {
    expect(1).toBe(1);
  });

  test("[2] testing findAll function", async () => {
    let result;
    // findAll
    result = await Class.findAll();
    expect(result).toHaveLength(1);
  });

  test("[3] testing add function", async () => {
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

  test("[4] testing findById", async () => {
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

  test("[5] testing update", async () => {
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

  test("[6] testing deleteById", async () => {
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
});

describe("[POST] /api/auth/login", () => {
  test("[7] Has the correct message on valid login info", async () => {
    //register a user
    await request(server)
      .post("/api/auth/register")
      .send({ username: "bobby", password: "12345", role_name: "client" });

    //login the user
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bobby", password: "12345" });

    //test the welcome message
    expect(res.body.message).toMatch(/welcome bobby!/i);
  });
  test("[8] Has the correct status and message on invalid login info", async () => {
    //register a user
    await request(server)
      .post("/api/auth/register")
      .send({ username: "bobby", password: "12345", role_name: "client" });

    // test incorrect login credentials
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bobsy", password: "12345" });
    expect(res.body.message).toMatch(/invalid login credentials/i);
    expect(res.status).toBe(401);
    res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bobby", password: "123456" });
    expect(res.body.message).toMatch(/invalid login credentials/i);
    expect(res.status).toBe(401);
  });
  test("[9] Has a token with correct { subject, username, role_name, exp, iat }", async () => {
    //register a user
    await request(server)
      .post("/api/auth/register")
      .send({ username: "bobby", password: "12345", role_name: "client" });

    //login the user
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bobby", password: "12345" });

    // test the token
    let decoded = jwtDecode(res.body.token);
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("exp");
    expect(decoded).toMatchObject({
      subject: 8,
      role_name: "client",
      username: "bobby",
    });
  });
});

describe("[POST] /api/auth/register", () => {
  test("[10] Makes a new user in the database when client does not provide role_name", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "doopy", password: "1234" });
    const doopy = await db("users").where("username", "doopy").first();
    expect(doopy).toMatchObject({ username: "doopy" });
  });
  test("[11] Makes a new user with role_id 1 (the default role) when client does not provide role_name", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "doopy", password: "1234" });
    const doopy = await db("users").where("username", "doopy").first();
    expect(doopy).toMatchObject({ role_id: 1 });
  });
  test("[12] saves the user with a bcrypted password instead of plain text", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "doopy", password: "1234" });
    const doopy = await db("users").where("username", "doopy").first();
    expect(bcrypt.compareSync("1234", doopy.password)).toBeTruthy();
  });
  test("[13] leading and trailing whitespace is trimmed from the role_name", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "doopy",
      password: "1234",
      role_name: "    client    ",
    });
    expect(res.body).toMatchObject({
      username: "doopy",
      role_name: "client",
    });
  });
  test("[14] leading and trailing whitespace is trimmed from the role_name before validating", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "doopy",
      password: "1234",
      role_name: "              client              ",
    });
    expect(res.body).toMatchObject({
      username: "doopy",
      role_name: "client",
    });
  });
  test("[15] Has proper status and message on role_name over 32 chars after trimming", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "doopy",
      password: "1234",
      role_name: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    });
    expect(res.body.message).toMatch(/invalid role name/i);
    expect(res.status).toBe(422);
  });
  test("[16] Has proper status and message if a client tries to register as a instructor", async () => {
    let res = await request(server)
      .post("/api/auth/register")
      .send({ username: "doopy", password: "1234", role_name: "instructor" });
    expect(res.body.message).toMatch(/authorized personnel only/i);
    expect(res.status).toBe(422);
    res = await request(server).post("/api/auth/register").send({
      username: "doopy",
      password: "1234",
      role_name: "    instructor     ",
    });
    expect(res.body.message).toMatch(/authorized personnel only/i);
    expect(res.status).toBe(422);
  });
  test("[17] Has proper status on success", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "doopy", password: "1234" });
    expect(res.status).toBe(201);
  });
});
describe("[GET] /api/class", () => {
  test("[18] requests without a token are bounced with proper status and message", async () => {
    const res = await request(server).get("/api/class");
    expect(res.body.message).toMatch(/token required/i);
  });
  test("[19] requests with an invalid token are bounced with proper status and message", async () => {
    const res = await request(server)
      .get("/api/class")
      .set("Authorization", "foobar");
    expect(res.body.message).toMatch(/token invalid/i);
  });
  test("[20] requests with a valid token obtain a list of classes", async () => {
    //register a user
    await request(server)
      .post("/api/auth/register")
      .send({ username: "bobby", password: "12345" });

    //login the user
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bobby", password: "12345" });

    //correct token gets list of classes
    res = await request(server)
      .get("/api/class")
      .set("Authorization", res.body.token);
    expect(res.body).toMatchObject([
      {
        name: "pilates with tara",
      },
    ]);
  });
});
