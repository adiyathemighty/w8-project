const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const Column = require("../models/Column");

router.post("/new", (req, res) => {
  const { boardId, columnTitle: title } = req.body;
  //create the column
  Column.create({ title }).then(column => {
    //find the board it's on
    Board.findByIdAndUpdate(
      { _id: boardId },
      //add the id to the board
      { $push: { columns: column._id } },
      { new: true }
    ).then(board => {
      res.send(board);
    });
  });
});

router.post("/delete", (req, res) => {
  const { sourceColumnId, destinationColumnId, boardId } = req.body;
  let ticketsFromSource = [];

  //if there there were tickets in the source column
  //there will be a destination
  if (typeof destinationColumnId !== "undefined") {
    //find column by id
    Column.findById({ _id: sourceColumnId }).then(column => {
      //get all tickets from source
      ticketsFromSource = column.ticket.map(ticket => {
        return ticket._id;
      });
      Column.findByIdAndUpdate(
        { _id: destinationColumnId },
        //add them to the destination column
        { $push: { ticket: { $each: ticketsFromSource } } },
        { new: true }
      ).then(column => {
        Column.findByIdAndRemove({ _id: sourceColumnId }).then(() => {
          Board.findByIdAndUpdate(
            { _id: boardId },
            { $pull: { columns: sourceColumnId } },
            { safe: true }
          ).then(board => {
            res.send(board);
          });
        });
      });
    });
  } else {
    //there were no tickets in the source column
    Column.findByIdAndRemove({ _id: sourceColumnId }).then(column => {
      Board.findByIdAndUpdate(
        { _id: boardId },
        { $pull: { columns: sourceColumnId } },
        { safe: true }
      ).then(board => {
        res.send(board);
      });
    });
  }
});

router.post("/update", (req, res) => {
  let updatedFields = {};
  let updatedTickets = [];
  // { $set: { <field1>: <value1>, ... }, $push: { <field>: <value>, ..} }
  const { title, limit, order, tickets, id } = req.body;

  if (title) {
    updatedFields["title"] = title;
  }

  if (limit) {
    updatedFields["limit"] = limit;
  }

  // if (order) {
  //   updatedFields.push({ order: order });
  // }

  if (tickets) {
    updatedFields["ticket"] = tickets.map(ticket => {
      return ticket._id;
    });
  }

  // [{ticket: Array(12), _id: "5ba262562cb1d15f17832d99", title: "To Do", __v: 0}

  // {ticket: Array(0), _id: "5ba2637a2cb1d15f17832d9a", title: "Doing", __v: 0}]

  Column.findByIdAndUpdate(
    { _id: id },
    { $set: updatedFields },
    { new: true }
  ).then(updatedColumn => {
    res.send(updatedColumn);
  });
});

module.exports = router;
