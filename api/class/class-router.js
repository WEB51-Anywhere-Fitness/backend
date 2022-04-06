const router = require("express").Router();
const Class = require("./class-model");

router.get("/", (req, res, next) => {
  Class.findAll()
    .then((classes) => {
      res.status(200).json(classes);
    })
    .catch(next);
});

router.get("/:class_id", (req, res, next) => {
  const { class_id } = req.params;
  Class.findById(class_id)
    .then((classes) => {
      res.json(classes);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  const body = req.body;
  if (
    !body.name ||
    !body.type ||
    !body.start_time ||
    !body.duration ||
    !body.intensity_level ||
    !body.location ||
    !body.registered_attendees ||
    !body.max_class_size
  ) {
    res.status(400).json({ message: "Please provide required credentials" });
    return;
  }
  Class.add(body)
    .then((classes) => {
      res.status(201).json(classes);
    })
    .catch(next);
});

router.delete("/:class_id", (req, res, next) => {
  const { class_id } = req.params;
  Class.deleteById(class_id)
    .then((classes) => {
      if (classes == null) {
        res.status(404).json({ message: "Does not exist" });
      } else {
        res.status(200).json(classes);
      }
    })
    .catch(next);
});

router.put("/:class_id", async (req, res, next) => {
  try {
    const updated = await Class.update(req.params.class_id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  //eslint-disable-line

  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
