const db = require("../../data/db-config");

const findAll = () => {
  return db("classes as c").join(
    "users as u",
    "c.instructor_id",
    "=",
    "u.user_id"
  ).select(
    "c.class_id",
      "c.name",
      "c.type",
      "c.start_time",
      "c.duration",
      "c.intensity_level",
      "c.location",
      "c.registered_attendees",
      "c.max_class_size",
      "u.user_id as instructor_id",
      "u.username as instructor"
  );
};

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
      "c.registered_attendees",
      "c.max_class_size",
      "u.user_id as user"
    )
    .where(filter);
}
function deleteById(class_id) {
  return db("classes").del().where({class_id});
}

function findById(class_id) {
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
      "c.registered_attendees",
      "c.max_class_size"
    )
    .where("c.class_id", class_id)
    .first();
}

async function add({
  name,
  type,
  start_time,
  duration,
  intensity_level,
  location,
  registered_attendees,
  max_class_size,
  instructor_id
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
      registered_attendees,
      max_class_size,
      instructor_id
    });
    created_class_id = class_id;
  });
  let createdClass = await findById(created_class_id);
  createdClass.class_id = created_class_id;
  return createdClass;
}

module.exports = {
  add,
  findBy,
  findById,
  findAll,
  deleteById,
};
