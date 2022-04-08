# Anywhere Fitness
## **Product Description:**

These days, fitness classes can be held anywhere- a park, an unfinished basement or a garage- not just at a traditional gym. Certified fitness instructors need an easy way to take the awkwardness out of attendance taking and client payment processing.

While you could use several mobile apps to accomplish this, Anywhere Fitness is the all-in-one solution to meet your "on-location" fitness class needs. Anywhere Fitness makes it painless for Instructors and Clients alike to hold and attend Fitness classes wherever they might be held.

Instructors can take attendance, request and process payments, create virtual "punch passes" for each type of class offered, alert clients of cancellations or location changes and so much more. Clients can easily find out information on classes - location, class size, start time and duration, as well as reschedule or cancel an upcoming appointment or reservation right from the mobile app.

The Backend of this application contains authorization endpoints, three different endpoints for classes,users,and clients. We set up different tables to showcase data schemas for specific roles and classes.

### **API ENDPOINTS**

| METHOD | ENDPOINT                        | BODY(required)                                                               | BODY(optional)                   | NOTES                                                         |
|--------|---------------------------------|------------------------------------------------------------------------------|----------------------------------|---------------------------------------------------------------|
| POST   | :/api/auth/register             | username, password                                                           | role_name (instructor or client) | If no role name specified defaults to client.                 |
| POST   | :/api/auth/login                | username, password                                                           | N/A                              | Issues JWT to be placed in auth header.                       |
| GET    | :/api/auth/                     | N/A                                                                          | N/A                              | Requires JWT with role of instructor,  returns list of users. |
| GET    | :/api/auth/:user_id             | N/A                                                                          | N/A                              | Requires JWT with role of instructor,  returns user details.  |
|        |                                 |                                                                              |                                  |                                                               |
| GET    | :/api/class/                    | N/A                                                                          | N/A                              | Restricted, requires valid JWT Header                         |
| GET    | :/api/class/:class_id           | N/A                                                                          | N/A                              | Restricted, requires valid JWT Header                         |
| GET    | :/api/class/:class_id/attendees | N/A                                                                          | N/A                              | Requires JWT with role of instructor,  returns list of users. |
| POST   | :/api/class/:class_id/rsvp      | user_id, class_id                                                            | N/A                              | Requires JWT with role of client.                             |
| POST   | :/api/class/                    | name, type, start_time, duration,  intensity_level, location, max_class_size | N/A                              | Requires JWT with role of instructor.                         |
| DELETE | :/api/class/:class_id           | N/A                                                                          | N/A                              | Requires JWT with role of instructor.                         |
| PUT    | :/api/class/:class_id           | N/A                                                                          | N/A                              | Requires JWT with role of instructor.                         |

### **MEET THE TEAM**

**Will Phillips**

**LinkedIn:** [https://www.linkedin.com/in/will-p-750781223/](https://www.linkedin.com/in/will-p-750781223/)

**GitHub** :[https://github.com/WRWPhillips](https://github.com/WRWPhillips)

**Dirk Knibbe**

**LinkedIn:** [**https://www.linkedin.com/in/dirkknibbe/**](https://www.linkedin.com/in/dirkknibbe/)

**GitHub:** [https://github.com/dirkknibbe](https://github.com/dirkknibbe)

**Fatimah Sarwar**

**LinkedIn:** [**https://www.linkedin.com/in/fatimahsarwar/**](https://www.linkedin.com/in/fatimahsarwar/)

**GitHub:** [https://github.com/FatimahSarwar](https://github.com/FatimahSarwar)

# DEPLOYED HEROKU LINK:
**https://anywhere-fitness-web51.herokuapp.com/ **
