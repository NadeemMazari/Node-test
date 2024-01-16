const express =require('express')
const {getMyChat,deleteForEveryOne,deleteForMe,search,chatList}=require('../Controller/chatController')
const {auth}=require('../midlleware/auth')
const route= express.Router()


route.post('/getMyChat',auth,getMyChat );
route.put('/deleteForMe/:messageId',auth,deleteForMe );
route.put('/deleteForEveryOne/:messageId',auth,deleteForEveryOne );
route.get('/search/:search',auth,search );
route.get('/chatList',auth,chatList );

module.exports= route;

