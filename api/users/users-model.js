// database config import
const db = require("../../data/db-config");

// model function returns all users, joining role_name and role_id
const findAll = () => {
  return db("users").join("roles as r", "u.role_id", "=", "r.role_id");
};

// model function to find by any given filter
function findBy(filter) {
  return db("users as u")
    .join("roles as r", "u.role_id", "=", "r.role_id")
    .select("u.user_id", "u.username", "u.password", "r.role_name as role")
    .where(filter);
}

// another behemoth async add function that returns the new user
async function add({ username, password, role_name }) {
  let created_user_id;
  await db.transaction(async (trx) => {
    let role_id_to_use;
    const [role] = await trx("roles").where("role_name", role_name);
    if (role) {
      role_id_to_use = role.role_id;
    } else {
      const [role_id] = await trx("roles").insert({ role_name: role_name });
      role_id_to_use = role_id;
    }
    const [user_id] = await trx("users").insert({
      username,
      password,
      role_id: role_id_to_use,
    });
    created_user_id = user_id;
  });
  let createdUser = await findById(created_user_id);
  createdUser.user_id = created_user_id;
  return createdUser;
}

// function to find by id
function findById(user_id) {
  return db("users as u")
    .join("roles as r", "u.role_id", "=", "r.role_id")
    .select("u.user_id", "u.username", "r.role_name")
    .where("u.user_id", user_id)
    .first();
}

// function to delete user, not really used yet seems like more of an admin thing but it cant hurt to keep it
function deleteById(user_id) {
  db("users").where("user_id", user_id).del();
  return findById(user_id);
}

// model function exports
module.exports = {
  add,
  findBy,
  findById,
  findAll,
  deleteById,
};
