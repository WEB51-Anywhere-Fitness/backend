const db = require('../../data/db-config');

const findAll = () => {
  return db('users')
  .join('roles as r', 'u.role_id', '=', 'r.role_id');
}

function findBy(filter) {
  return db('users as u')
  .join('roles as r', 'u.role_id', '=', 'r.role_id')
  .select('u.user_id', 'u.username', 'u.password', 'r.role_name as role')
  .where(filter);
}
  

async function add({ username, password, role_name }) {
  let created_user_id
  await db.transaction(async trx => {
    let role_id_to_use
    const [role] = await trx('roles').where('role_name', role_name)
    if (role) {
      role_id_to_use = role.role_id
    } else {
      const [role_id] = await trx('roles').insert({ role_name: role_name })
      role_id_to_use = role_id
    }
    const [user_id] = await trx('users').insert({ username, password, role_id: role_id_to_use })
    created_user_id = user_id
  })
  let createdUser = await findById(created_user_id)
  createdUser.user_id = created_user_id
  return createdUser;
}

  
  function findById(id) {
    return db('users as u')
    .join('roles as r', 'u.role_id', '=', 'r.role_id')
    .select('u.user_id', 'u.username', 'r.role_name')
    .where("u.user_id", user_id)
    .first();
  }

  function deleteById(id) {
    db("users").where("id", id).del()
    return findById(id)
  }
module.exports = {
    add,
    findBy,
    findById,
    findAll,
    deleteById
  }


