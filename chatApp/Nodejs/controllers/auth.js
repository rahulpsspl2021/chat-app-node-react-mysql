const db = require("../models");
const config = require("../config");
const User = db.user;
const Message = db.message;



const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.chatInit = (req, res) => {
  let userId = Date.parse(new Date())
  User.findOne({
    where: {
      name: req.body.name
    }
  })
    .then(user => {
      if (!user) {
        User.create({
          name: req.body.name,
          userId: userId,
          isOnline: false,
        })
          .then(user => {
            res.status(200).send({
              status: true,
              message: "User saved successfully!",
              data: user
            });
          })
          .catch(err => {
            res.status(500).send({ status: false, message: err.message });
          });
      } else {
        res.status(200).send({
          status: true,
          message: "User verified successfully!",
          data: user,
        });
      }
    })
    .catch(err => {
      res.status(500).send({ status: false, message: err.message });
    });
};

exports.addSocketId = (req) => {
  let data = {
    isOnline: req.isOnline,
    socketId: req.socketId
  }
  let query = {
    where: { id: req.id },
    returning: true,
  }

  return new Promise(async (resolve, reject) => {
    try {
      User.update(data, query).then(updatedTask => {
        data = {
          status: true,
          data: updatedTask,
          message: "Subtask updated successfully!",
        }
        resolve(data);
      })
        .catch(err => {
          reject(err)
        });
    } catch (error) {
      reject(error)
    }
  });
};

exports.otherUserList = () => {

  let query = {
    where: {
      isOnline: true,
    }
  }

  return new Promise(async (resolve, reject) => {
    try {
      User.findAll(query).then(user => {
        data = {
          status: true,
          data: user,
          message: "getUser successfully!",
        }
        resolve(data);
      })
        .catch(err => {
          reject(err)
        });
    } catch (error) {
      reject(error)
    }
  });
};

exports.getUser = (req) => {

  let query = {
    where: { id: req.id }
  }

  return new Promise(async (resolve, reject) => {
    try {
      User.findOne(query).then(user => {
        data = {
          status: true,
          data: user,
          message: "getUser successfully!",
        }
        resolve(data);
      })
        .catch(err => {
          reject(err)
        });
    } catch (error) {
      reject(error)
    }
  });
};


exports.insertMessages = (messagePacket) => {
  return new Promise(async (resolve, reject) => {
    try {
      Message.create(messagePacket)
        .then(message => {
          data = {
            status: true,
            data: message,
            message: "added message successfully!",
          }
          resolve(data);
        })
        .catch(err => {
          reject(err)
        });
    } catch (error) {
      reject(error)
    }
  });
}

exports.getMessages = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      Message.findAll({
        where: {
          [Op.or]: [{ fromUserId: req.fromUserId, toUserId: req.toUserId }, { fromUserId: req.toUserId, toUserId: req.fromUserId }]
        },
        order: [
          ['id', 'ASC'],
        ],
        // include: [{
        //   model: User,
        //   as: '_fromUserId',
        //   attributes: ['id', 'name', 'userId']
        // },
        // {
        //   model: User,
        //   as: '_toUserId',
        //   attributes: ['id', 'name', 'userId']
        // }]
      }).then(messages => {
        //console.log("messages ==>", messages)
        data = {
          status: true,
          data: messages,
          message: "messages get successfully!",
        }
        resolve(data);
      })
        .catch(err => {
          reject(err)
        });
    } catch (error) {
      reject(error)
    }
  });
}

exports.removeUser = (req) => {
  let data = {
    isOnline: false,
  }
  let query = {
    where: {
      socketId: req.socketId
    },
    returning: true,
  }

  return new Promise(async (resolve, reject) => {
    try {
      User.update(data, query).then(updatedTask => {
        data = {
          status: true,
          data: updatedTask,
          message: "remove updated successfully!",
        }
        resolve(data);
      })
        .catch(err => {
          reject(err)
        });
    } catch (error) {
      reject(error)
    }
  });
};

