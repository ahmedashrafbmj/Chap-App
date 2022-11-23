import Chat from "./components/chat/Chat";
import React from "react";
import {useState} from "react"
import io from "socket.io-client";
import "./App.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import { useHistory } from "react-router-dom";

const socket = io.connect("https://chatapp1222.herokuapp.com/");

const App = () => {
  // const history  =  useHistory()
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      // JSON.stringify(room)
      let room_id  = localStorage.setItem("room",  JSON.stringify(room))
      let name  = localStorage.setItem("name",  JSON.stringify(username))
      // JSON.stringify
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
//   function check(){
//   let check =   localStorage.getItem("room")
// console.log(check)
//   }
  return (
    <div>
     <div className="App">
      {localStorage.getItem("room") && localStorage.getItem("name")? (
       <Chat username={username} /> 
     
      ) : (
       <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
          {/* <button onClick={check}>check</button> */}
        </div>
      
      )}
    </div>
    </div>
  );
};

export default App;
