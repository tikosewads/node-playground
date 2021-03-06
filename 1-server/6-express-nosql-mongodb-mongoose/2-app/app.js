require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

// MONGOOSE HERE

const mongoose = require("mongoose");
const User = require("./models/user");

const errorController = require("./controllers/error");

const app = express().enable();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("606a0cdc5e9aa12fb4ad243d")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//menghubungkan ke database
mongoose
  .connect(process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          username: "amyar32",
          email: "someemail@gmail.com",
          cart: { items: [] },
        });
        user.save();
      } else {
        console.log("User Found!");
      }
    });
    console.log("Listening...");
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
