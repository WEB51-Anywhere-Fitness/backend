exports.up = function (knex) {
  return knex.schema
    .createTable("classes", (tbl) => {
      tbl.increments("class_id");
      tbl.string("name", 128).notNullable().unique();
      tbl.string("type", 128).notNullable();
      tbl.string("start_time", 128).notNullable();
      tbl.string("duration", 128).notNullable();
      tbl.string("intensity_level", 128).notNullable();
      tbl.string("location", 128).notNullable();
      tbl.integer("registered_attendees", 32).notNullable();
      tbl.integer("max_class_size", 32).notNullable();
      tbl
        .integer("instructor_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
    })
    .createTable('class_clients', (tbl) => {
      tbl.increments('class_client_id');
      tbl.integer('class_id')
        .unsigned()
        .notNullable()
        .references('class_id')
        .inTable('classes')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      tbl.integer('user_id')
      .unsigned()
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("classes");
};
