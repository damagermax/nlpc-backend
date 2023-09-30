const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const routes = require("./routes/");
const connectDB = require("./utils/connectDb");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const upload = multer({ dest: "uploads/" });

dotenv.config({ path: "config/config.env" });

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(cors("*"));
app.use(upload.array("file"));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use("/api/v1", routes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on ${PORT}`);
  connectDB();
});

process.on("unhandledRejection", (error, promise) => {
  console.log(`ERROR ${error.message}`);
  server.close(() => process.exit(1));
});
