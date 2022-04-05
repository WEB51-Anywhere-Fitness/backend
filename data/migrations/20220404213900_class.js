exports.up = function (knex) {
  return knex.schema.createTable("classes", (tbl) => {
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
      .integer("role_id")
      .unsigned()
      .notNullable()
      .references("role_id")
      .inTable("roles")
      .onUpdate("RESTRICT")
      .onDelete("RESTRICT");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("classes");
};
