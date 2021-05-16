const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http,{
  path: "/notification/"
});
const bodyparser = require("body-parser");

const ts = Date.now();
const date_ob = new Date(ts);
const PORT = process.env.PORT || 3000;

var sendedList = [];
var socketList =[]
var topic = "";
var message = "";


function sendNotification(){
  socketList=socketList.filter((value)=>value["socket"].connected)
  socketList.forEach(element => {
      element["socket"].emit("notification",{"topic":topic,"message":message})
      sendedList.push(element["email"])
    })
}

app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(bodyparser.json());

app.post("/notification", async(req, res) => {
  message = req.body.message;
  topic = req.body.topic;
  sendedList = [];
  sendNotification()
  res.send("Notification Updated");
});

io.on("connection", (socket) => {
    console.log(`Client is connected : ${socket.id}`);
    
    socket.on("subscribe",(data)=>{
 
      if (topic.length!=0 && sendedList.findIndex(ele=>ele===data["email"]) ==-1) {
        socket.emit("notification",{"topic":topic,"message":message})
        sendedList.push(data["email"])

      }
      socketList.filter((element, index)=>{
        if (element["email"]==data.email) {
          socketList.splice(index)
        }
      })
      socketList.push({"socket":socket,"email":data.email})
    })
});

http.listen(PORT, () => {
  console.log(
    date_ob.getFullYear() +
      ":" +
      date_ob.getMonth() +
      ":" +
      date_ob.getDate() +
      "::" +
      date_ob.getHours() +
      ":" +
      date_ob.getMinutes() +
      ":" +
      date_ob.getSeconds() +
      " Server listening on port " +
      PORT
  );
});
