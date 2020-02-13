const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");

router.post("/", (req, res, next) => {
  console.log(req.body);
  let user = new User({
    _id: new mongoose.Types.ObjectId(),
    Name: req.body.Name,
    BirthDate: req.body.BirthDate,
    PersonalEmail: req.body.PersonalEmail,
  });
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/delete/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    await User.deleteOne({ _id: id }).exec();

    const newCompains = await User.find({}).exec();
    console.log(newCompains);
    return res.status(200).json(newCompains);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then(docs => {
      const response = {
        user: docs.map(doc => {
          return {
            Name: doc.Name,
            BirthDate: doc.BirthDate,
            PersonalEmail: doc.PersonalEmail,
            _id: doc._id
          };
        })
      };
      if (docs.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: "there are no users to bo shown" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
