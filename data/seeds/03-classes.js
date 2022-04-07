exports.seed = function (knex) {
  return knex("classes").insert([
    {
      name: "pilates with tara",
      type: "pilates",
      start_time: "3:00 EST",
      duration: "2 hours",
      intensity_level: "fun",
      location: "Providence, RI",
      max_class_size: 22,
      instructor_id: 2,
    },
  ]);
};
