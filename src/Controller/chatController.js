const chatModel = require("../schema/chatSchema");
const userModel = require("../schema/userSchema");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const createMessage = async (data) => {
  try {
    console.log(data);
    let resp = await chatModel.create(data);
    if (resp._id) {
      console.log("chat created");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getMyChat = async (req, res) => {
  try {
    const { toUserId } = req.body;
    let token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    let userId = decodedToken._id;
    console.log(userId);
    let resp = await chatModel.aggregate([
      {
        $match: {
          $or: [
            {
              $and: [
                { fromUserId: new ObjectId(userId) },
                { toUserId: new ObjectId(toUserId) },
              ],
            },
            {
              $and: [
                { fromUserId: new ObjectId(toUserId) },
                { toUserId: new ObjectId(userId) },
              ],
            },
          ],
        },
      },

      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "fromUserId",
          as: "fromUserData",
        },
      },
      {
        $unwind: "$fromUserData",
      },
      {
        $addFields: {
          messageType: {
            $cond: {
              if: { $eq: ["$fromUserId", new ObjectId(userId)] },
              then: "sent",
              else: "received",
            },
          },
          sentBy: {
            $cond: {
              if: { $eq: ["$fromUserId", new ObjectId(userId)] },
              then: "You",
              else: "$fromUserData.username",
            },
          },
          message: {
            $cond: {
              if: { $eq: ["$isDeletetForEveryOne", true] },
              then: "Message Deleted",
              else: {
                $cond: {
                  if: { 
                    $and: [
                      { $eq: ["$isDeletetForMe", true] },
                      { $eq:  ["$fromUserId", new ObjectId(userId)] },
                    ],
                   },
                  then: "Message Deleted",
                  else:'$message'
                },
              },
            },
          },
        },
      },
      {
        $project:{
          fromUserData:0
        }
      }
    ]);
    res.status(200).json({ isSuccess: true, data: resp, message: "success" });
  } catch (error) {
    res
      .status(404)
      .json({ isSuccess: false, data: {}, message: error.message });
  }
};

chatList = async (req, res) => {
  try {
    let token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    let userId = decodedToken._id;
    let chatList = chatModel.aggregate([
      {
        $match: {
          $or: [
            { fromUserId: new ObjectId(userId) },
            { toUserId: new ObjectId(userId) },
          ],
        },
      },
    ]);
  } catch (error) {
    res
      .status(404)
      .json({ isSuccess: false, data: {}, message: error.message });
  }
};

search = async (req, res) => {
try {
  let token = req.headers.authorization;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  let userId = decodedToken._id;
  let search = req.params.search;
    console.log(search);
  let chat= await chatModel.aggregate([
    {
      $match: {
        fromUserId: new ObjectId(userId),
        isDeletetForEveryOne:false,
        isDeletetForMe:false,
        message:{ $regex: search, $options: 'i'}
      },
    },
  ])


  let user= await userModel.find({username:{ $regex: search, $options: 'i'}})

  res.status(200).json({ isSuccess: true, data: {messages:chat,users:user }, message: "success" });
} catch (error) {
  res
  .status(404)
  .json({ isSuccess: false, data: {}, message: error.message });
}
};

deleteForMe = async (req, res) => {

  let token = req.headers.authorization;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  let userId = decodedToken._id;
  let messageId = req.params.messageId;
  let message = await chatModel.findById(new ObjectId(messageId));
  if (userId == message.fromUserId) {
    let resp = await chatModel.updateOne(
      { _id: message._id },
      { $set: { isDeletetForMe: true } }
    );
    if (resp.modifiedCount > 0) {
      res.status(200).json({
        isSuccess: true,
        data: {},
        message: "Message Deleted for me ",
      });
    } else {
      res
        .status(403)
        .json({ isSuccess: false, data: {}, message: "Something went wrong" });
    }
  } else {
    res.status(404).json({
      isSuccess: false,
      data: {},
      message: "You are not authenticated",
    });
  }
};
deleteForEveryOne = async (req, res) => {
  let token = req.headers.authorization;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  let userId = decodedToken._id;
  let messageId = req.params.messageId;
  let message = await chatModel.findById(new ObjectId(messageId));
  if (userId == message.fromUserId) {
    let resp = await chatModel.updateOne(
      { _id: message._id },
      { $set: { isDeletetForEveryOne: true } }
    );
    if (resp.modifiedCount > 0) {
      res.status(200).json({
        isSuccess: true,
        data: {},
        message: "Message Deleted for everyone ",
      });
    } else {
      res
        .status(403)
        .json({ isSuccess: false, data: {}, message: "Something went wrong" });
    }
  } else {
    res.status(404).json({
      isSuccess: false,
      data: {},
      message: "You are not authenticated",
    });
  }
};

module.exports = {
  createMessage,
  getMyChat,
  deleteForMe,
  deleteForEveryOne,
  search
};
