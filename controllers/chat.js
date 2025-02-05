const Chat = require('../models/chat');
const Admin = require('../models/admin_model');
const Employee = require('../models/employee_model');


const addMessage = async (req, res) => {
    try {
        const file = req.files?.find(f => f.fieldname === 'file');
         let link ;

         if (file) {
            link = `http://localhost:3000/uploads/${file.filename}`;
        }else{
            link = null;
        }

       

        const message  = req.body.message
        

        const jsonerId =req.params.jsonerId 
        const receiverId =req.params.receiverId 

        if (!message) {
            return res.status(400).json( 'Content or attachment is required.' );
        }
        let actuallySend; 
        let actuallyReceived; 

        let data_jsoner = await Admin.findById(jsonerId) || await Employee.findById(jsonerId)
        let data_received = await Employee.findById(receiverId) || await Admin.findById(receiverId)

    
    actuallySend=data_jsoner
    actuallyReceived=data_received
        
   

if (!actuallySend || !actuallyReceived) {
    return res.status(404).json({ message: 'Sender or receiver not found.' });
}

        const jsonerType = actuallySend.role
        const receiverType = actuallyReceived.role
        

       
        const newMessage = new Chat({
            jsoner: jsonerId,
            receiver: receiverId,
            jsonerModel: jsonerType,
            receiverModel: receiverType,
            content: message,
            attachment:link,
        });

        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error jsoning message.', error });
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
                { jsoner: userIdSender, receiver: userIdReceiver },
                { jsoner: userIdReceiver, receiver: userIdSender },
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
        const { jsonerId, receiverId } = req.params;

        if (!jsonerId || !receiverId) {
            return res.status(400).json({ message: 'Both user IDs are required.' });
        }

        const result = await Chat.updateMany(
            {
                jsoner: jsonerId,
                receiver: receiverId,
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




