const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const test = require("./routes/test");
const signup = require("./routes/signup");
const { mongoose } = require("./db/mongoose");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", test);
app.use("/api", signup);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
