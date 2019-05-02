var express = require("express");
var router = express.Router();
const User = require("../models/user");
const UserDetails = require("../models/userDetails");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/getAllUser", verifyToken, (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  let payload = jwt.verify(token, "secretKey");

  UserDetails.find({ uid: payload.subject })
    .then(results => {
      res.status(200).send(results);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === null) {
    return res.status(401).send("Unauthorized request");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.userId = payload.subject;
  next();
}

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(401).send({ errors: "Email already exists." });
    } else {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          User.create(newUser)
            .then(user => {
              let payload = { subject: newUser._id };
              let token = jwt.sign(payload, "secretKey");
              res.status(200).send({ token });
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(401).send("Email and Password does not match.");
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        let payload = { subject: user._id };
        let token = jwt.sign(payload, "secretKey");
        res.status(200).send({ token });
      } else {
        return res.status(401).send("Password is incorrect.");
      }
    });
  });
});

router.get("/logout", (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  localStorage.removeItem(token);
  return false;
});

router.post("/addUser", verifyToken, (req, res) => {
  if (req.userId) {
    UserDetails.findOne({ email: req.body.email }).then(userdetails => {
      if (userdetails) {
        return res.status(403).send("Email already exists");
      } else {
        const newUserDetails = new UserDetails({
          uid: req.userId,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone
        });

        newUserDetails.save((err, addUser) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).send({ success: "User added successfully" });
          }
        });
      }
    });
  } else {
    return res.status(401).send("User is not Authorize");
  }
});

router.get("/getUserById/:id", verifyToken, function(req, res) {
  if (req.userId) {
    UserDetails.findById(req.params.id).then(user => {
      if (!user) {
        return res.status(403).send("User not Found");
      } else {
        return res.status(200).send(user);
      }
    });
  } else {
    return res.status(401).send("User is not Authorize.");
  }
});

router.put("/editUser/:id", verifyToken, function(req, res) {
  if (req.userId) {
    UserDetails.findByIdAndUpdate(
      req.params.id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone
      },
      (err, user) => {
        if (err) {
          return res.status(500).send("there is some problem");
        } else {
          return res.status(200).send({ success: "User updated successfully" });
        }
      }
    );
  } else {
    return res.status(401).send("User is not Authorize.");
  }
});

router.delete("/deleteUser/:id", verifyToken, function(req, res) {
  if (req.userId) {
    UserDetails.findByIdAndRemove(req.params.id, (errors, result) => {
      if (errors) {
        return res.status(500).send(errors);
      } else {
        return res.status(200).send({
          success: "User deleted successfully."
        });
      }
    });
  } else {
    return res.status(401).send("User is not Authorize.");
  }
});

module.exports = router;
