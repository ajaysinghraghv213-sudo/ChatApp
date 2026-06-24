import {useEffect,useState,useRef} from 'react'
import {Link, useParams} from 'react-router-dom'
import {fetchRefreshToken} from '../utils/utils'
import EmojiPicker from "emoji-picker-react";
const Chat= () =>{
    const [chats,setChats] = useState([])
    const [users,setUsers] = useState([])
    const [messages,setMessages] = useState('')
    const [socket,setSocket] = useState(null)
    const [files,setFiles] = useState(null)
    const timeoutRef = useRef(null);
    const [emoji,setEmoji] = useState(false)
    const [selectedmessage,setSelectedMessage]=useState(null)
    const [pressTimer,setPressTimer] = useState(null)
    const [editingmessages,setEditingMessages] = useState(null)
    const [edittext,setEditText] = useState('')

    const {id} = useParams()
    const username=localStorage.getItem('username')
     
    useEffect(() => {
        console.log('useffect running ')
      
        
        
    const fetchChats = async () => {
       
        let access = localStorage.getItem('access');

        let response = await fetch(
            `https://chatapp-5-4d4v.onrender.com/chats/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            }
        );

        if (response.status === 401) {
            await fetchRefreshToken();

            access = localStorage.getItem('access');

            response = await fetch(
                `https://chatapp-5-4d4v.onrender.com/chats/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                }
            );
        }

        const data = await response.json();
         console.log("status =", response.status)
        console.log("data =", data)
        console.log(data)

        if (response.ok) {
            setChats(data);
            console.log(chats)
            console.log(data);
        } else {
            alert("Something went wrong");
        }
    };

    fetchChats();
}, [id]);

    useEffect(() => {
  const fetchUsers = async () => {
    let access = localStorage.getItem("access");

    let response = await fetch("https://chatapp-5-4d4v.onrender.com/users/", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (response.status === 401) {
      await fetchRefreshToken();

      access = localStorage.getItem("access");

      response = await fetch("https://chatapp-5-4d4v.onrender.com/users/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    }

    const data = await response.json();

    if (response.ok) {
      setUsers(data);
      console.log(data);
    }
  };

  fetchUsers();
}, [id]);

  useEffect(() => {
    let ws;

    const connectSocket = async () => {
        let access = localStorage.getItem("access");

        await fetchRefreshToken();

        access = localStorage.getItem("access");

        ws = new WebSocket(
            `ws://127.0.0.1:8000/ws/message/${id}/?token=${access}`
        );

        setSocket(ws);

        ws.onopen = () => {
            console.log("connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log(data);

            if (data.type === "message") {
                setChats((prev) => [...prev, data]);
                setMessages("");
            }
            if (data.type==='delete'){
                setChats((prev)=>prev.filter((msg)=>msg.id!==data.message_id))
            }
            if (data.type==='edit'){
                setChats((prev)=>prev.map((msg)=>msg.id==data.message_id?{...msg,message:data.message,is_updated:true}:msg))
            }
            if (data.type === 'typing'){
                const typeinput = document.getElementById('type-input')

                if(data.is_typing){
                   typeinput.innerText = `${data.username} is typing...`;
                }
                else{
                    typeinput.innerText = ''
                }
            }

            if (data.type === "read") {
                setChats((prev) =>
                    prev.map((msg) =>
                        msg.id === data.message_id
                            ? { ...msg, is_read: true }
                            : msg
                    )
                );
            }
        };
    };

    connectSocket();

    return () => {
        if (ws) {
            console.log("closing");
            ws.close();
        }
    };
}, [id]);
 

    useEffect(()=>{
       
        

        if(!socket){
            return ;
        }
        if(socket.readyState !== WebSocket.OPEN){
            return ;
        }
        chats.forEach((chat)=>{
            if(chat.id && chat.sender!==username&& !chat.is_read){
                socket.send(
                    JSON.stringify({
                        'type':'read',
                        'message_id':chat.id
                    })
                )
                console.log('sended')
            }
        })
    },[chats,socket,username])


    const handleChange = (e) => {
    setMessages(e.target.value);

    socket.send(JSON.stringify({
        type: "typing",
        is_typing: true
    }));

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
        socket.send(JSON.stringify({
            type: "typing",
            is_typing: false
        }));
    }, 2000);
};
    const sendMessages = () => {
    if (!socket) {
        return;
    } else {
        socket.send(
            JSON.stringify({
                type:'message',
                message: messages,
            })
        );
        console.log('sent',messages)
        

        setMessages("");
    }
};
  const deleteChat = (messageId)=>{
    if(!socket)
        return ;

     socket.send(JSON.stringify({
        'type':'delete',
        'message_id':messageId
     }))
    }

   const editChat = (messageId,newmessage) =>{
    if(!socket)
        return;
    if(socket.readyState !== WebSocket.OPEN){
        console.log('socket is not ready')
        return;
    }
      
      socket.send(JSON.stringify({
        'type':'edit',
        'message_id':messageId,
        'message':newmessage
      }))
      setEditingMessages(null)
      setEditText('')
   }
      const fileUpload = async() =>{
            console.log("Upload button clicked");
        const access = localStorage.getItem('access')
        const formData = new FormData();
        formData.append('file',files)
        formData.append('message',id)

        const response = await fetch(`https://chatapp-5-4d4v.onrender.com/chats/${id}/`,{

            method : "POST",
            headers:{
                "Authorization":`Bearer ${access}`
            },
            body:formData
        })
        const data = await response.json()
        console.log(data)
        if(response.ok){
            setFiles(data)
            console.log('response eecieved')
            console.log(response.status)
        }
      }
  

  const SelectedUserId = users?.find((user) => user.id === Number(id))
  console.log(SelectedUserId)


    return (
      <div className="h-screen flex bg-[#313338] text-gray-200">

  {/* Left Sidebar - Users */}
  <div className="w-1/4 bg-[#2b2d31] h-full border-r border-[#1e1f22] overflow-y-auto">
  <h2 className="text-xl font-bold p-4 border-b border-[#1e1f22] text-white"></h2>

    {Array.isArray(users) &&
      users.map((user, idx) => (
        <Link to={`/chat/${user.id}`} key={idx}>
       <div
  className={`p-4 border-b border-[#1e1f22] cursor-pointer flex items-center gap-3 ${
  user.id === SelectedUserId?.id
    ? "bg-[#5865F2]"
    : "bg-[#2b2d31]"
} hover:bg-[#3a3c43] transition`}
>
  <img
    className="w-10 h-10 rounded-full object-cover"
    src={user.profile_pic}
    alt={user.username}
  />

  <p className="font-medium">{user.username}</p>
  {user.is_online ? (
    <span className="text-green-800 text-sm">Online</span>
  ) : (
    <span className="text-gray-400 text-sm">Offline</span>
  )}
  <div id='type-input'></div>
</div>
        </Link>
      ))}
  </div>

  {/* Right Side - Chats */}
<div className="w-3/4 flex flex-col bg-[#313338]">


{ SelectedUserId&& (
    <Link to={`/user/${SelectedUserId.id}/`}>
  <div className="flex items-center gap-3 bg-[#202c33] px-4 py-3 border-b border-[#2a3942]">
  <h2 className="text-white font-medium text-base order-2">
    {SelectedUserId.username}
  </h2>

  <img
    className="h-10 w-10 rounded-full object-cover order-1 border border-[#3b4a54]"
    src={SelectedUserId.profile_pic}
    alt=""
  />
</div>
    </Link>

)}

 
  
   

  {/* Chats */}
  

    {/* Chats List */}
    <div className={`flex-1 overflow-y-auto  p-4 space-y-3`}>
      {Array.isArray(chats) &&
        chats.map((chat, idx) => (
          <div key={idx} className={`flex ${chat.sender===username?'justify-end':'justify-start'}`}>
            <div className={`max-w-md p-3 rounded-2xl shadow ${
    chat.sender === username
      && chat.is_read
        ? "bg-blue-600 text-white"
      : "bg-[#2b2d31] text-gray-200"
  }`}>
              <div
                onMouseDown={() => {
                  const timer = setTimeout(() => {
                    setSelectedMessage(chat.id);
                  }, 700);

                  setPressTimer(timer);
                }}
                onMouseUp={() => clearTimeout(pressTimer)}
                onMouseLeave={() => clearTimeout(pressTimer)}
              >
                {chat.message}
                 {chat.file && (
            <img
                src={chat.file}
                alt=""
                className="w-48 rounded"
            />
        )}
              </div>

              {selectedmessage===chat.id && chat.sender===username && (
                <div><button onClick={()=>deleteChat(chat.id)}> 🗑</button></div>
              )}

            {selectedmessage === chat.id &&chat.sender===username&& (
  <button
    onClick={() => {
      setEditingMessages(chat.id);
      setSelectedMessage(null);
    }}
  >
    Edit
  </button>
)}

              {editingmessages === chat.id && chat.sender === username && (
                <div>
                  <input
                    className="border-2 bg-gray-400"
                    value={edittext}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        editChat(chat.id, edittext);
                      }
                    }}
                  />
                  <button className='bg-green-300 border-2 p-2 ' onClick={() => {editChat(chat.id, edittext);setSelectedMessage(null);setEditText('')}}>Edit</button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
   <div className="bg-[#2b2d31] border-t border-[#1e1f22] p-4 relative">
  
  {emoji && (
    <div className="absolute bottom-20 left-4 z-50 shadow-xl rounded-lg overflow-hidden">
      <EmojiPicker
        onEmojiClick={(emojiData) =>
          setMessages((prev) => prev + emojiData.emoji)
        }
      />
    </div>
  )}

  <div className="flex justify-between items-center">
    <input
    
      value={messages}
      onChange={handleChange}
      type="text"
      placeholder="Type a message..."
     className="w-3/4 p-3 bg-[#383a40] text-white rounded-lg outline-none"
    />
    <input
    type="file"
    onChange={(e) => setFiles(e.target.files[0])}
/>
  <button
  onClick={fileUpload}
  className="px-3 py-2 bg-[#5865F2] text-white rounded hover:bg-[#4752C4]"
>
  Upload
</button>

    <button
      className="text-2xl mx-2"
      onClick={() => setEmoji(!emoji)}
    >
      😀
    </button>

    <button
     className="rounded px-4 py-2 bg-[#5865F2] text-white hover:bg-[#4752C4] disabled:bg-gray-600"
      onClick={sendMessages}
        disabled={!messages.trim()}
    >
      Send
    </button>
  </div>

    </div>
  </div>
  </div>
   


  );
};

export default Chat;