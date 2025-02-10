const Chat = require('../models/chat');
const Admin = require('../models/admin_model');
const Employee = require('../models/employee_model');
const mongoose = require('mongoose');


const addMessage = async (req, res) => {
  try {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ message: 'Content or attachment is required.' });
    }

    const sender = await Admin.findById(senderId) || await Employee.findById(senderId);
    const receiver = await Admin.findById(receiverId) || await Employee.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or receiver not found.' });
    }

    const senderModel = sender.role;
    const receiverModel = receiver.role;

    const file = req.files?.find(f => f.fieldname === 'file');
    let link = file ? `http://localhost:3000/uploads/${file.filename}` : null;

    const messageObject = {
      message: message || '',
      sender: senderId,
      timestamp: new Date(),
      isRead: false,
      attachment: link || null,
   
    };

    let chat = await Chat.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (!chat) {
      chat = new Chat({
        sender: senderId,
        receiver: receiverId,
        senderModel: sender.role,
        receiverModel: receiver.role,
        content: [messageObject],
      });
    } else {
      chat.content.push(messageObject);
    }

    await chat.save();

    res.status(201).json({ message: 'Message sent successfully!', data: chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message.', error });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userIdSender, userIdReceiver } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!userIdSender || !userIdReceiver) {
      return res.status(400).json('Both user IDs are required.');
    }

     const chats = await Chat.find({
      $or: [
        { sender: userIdSender, receiver: userIdReceiver },
        { sender: userIdReceiver, receiver: userIdSender },
      ]
    })
      .sort({ 'content.timestamp': -1 }) 
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedChats = chats.map(chat => {
      chat.content = chat.content.map(msg => ({
        ...msg,
        me: msg.sender.toString() === userIdSender
      }));
      return chat;
    });

    res.status(200).json(formattedChats);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const markMessagesAsRead = async (req, res) => {
    try {
        const { userIdSender, userIdReceiver } = req.params;

      
        if (!userIdSender || !userIdReceiver) {
            return res.status(400).json({ message: 'Both user IDs are required.' });
        }

    
        if (!mongoose.Types.ObjectId.isValid(userIdSender) || !mongoose.Types.ObjectId.isValid(userIdReceiver)) {
            return res.status(400).json({ message: 'Invalid user IDs.' });
        }

       
        const result = await Chat.updateMany(
      {
        sender: userIdSender,
        receiver: userIdReceiver,
        "content.isRead": false,
      },
      { $set: { "content.$[].isRead": true } }
    );


    
        res.status(200).json({
            message: 'Messages marked as read successfully.',
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating messages.', error });
    }
};

const deleteChat = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const chat = await Chat.findOneAndDelete({ sender: senderId, receiver: receiverId });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found!' });
        }

        res.status(200).json({ message: 'Chat deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting chat.', error });
    }
};
  

const get_all_users = async (req, res) => {
    try {
        const currentUserId = req.user._id; 
        const currentUserModel = req.user.role === 'Admin' ? 'Admin' : 'Employee'; 

     
        const admins = await Admin.find().select('_id name role photo isManager');
        const employees = await Employee.find().select('_id name role photo isManager');
        const allUsers = [...admins, ...employees];

        if (allUsers.length === 0) {
            return res.status(404).json({ message: 'No users found!' });
        }

      
        const usersWithLastMessage = await Promise.all(
            allUsers.map(async (user) => {
                // تجاهل المستخدم الحالي
                if (user._id.toString() === currentUserId.toString()) {
                    return {
                        ...user.toObject(),
                        lastMessage: null,
                        isRead: true,
                    };
                }

            
                const lastMessage = await Chat.findOne({
                    $or: [
                        { sender: currentUserId, receiver: user._id },
                        { sender: user._id, receiver: currentUserId },
                    ],
                })
                    .sort({ timestamp: -1 }) // ترتيب تنازلي للحصول على آخر رسالة
                    .select('content')
                    .exec();

                return {
                    ...user.toObject(),
                    lastMessage: lastMessage?.content[lastMessage.content.length - 1] || null, 
                    isRead: lastMessage ? lastMessage.isRead : true, 
                };
            })
        );

        res.status(200).json(usersWithLastMessage);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


const get_profile_by_id = async (req, res) => {
  try {
    const user_id = req.params.user_id;


    let user;
   
      user = await Admin.findById(user_id).select("name photo"); 
     if (!user) {
      user = await Employee.findById(user_id).select("name photo");
    } else {
      return res.status(404).json("User Not Exist!");
    }


    res.status(200).json( user );
  } catch (error) {
    res.status(500).json(error.message);
  }
};













module.exports = { addMessage ,getMessages , markMessagesAsRead , deleteChat , get_all_users , get_profile_by_id};




