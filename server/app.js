var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var uuid = require("uuid/v4");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://ds227146.mlab.com:27146/eventdb", {
    auth: {
      user: "jasmin",
      password: "J@$min.1313"
    },
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log("connection succesful"))
  .catch(err => console.error(err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    genid: req => {
      return uuid(); // use UUIDs for session IDs
    },
    secret: "dmgjixiqepqzqrteirll",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("dmgjixiqepqzqrteirll"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.json(next);
  //next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
