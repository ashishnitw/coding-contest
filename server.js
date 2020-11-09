const express = require('express'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  process = require('process');

// const pool = require('./db');

const app = express();
const port = 5000 || process.env.PORT;

app.use(cors());			                                //CORS - allows any client to access it.
app.use(bodyParser.json());                           // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true }));   // parse requests of content-type - application/x-www-form-urlencoded

const routes = require('./lib/routes');
app.use(routes);

// const sql_create_table = `DROP TABLE IF EXISTS users;
// CREATE TABLE users (
//   id BIGSERIAL PRIMARY KEY,
//   password VARCHAR(255) NOT NULL,
//   salt VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL,
//   token VARCHAR(255),
//   created_at VARCHAR(255),
//   updated_at VARCHAR(255)
// );`;

// pool.query(sql_create_table, [], (err, result) => {
//   if (err) {
//     return console.error("ERROR: Table not created", err)
//   }
//   console.log("Successful creation of the 'users' table");
// });

app.listen(port, () => {
  console.log(`Server listening on ${port}`)
});