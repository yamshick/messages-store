const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const utils = require("./utils");
const app = express();
const fs = require("fs");
const {initialChats} = require('./constants')

let chats = initialChats

const port = process.env.PORT || 80;

// app.use(express.static("dist"));
app.use(bodyParser.json());


app.get("/chats/:userIds", function (req, res) {
  try {
    console.log(req.params);
    const { userIds } = req.params;
    if (!userIds) {
      res.status(400);
      res.send(
        JSON.stringify({
          error: { message: JSON.stringify(userIds) },
        })
      );
    }

    const userIdsArray = userIds.split(",").map(Number);

    chats.forEach((chat) => {
      if (!utils.areArrayEqual(userIdsArray, chat.userIds)) {
        // TODO: redo
        throw new Error("no chat found");
      }
      res.setHeader("Content-Type", "text/plain");
      res.end(JSON.stringify(chat));
    });
  } catch (e) {
    res.status(500);
    res.send(
      JSON.stringify({
        error: { message: e.toString() },
      })
    );
  }
});

app.post("/chat/send", function (req, res) {
  console.log(req.body);
  try {
    const { userIds, message, timeStamp, userId, userName, login } = req.body;
    if (
      ![userId, userIds, message, timeStamp, userName, login].every(Boolean)
    ) {
      res.status(400);
      res.send(
        JSON.stringify({
          error: {
            message: JSON.stringify({
              userId,
              userIds,
              message,
              timeStamp,
              userName,
              login,
            }),
          },
        })
      );
    }

    let chatToUpdate = null;
    chats.forEach((chat) => {
      if (!utils.areArrayEqual(userIds, chat.userIds)) {
        return;
      }
      chatToUpdate = chat;
    });

    const newMessages = [
      ...chatToUpdate.messages,
      {
        userId,
        userName,
        message,
        timeStamp,
        login,
      },
    ];
    const newChat = {
      ...chatToUpdate,
      messages: newMessages,
    };

    const newChats = [
      ...chats.filter((chat) => chat.id !== newChat.id),
      newChat,
    ];

    chats = newChats;

    res.status(200).send(JSON.stringify({ message }));
  } catch (e) {
    res.status(500);
    console.error(e);
    res.send(
      JSON.stringify({
        error: { message: e.toString() },
      })
    );
  }
});

app.get("/chats", (req, res) => {
  res.send(JSON.stringify({ chats }, null, 2));
});

app.get("/*", (req, res) => {
  res.send(JSON.stringify({ chats }, null, 2));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
