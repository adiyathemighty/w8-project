const express = require("express");
const router = express.Router();
const Board = require("../models/Board");

router.post("/new", (req, res) => {
  new Board({})
    .save()
    .then(newBoard => {
      res.send(newBoard);
    })
    .catch(err => {
      res.send({ error: err });
    });
});

router.post("/edit", (req, res) => {
  const { id } = req.body;
  //in case the title is a string with only whitespaces
  const title = req.body.title.trim();
  if (title) {
    //if there was a change, edit the field
    Board.findByIdAndUpdate({ _id: id }, { title }, { new: true })
      .then(updatedBoard => {
        res.send(updatedBoard);
      })
      .catch(err => {
        console.log(err);
        res.send({ error: "Edit: id doesn't exist" });
      });
  } else {
    Board.findById({ _id: id }).then(board => {
      //if nothing was changed just send the board
      res.send(board);
    });
  }
});

router.get("/data", (req, res) => {
  //browse view in which you see all exisiting boards
  Board.find({})
    .then(boards => {
      res.send(boards);
    })
    .catch(err => {
      res.send({ error: err });
    });
});

module.exports = router;
