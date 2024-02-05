import './Chatroom.css'
import io from 'socket.io-client'
import {useState, useEffect, useRef} from 'react'

const socket = io.connect ('http://localhost:8000')

const Chatroom = ({user}) =>{
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const messageField = useRef(null);

    const sendMessage = () => {
        let messageArr = [...messages, {message: input, id: socket.id, user:user.username}];
        console.log(user);
        socket.emit("sendMessage", messageArr);
        setMessages(messageArr);
        messageField.current.scrollTop = messageField.current.scrollHeight;
        setInput("");
        console.log(messageArr);
    }

    useEffect(()=>{
        socket.on("receiveMessage", (data) => {
            setMessages(data);
        });
    },[socket]);

    useEffect(()=>{
        socket.on("userhasjoined", (data)=>{
            let messageArr = [...messages, {message: `${data} has joined the room`, id: "server", user: "Server"}];
            setMessages(messageArr);
        });
    },[socket]);
    

    return(
        <div className='message-flex'>
            <div ref={messageField} class="message-box">
                {messages.map(({message, id, user})=>{
                    console.log(user)
                    return (
                        <div className='message-wrapper'>
                            <p className="user">{user}</p>
                            <p className='message'>{message}</p>
                        </div>
                    )
            })}
            </div>
            <div className='send-msg-div'>
                <input
                    className="input-box"
                    type="text" 
                    value={input} 
                    placeholder="type message..."
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={sendMessage}>Send Message</button>
            </div>
        </div>
    )
}

export default Chatroom; 