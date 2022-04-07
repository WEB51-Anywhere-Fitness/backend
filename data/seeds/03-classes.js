exports.seed = function (knex) {
  return knex("classes").insert([
    {
      name: "pilates with tara",
      type: "pilates",
      start_time: "3:00 EST",
      duration: "2 hours",
      intensity_level: "fun",
      location: "Providence, RI",
      registered_attendees: 4,
      max_class_size: 22,
      instructor_id: 2,
    },
  ]);
};
