import React, { useState, useRef } from "react";
import { FiThumbsUp } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import likeSound from "./like-sound.mp3"; 
import "./App.css";

const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [likedMessageId, setLikedMessageId] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [mentionPosition, setMentionPosition] = useState(null);

  const inputRef = useRef(null);



  const handleSendMessage = () => {
    if (message.trim() === "") return;
    const randomUser = user_list[Math.floor(Math.random() * user_list.length)];
    const newMessage = {
      id: uuidv4(),
      user: randomUser,
      text: message,
      likes: 0,
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleLikeMessage = (id) => {

    const audio = new Audio(likeSound);
    audio.play();


    setLikedMessageId((prevLikedMessageId) =>
      prevLikedMessageId === id ? null : id
    );

    const updatedMessagesHere = messages.map((msg) =>
      msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
    );
    setMessages(updatedMessagesHere);
  };

  const handleEmojiClickMessage = (emoji) => {
    setMessage(
      message.slice(0, inputRef.current.selectionStart) +
        emoji +
        message.slice(inputRef.current.selectionEnd)
    );
  };

  const handleMentionClickMessage = (username) => {
    setMessage(message.slice(0, mentionPosition) + `${username} `);
    setShowUserList(false);
  };

  const handleInputChangeMessage = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);

    const cursorPosition = e.target.selectionStart;
    if (inputValue.charAt(cursorPosition - 1) === "@") {
      setShowUserList(true);
      setMentionPosition(cursorPosition);
    } else {
      setShowUserList(false);
      setMentionPosition(null);
    }
  };

  return (
    <div className="App">
      <div className="Chat">
        <div className="ChatThread">
          {messages.map((msg) => (
            <div key={msg.id} className="ChatMessage">
              <div>
                <strong>{msg.user}: </strong>
                {msg.text}
              </div>
              <div
                className="LikeButton"
                onClick={() => handleLikeMessage(msg.id)}
                style={{ color: likedMessageId === msg.id ? "#ed646a" : "#ed646a" }}
              >
                <FiThumbsUp />
                <span>{msg.likes}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="ChatInput">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={handleInputChangeMessage}
            ref={inputRef}
          />
          {showUserList && (
            <div className="UserList">
              {user_list.map((user) => (
                <div
                  key={user}
                  onClick={() => handleMentionClickMessage(user)}
                  className="UserItem"
                >
                  @{user}
                </div>
              ))}
            </div>
          )}
          <button onClick={handleSendMessage}>Send</button>
        </div>
        <div className="EmojiPicker">
          {["😀", "😍", "🎉", "👍", "❤️","😌","🤩","😎","😂","😜","😳","🤭","👏🏻","🙏🏻","👨🏼‍⚕️","💥","🔥"].map((emoji) => (
            <span
              key={emoji}
              onClick={() => handleEmojiClickMessage(emoji)}
              className="EmojiItem"
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
