 
 import { Socket } from "socket.io-client";
import {socket} from "./component/Socket"
 import { useEffect, useRef, useState } from "react";



export interface Message {
  type: "system" | "group" | "private";
  sender?: string;
  room?: string;
  text: string;
}

 
 
 

function App() {
    const [username, setUsername] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");
  const [room, setRoom] = useState<string>("general");
  const soketRef= useRef<Socket | null>(null)
  useEffect(()=>{

    if(!soketRef.current){
     soketRef.current =  socket.connect();

    }
    socket.on("online-users",(data:string[])=>{
      setOnlineUsers(data)
    })
    if (!joined){
      return
    }
    
    socket.emit("join",{username})
   
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    return ()=>{
      socket.off("online-users")
      socket.off("message")
      socket.disconnect()
    }
    


  },[joined])


   const joinRoom = (): void => {
    socket.emit("join-room", { roomName: room });
  };

   const sendGroupMessage = (): void => {
    if (!text.trim()) return;

    socket.emit("group-message", {
      roomName: room,
      message: text,
    });

    setText("");
  };




   if (!joined) {
    return (
      <div className="grid place-items-center  ">
      <div style={{ padding: 20 }} className="shadow mt-10">
        <h2 className="text-[30px] text-center font-semibold">Join Chat</h2>
        <div className="flex flex-col justify-center">
               <input
               className="border rounded-2xl shadow px-5 py-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="bg-green-300 inline rounded-2xl mt-5 p-2" onClick={() => setJoined(true)}>Join</button>
        </div>
   
      </div>

      <div style={{ width: "20%" }} className="grid place-items-center mt-3">
        <h3 className="font-semibold " >Online Users</h3>
        {onlineUsers.map((u, i) => (
          <div className="text-green-700" key={i}>{u}</div>
        ))}
      </div>

      </div>
    );
  }

 
 
 

 
return (
    <div style={{ display: "flex", padding: 20 }}>
      {/* Online Users */}
      <div style={{ width: "20%" }}>
        <h3>Online Users</h3>
        {onlineUsers.map((u, i) => (
          <div key={i}>{u}</div>
        ))}
      </div>

      {/* Chat Section */}
      <div style={{ width: "80%", marginLeft: 20 }}>
        <h3>Room: {room}</h3>

        <input
          placeholder="Room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>

        <div
          style={{
            height: 300,
            border: "1px solid #ccc",
            marginTop: 10,
            padding: 10,
            overflowY: "auto",
          }}
        >
          {messages.map((m, i) => (
            <div key={i}>
              {m.type === "system" && <i>{m.text}</i>}
              {m.type === "group" && (
                <b>
                  {m.sender}: {m.text}
                </b>
              )}
              {m.type === "private" && (
                <span>
                  (Private) {m.sender}: {m.text}
                </span>
              )}
            </div>
          ))}
        </div>

        <input
          placeholder="Type message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={sendGroupMessage}>Send</button>
      </div>
    </div>
  );
  }

 
 

export default App
