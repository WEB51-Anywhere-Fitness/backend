exports.seed = function(knex) {
    return knex('class_clients')
        .insert([
            {
                class_id: 1, user_id: 3
            },
            {
                class_id: 1, user_id: 4
            },
            {
                class_id: 1, user_id: 5
            },
            {
                class_id: 1, user_id: 6
            },
    ]);
}