exports.seed = function(knex) {
    return knex('users')
        .insert([
            { 
                username: "admin",
                password: "$2a$10$dJ3vqwwhXD6/iF9FIW2JAe9wWM0CWSFQT1HnbHx9MHMvEeKdvHUWq", //1234
                role_id: 2
            },
            {
                username: "tara-sampson",
                password: "$2a$10$LKXsE6m1CqZtQy/0zLyq/.ujQHbUpPEujevLMmi6r9xhXCIqT4qP2", //heinrich
                role_id: 2
            },
            {
                username: "client1",
                password: "$2a$10$47n5g6U9iVgWBc7LINTx5e3qepQJYWKmu4UxF.A2kdi9nmfDoJI96", //abcd
                role_id:1
            },
            {
                username: "client2",
                password: "$2a$10$47n5g6U9iVgWBc7LINTx5e3qepQJYWKmu4UxF.A2kdi9nmfDoJI96", //abcd
                role_id:1
            },
            {
                username: "client3",
                password: "$2a$10$47n5g6U9iVgWBc7LINTx5e3qepQJYWKmu4UxF.A2kdi9nmfDoJI96", //abcd
                role_id:1
            },
            {
                username: "client4",
                password: "$2a$10$47n5g6U9iVgWBc7LINTx5e3qepQJYWKmu4UxF.A2kdi9nmfDoJI96", //abcd
                role_id:1
            },
            {
                username: "client5",
                password: "$2a$10$47n5g6U9iVgWBc7LINTx5e3qepQJYWKmu4UxF.A2kdi9nmfDoJI96", //abcd
                role_id:1
            },
            
        ])
}