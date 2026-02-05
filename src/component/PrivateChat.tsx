import React, {   useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
 

interface userProps {
  username: string;
  id: string;
}
export interface Message {
  type: "system" | "group" | "private";
  sender?: userProps;
  room?: string;
  text: string;
}
interface privateMsgProps {
  onlineUser?: userProps[] | [];
  socket: Socket;
  username: string;
  privateMsg:Message[]
  showComponent:boolean
  senderId:userProps}

function PrivateChat({   socket, username ,privateMsg,showComponent,senderId}: privateMsgProps) {

 
   
  const [text, setText] = useState<string>("");
  const bottomRef  = useRef<HTMLDivElement |null >(null)
  
 
  console.log("sented id ",senderId)

  function sendPrivateMessage(e: React.FormEvent<HTMLFormElement>) {
   
    e.preventDefault();
    
    if(senderId){
            socket.emit("private-message", { toSocketId: senderId.id, message: text });
         
          setText("")
     

    }
   
    
  }
 useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [privateMsg]); 
 if(!showComponent) return " "
 
  return (
    <div className="mt-4">
      <div className="gird place-items-center border border-blue-500 p-4 rounded-md relative">
        <h1 className="text-[30px] mb-2">{`Private chat to:${senderId.username}`} </h1>
        <div
          className=" w-full min-h-75 max-h-95
            overflow-y-auto"
        >
          {privateMsg?.map((data) => {
            return (
              <>
                {data.sender?.id ? (
                  <div
                    className={`${data.sender.username == username ? " rounded-lg px-4 py-1 grid place-items-end  " : " grid place-items-end w-fit"} mt-2 `}
                  >
                    <div>
                      <h6
                        className={`text-white pl-2 ${data.sender.username == username ? "text-right" : ""} `}
                      >
                        {data.sender?.username == username ? "me" : data.sender.username}
                      </h6>
                      <h6
                        className={`${data.sender.username == username ? "bg-blue-600 text-white px-4 py-2 rounded-b-lg rounded-tl-lg" : "bg-gray-600 text-white px-4 py-2 rounded-b-lg rounded-tr-lg"} `}
                      >
                        {data.text}
                      </h6>
                    </div>
                  </div>
                ) : (
                  <div className="gird place-items-center">
                    <p
                      className={`text-center bg-gray-500 rounded-lg px-4 py-1" : "left"} mt-2 text-green-700 w-fit`}
                    >
                      <span className="text-black font-semibold text-[18px] pr-1">
                        {data.type}:
                      </span>{" "}
                      {data.text}
                    </p>
                  </div>
                )}
                 <div ref={bottomRef}></div>

              </>
            );
          })}
        </div>
        <div className="mt-6">
          <form action="" onSubmit={(e) => sendPrivateMessage(e)}>
            <div className="flex gap-4">
              <input
                className="w-full px-4 py-3
                bg-black text-white placeholder-gray-400
                border border-gray-700 rounded-lg
                focus:outline-none
                focus:border-blue-500
                focus:ring-2 focus:ring-blue-500/50
                transition"
                type="text"
                value={text}
                placeholder="enter the message here..."
                onChange={(e) => setText(e.target.value)}
              />
              <button
                className="text-white border border-amber-50 px-8 rounded-2xl"
                type="submit"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PrivateChat;
