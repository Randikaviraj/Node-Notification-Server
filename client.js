// import { io } from "socket.io-client";
const io =require("socket.io-client")

const socket = io("http://localhost:3000", {
  path: "/notification/"
});

socket.on("notification",(data)=>{
    console.log(data)
})
console.log(process.env.Email)

socket.emit("subscribe",{"email":process.env.Email})