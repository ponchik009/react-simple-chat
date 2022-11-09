import React from "react";

import socket from "../socket";

const Chat = ({ roomId, userName, users, messages, onAddMessage }) => {
  const [messageValue, setMessageValue] = React.useState("");
  const messagesRef = React.useRef(null);

  const [shiftPressed, setShiftPressed] = React.useState(false);

  const onSendMessage = (e) => {
    console.log(messageValue);
    // e.preventDefault();
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

  const handlerKeyDown = (e) => {
    if (e.key === "Shift" && !shiftPressed) {
      console.log("shift down");
      setShiftPressed(true);
    }
    if (e.key === "Enter" && !shiftPressed) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handlerKeyUp = (e) => {
    if (e.key === "Shift") {
      console.log("shift up");
      setShiftPressed(false);
    }
  };

  React.useEffect(() => {
    return () => socket.emit("disconnect");
  }, []);

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
                <p>{"" + message.text}</p>
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
            onKeyDown={handlerKeyDown}
            onKeyUp={handlerKeyUp}
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
