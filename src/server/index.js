require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const compression = require("compression");
const mongoose = require("mongoose");
const chalk = require("chalk");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const config = require("./config");

const apiRoutes = require("./routes/api");
const appRoutes = require("./routes/app");
const columnRoutes = require("./routes/column");

mongoose.connect(
  config.MONGODB_URI,
  { useNewUrlParser: true }
);

const server = express();

server.use(bodyParser.json());

server.use(
  "/graphql",
  graphqlHTTP({
    //options for graphql
    schema,
    graphiql: true
  })
);

server.use(helmet());
server.use(morgan("dev"));
server.use(compression());
server.use(fileUpload());

if (!config.IS_PRODUCTION) {
  server.use(express.static(path.join(__dirname, "../../dist")));
}

server.use(express.static(path.join(__dirname, "public")));
server.use("/api", apiRoutes);
server.use(appRoutes);

mongoose.connection.on("connected", () => {
  console.log(chalk.blue.bold("Connected to Mongo!"));

  // this is sometimes necessary to prevent mongoose errors
  const dir = fs.readdirSync(path.join(__dirname, "./models"));
  dir.forEach(model => require(`./models/${model}`));

  server.listen(config.PORT, () => {
    console.log(
      chalk.blue.bold(
        "Server is up and running: http://localhost:" + config.PORT
      )
    );
  });
});
