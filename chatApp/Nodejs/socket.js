const server = require('http').createServer();
const io = require('socket.io')(server);
const authController = require('./controllers/auth');
//const cors = require("cors");
//io.use(cors());
io.on('connection', (socket) => {
    socket.on("addUser", async (data) => {
        socket.join('room1');
        data.isOnline = true;
        data.socketId = socket.id;
        var addSocketInDb = await authController.addSocketId(data);
        let getUserDeails, otherUserList;
        if (addSocketInDb.status) {
            getUserDeails = await authController.getUser(data);
            otherUserList = await authController.otherUserList();
        }

        var data = {
            loginUser: getUserDeails.status ? getUserDeails.data : {},
            userList: otherUserList.status ? otherUserList.data : []
        }
        io.to('room1').emit("userListResponce", data.userList)
        socket.emit("addUserResponce", data.loginUser)
    })
    socket.on("message", async (data) => {
        var insertMessage = await authController.insertMessages(data)
        if (insertMessage.status) {
            var messages = await authController.getMessages(data)
        }
        io.to('room1').emit("messageResponce", messages)
    })
    socket.on("getMessages", async (data) => {
        console.log("socket.id ==>", data)
        console.log("New client connected");
        var messages = await authController.getMessages(data)
        //socket.emit("messageResponce", messages)
        io.to('room1').emit("messageResponce", messages)
    })
    socket.on("disconnect", async () => {
        let data = {};
        console.log("disconnect");
        data.isOnline = false;
        data.socketId = socket.id;
        var removeuser = await authController.removeUser(data);
        var otherUserList = await authController.otherUserList();
        //socket.emit("messageResponce", messages)
        io.to('room1').emit("userListResponce", otherUserList.status ? otherUserList.data : [])
    })

});
const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
    console.log(`Socket is running on port ${PORT}.`);
});