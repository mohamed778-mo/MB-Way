const Chat = require('../models/chat');
const Admin = require('../models/admin_model');
const Employee = require('../models/employee_model');


const addMessage = async (req, res) => {
    try {
        const file = req.files?.find(f => f.fieldname === 'file');
        let link = file ? `http://localhost:3000/uploads/${file.filename}` : null;
        
        const message  = req.body.message;
        const senderId = req.params.senderId;  
        const receiverId = req.params.receiverId;  

        if (!senderId || !receiverId) {
            return res.status(400).json('Both sender and receiver IDs are required.' );
        }

        if (!message) {
            return res.status(400).json( 'Content or attachment is required.' );
        }

        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json( 'Invalid sender or receiver ID format.');
        }

        let actuallySend = await Admin.findById(senderId) || await Employee.findById(senderId);
        let actuallyReceived = await Employee.findById(receiverId) || await Admin.findById(receiverId);

        if (!actuallySend || !actuallyReceived) {
            return res.status(404).json({ message: 'Sender or receiver not found.' });
        }

        const senderModel = actuallySend.role;
        const receiverType = actuallyReceived.role;

        const newMessage = new Chat({
            sender: senderId,
            receiver: receiverId,
            senderModel: senderModel,
            receiverModel: receiverType,
            content: message,
            attachment: link,
        });

        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully!', data: newMessage });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message.', error });
    }
};




const getMessages = async (req, res) => {
    try {
        const { userIdSender, userIdReceiver } = req.params;

     
        if (!userIdSender || !userIdReceiver) {
            return res.status(400).json({ message: 'Both user IDs are required.' });
        }

       
        const messages = await Chat.find({
            $or: [
                { sender: userIdSender, receiver: userIdReceiver },
                { sender: userIdReceiver, receiver: userIdSender },
            ],
        }).sort({ timestamp: -1 }).skip((page - 1) * limit).limit(limit); 

        res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving messages.', error });
    }
};

const markMessagesAsRead = async (req, res) => {
    try {
        const { userIdSender, userIdReceiver } = req.params;

        if (!userIdSender || !userIdReceiver) {
            return res.status(400).json({ message: 'Both user IDs are required.' });
        }

        const result = await Chat.updateMany(
            {
                sender: userIdSender,
                receiver: userIdReceiver,
                isRead: false,
            },
            {
                $set: { isRead: true },
            }
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
      const { chatId } = req.params;
  
      
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json('Chat not found!');
      }
  
    
      await Chat.findByIdAndDelete(chatId);
  
      res.status(200).json('Chat deleted successfully.');
    } catch (error) {
      res.status(500).json(error.message);
    }
  };
  

 const get_all_users = async (req, res) => {  
    try {
        const admins = await Admin.find().select('_id name role photo');
        const employees = await Employee.find().select('_id name role photo');
        
        if (admins.length === 0 && employees.length === 0) {
            return res.status(404).json({ message: 'No users found!' });
        }

        res.status(200).json([...admins, ...employees]); 
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


module.exports = { addMessage ,getMessages,markMessagesAsRead,deleteChat,get_all_users};




