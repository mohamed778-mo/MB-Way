const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connection = require('./config/config');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');


const app = express();


app.use(helmet());


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(bodyParser.json({ limit: '1gb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '1gb', extended: true }));


app.use(cookieParser());


connection();


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
});


const adminRouter = require('./routers/admin_router');
const employeeRouter = require('./routers/empolyee_router');
const chatRouter = require('./routers/chat_router');
const meetingRouter = require('./routers/meeting_router');
const formRouter = require('./routers/form_router');
const FRpasswordRouter = require('./routers/forgretpassword_router');
const loginRouter = require('./routers/login_router');
const engRouter = require('./routers/Eng_router');
const commerceRouter = require('./routers/commerce_router');

const dashboardRouter = require('./routers/website/dashboard_router');



app.use('/app/choice', loginRouter);
app.use('/app/chat', chatRouter);
app.use('/app/admin', adminRouter);
app.use('/app/employee', employeeRouter);
app.use('/app/meeting', meetingRouter);
app.use('/app/form', formRouter);
app.use('/app/user', FRpasswordRouter);
app.use('/app/eng', engRouter);
app.use('/app/commerce', commerceRouter);
app.use('/app/dashboard', dashboardRouter);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (chatId) => {
        socket.join(chatId);
    });

    socket.on('sendMessage', ({ chatId, sender, content }) => {
        io.to(chatId).emit('receiveMessage', { sender, content, timestamp: new Date() });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});


const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
