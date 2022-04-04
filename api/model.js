const db = require('../data/dbConfig');

const findAll = () => {
return db('users')
  }
function findBy(filter) {
    return db("users")
      .select("id", "username", "password")
      .where(filter)
  }
  
  async function add(user) {
    const [id] = await db("users").insert(user)
    return findById(id)
  }
  
  function findById(id) {
    return db("users")
      .select("id", "username", "password")
      .where("id", id)
      .first()
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


