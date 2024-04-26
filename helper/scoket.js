const { Server } = require('socket.io');

const saveSocketId = async(token,socketId,strapi)=>{
    try {
       
        if(!token){
            return false
        }
        const decodeToken =  await strapi.plugins[
            'users-permissions'
          ].services.jwt.verify(token);

        console.log("decodeToken",decodeToken);
        let {id} = decodeToken;
        if(!id){
            return false
        }
        await strapi.db.query("plugin::users-permissions.user").update({
           where:{
            id:id
           },
           data:{
            socketId:socketId
           }
        })
        return true
        
    } catch (error) {
        console.log("Error.",error);
        return false
        
    }
}

exports.socketIO = (strapi)=>{
    try {
        const io = new Server(strapi.server.httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST", "DELETE", "PUT"]
            }
        });



        io.on('connection', async (socket) => {
            console.log("socket connected...");
            const token = socket?.handshake?.auth?.token ?
                socket?.handshake?.auth?.token
                : socket?.handshake?.query?.token ?
                    socket?.handshake?.query?.token
                    : false;

            console.log("token",token)
            console.log(socket.id);

            socket.join(socket.id);
            await saveSocketId(token,socket.id,strapi)
         
            socket.on("test", (data) => {
                console.log("==>", data)
            })
            socket.on('disconnect', async () => {
                await saveSocketId(token,"",strapi)
                console.log("disconnect from strapi....");
            });
        })
        strapi.io = io;
        
    } catch (error) {
        console.log("Error",error)
    }
}