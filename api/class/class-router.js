// express import and router declaration
const router = require("express").Router();

// class model import
const Class = require("./class-model");

// jwt imports for rsvp route
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets");

// auth middleware import
const {
    restricted,
    only
} = require('../auth/auth-middleware');

// get all classes, restricted endpoint
router.get("/", restricted, (req, res, next)=>{
    Class.findAll()
    .then(classes => {
        res.status(200).json(classes);
    })
    .catch(next);
});

// get class by id, restricted endpoint
router.get("/:class_id", restricted, (req,res,next)=>{
    const {class_id} = req.params;
    Class.findById(class_id)
    .then(classes =>{
        res.json(classes)
    })
    .catch(next);
});

// get list of class attendees and count as well, restricted to instructor
router.get("/:class_id/attendees", restricted, only('instructor'), (req, res, next) => {
    const {class_id} = req.params;
    Class.getAttendeesById(class_id)
    .then(attendees => {
      const length = attendees.length;
      attendees.push({registered_attendees: length});
      res.json(attendees);
    })
    .catch(next);
});

// post endpoint for clients to sign up for classes, restricted to client
router.post("/:class_id/rsvp", restricted, only('client'), (req, res, next) => {
    const {class_id} = req.params;
    const token = req.headers.authorization;
    const decodedJWT = jwt.verify(token, JWT_SECRET)
    console.log(decodedJWT);
    Class.getAttendeesById(class_id)
    .then(attendees => {
      attendees.forEach(user => console.log(user))
      const exists = attendees.find(user => user.username === decodedJWT.username)
      console.log(exists);
      if(exists) {
        res.status(409).json({message: 'You have already signed up for this class!'});
      } else {
        Class.registerForClass({user_id: decodedJWT.subject, class_id: class_id})
          .then( ()  => {
            res.json({message: "Class sign-up successful!"})
        })
          .catch(next);
      }
    })
    .catch(next);
    
})

// post endpoint to add a class, restricted to instructor
router.post("/", restricted, only('instructor'), (req, res, next)=>{
    const body = req.body;
    if( !body.name || !body.type || !body.start_time || !body.duration || !body.intensity_level || !body.location || !body.registered_attendees|| !body.max_class_size ){
        res.status(400).json({message: "Please provide required credentials"})
        return;
    }
    Class.add(body)
    .then(classes =>{
        res.status(201).json(classes)
    })
    .catch(next);
});

// delete endpoint to remove class, restricted to instructor
router.delete("/:class_id", restricted, only(instructor), (req, res, next) => {
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

// update endpoint for an instructor to update a class
router.put("/:class_id", restricted, only(instructor), async (req, res, next) => {
  try {
    const updated = await Class.update(req.params.class_id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// error handling catch all
router.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

// router export
module.exports = router;
