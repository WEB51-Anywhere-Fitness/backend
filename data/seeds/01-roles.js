exports.seed = function (knex) {
    return knex('roles').insert([
        { role_name: 'client' },
        { role_name: 'instructor' }
    ])
}