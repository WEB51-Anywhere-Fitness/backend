// database import
const db = require("../../data/db-config");

// db access function to find all classes
const findAll = () => {
  return db("classes as c")
    .join("users as u", "c.instructor_id", "=", "u.user_id")
    .select(
      "c.class_id",
      "c.name",
      "c.type",
      "c.start_time",
      "c.duration",
      "c.intensity_level",
      "c.location",
      "c.max_class_size",
      "u.user_id as instructor_id",
      "u.username as instructor"
    );
};

// access function that inserts registration object containing user_id and class_id into class_clients join table
function registerForClass(registration) {
  return db("class_clients").insert(registration);
}

// find by filter function, I don't know if we ended up using this at all but it's sort of nice to have :)
function findBy(filter) {
  return db("classes as c")
    .join("users as u", "c.instructor_id", "=", "u.user_id")
    .select(
      "c.class_id",
      "c.name",
      "c.type",
      "c.start_time",
      "c.duration",
      "c.intensity_level",
      "c.location",
      "c.max_class_size",
      "u.user_id as user"
    )
    .where(filter);
}

// delete function, self explanatory
async function deleteById(class_id) {
  const result = await findById(class_id);
  await db("classes").where("class_id", class_id).del();
  return result;
}

// find class by id, this one saw a ton of use because id can be passed in as a param so its easier, but it has two joins, one to get an instructor name and another to get a count of registered participants from the join table
function findById(class_id) {
  return db("classes as c")
    .join("users as u", "c.instructor_id", "=", "u.user_id")
    .leftJoin("class_clients", "c.class_id", "=", "class_clients.class_id")
    .count("class_clients.user_id", { as: "registered_attendees" })
    .select(
      "c.class_id",
      "c.name",
      "c.type",
      "c.start_time",
      "c.duration",
      "c.intensity_level",
      "c.location",
      "c.max_class_size"
    )
    .where("c.class_id", class_id)
    .first();
}

// access function that returns a list of attendees to a class by name from the join table
function getAttendeesById(class_id) {
  return db("class_clients as cc")
    .join("users as u", "cc.user_id", "=", "u.user_id")
    .select("u.username")
    .where("cc.class_id", class_id);
}

// behemoth asynchronous function that inserts a new class into the database
async function add({
  name,
  type,
  start_time,
  duration,
  intensity_level,
  location,
  max_class_size,
  instructor_id,
}) {
  let created_class_id;
  await db.transaction(async (trx) => {
    const [class_id] = await trx("classes").insert({
      name,
      type,
      start_time,
      duration,
      intensity_level,
      location,
      max_class_size,
      instructor_id,
    });
    created_class_id = class_id;
  });
  let createdClass = await findById(created_class_id);
  createdClass.class_id = created_class_id;
  return createdClass;
}

// async function that updates class
async function update(class_id, changes) {
  await db("classes").update(changes).where("class_id", class_id);
  return findById(class_id);
}

// model function exports
module.exports = {
  add,
  findBy,
  findById,
  findAll,
  deleteById,
  update,
  getAttendeesById,
  registerForClass,
};
