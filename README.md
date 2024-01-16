# Node-test
# to install node_modules:  Run npm install
# to run code: RUN  npm start


# serve will be listened on port: 3000

NOTE: 
    Message can be sent only when clent is connected and client will emit data  on event "newMessage"
    Example 

    {
    "message":"test message ",
    "fromUserId":"65a5ee3d418591054d0abf54",
    "toUserId":"65a5693a79557db9084adaa2"
    }
    
after emiting newMessage a chat will be created in databace
