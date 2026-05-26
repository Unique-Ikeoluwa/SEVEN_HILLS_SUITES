const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8300;



app.use("/", (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "Welcome to the Seven Hills",
        });
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});