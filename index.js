require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");


const mainRouter = require("./src/routers/main")

const app = express();
const logger = morgan(
    ":method :url :status :res[content-length] - :response-time ms"
  );

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Server sudah berjalan di port ${port}`);
});

const corsOption = {
    origin: "*",
    allowedHeaders: ["x-access-token","content-type"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  };
app.use(cors(corsOption));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

app.use(mainRouter)