import { socket } from "./component/Socket";
import { useEffect, useState } from "react";

export interface Message {
  type: "system" | "group" | "private";
  sender?: string;
  room?: string;
  text: string;
}

function App() {
  console.log(socket);
  const [username, setUsername] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  // const [privateMsg,setPrivateMsg] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");

  console.log(messages);

  useEffect(() => {
    socket.on("online-users", (data: string[]) => {
      setOnlineUsers(data);
    });

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("send-message-group", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("online-users");
      socket.off("message");
      socket.off("send-message-group");
    };
  }, []);

  useEffect(() => {
    if (!joined) return;
    socket.emit("join", { username });
  }, [joined, username]);

  const sendGroupMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
 

    e.preventDefault();
    console.log(text);

    if (!text.trim()) return;
    console.log("sendgroup ");

    socket.emit("send-group", {
      groupText: text,
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
              className="border rounded-2xl shadow px-5 py-3 border-white text-white"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              className="bg-green-300 inline rounded-2xl mt-5 p-2"
              onClick={() => setJoined(true)}
            >
              Join
            </button>
          </div>
        </div>

        <div style={{ width: "20%" }} className="grid place-items-center mt-3">
          <h3 className="font-semibold ">Online Users</h3>
          {onlineUsers.length > 0 ? (
            onlineUsers.map((u, i) => (
              <div className="text-white" key={i}>
                {u}
              </div>
            ))
          ) : (
            <p>no online users</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-8xl mx-auto grid md:grid-cols-[30%_70%] grid-cols-1  mt-15 p-3">
      <div className="gird place-items-center">
        <h2 className="text-[30px]">Online user</h2>
        <ul>
          {onlineUsers.map((data, i) => {
            return (
              <li className="text-green-800" key={data + i}>
                {data}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="gird place-items-center border border-blue-500 p-4 rounded-md relative">
        <h1 className="text-[30px] mb-2">Group chat </h1>
        <div
          className=" w-full min-h-75 max-h-95
            overflow-y-auto"
        >
          {messages.map((data) => {
            return (
              <>
                {data.sender ? (
                  <div
                    className={`${data.sender == username ? " rounded-lg px-4 py-1 grid place-items-end  " : " grid place-items-end w-fit"} mt-2 `}
                  >
                    <div>
                      <h6 className={`text-white pl-2 ${data.sender == username ? "text-right" : ""} `}>
                        {data.sender == username ? "me" : data.sender}
                      </h6>
                      <h6 className={`${data.sender == username ?  "bg-blue-600 text-white px-4 py-2 rounded-b-lg rounded-tl-lg"  : "bg-gray-600 text-white px-4 py-2 rounded-b-lg rounded-tr-lg"} `}>{data.text}</h6>
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
              </>
            );
          })}
        </div>
        <div className="mt-6">
          <form action="" onSubmit={(e) => sendGroupMessage(e)}  >
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

export default App;
