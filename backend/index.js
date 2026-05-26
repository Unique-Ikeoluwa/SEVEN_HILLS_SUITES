const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
dotenv.config();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT;



app.use("/", (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "Welcome to the Seven Hills",
        });
})

const db = require("./models");


db.sequelize.authenticate()
  .then(() => {
    server.listen(PORT, () => {
      console.log(
        `Database connected successfully and Server running on PORT:${PORT}`
      );
    });
  })
  .catch((e) => {
    console.log(`Database connection failed:`, e);
  });

  