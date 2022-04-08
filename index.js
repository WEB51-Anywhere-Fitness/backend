// server import
const server = require("./api/server.js");

// allows for dynamic port so hosting works fine
const PORT = process.env.PORT || 9000;

// just a sanity check
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
