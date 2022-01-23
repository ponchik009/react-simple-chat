import React from "react";

import socket from "../socket";

const Chat = ({ roomId, userName, users, messages, onAddMessage }) => {
  const [messageValue, setMessageValue] = React.useState("");
  const messagesRef = React.useRef(null);

  const onSendMessage = () => {
    socket.emit("ROOM.NEW_MESSAGE", {
      roomId,
      text: messageValue,
      author: userName,
    });
    onAddMessage({
      text: messageValue,
      author: userName,
    });
    setMessageValue("");
  };

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 9999);
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-users">
        Комната: <b>{roomId}</b>
        <hr />
        <b>Онлайн ({users.length}):</b>
        <ul>
          {users.map((username, index) => (
            <li key={`${username}_${index}`}>{username}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div className="messages" ref={messagesRef}>
          {messages &&
            messages.map((message, index) => (
              <div
                key={`${message.author}_${index}`}
                className={`message ${
                  userName === message.author ? "message-my" : ""
                }`}
              >
                <p>{message.text}</p>
                <div>
                  <span>{message.author}</span>
                </div>
              </div>
            ))}
        </div>
        <form>
          <textarea
            className="form-control"
            rows="3"
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
          ></textarea>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSendMessage}
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
