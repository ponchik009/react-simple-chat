import React from "react";
import axios from "axios";

import socket from "../socket";

const JoinBlock = ({ onLogin }) => {
  const [roomId, setRoomId] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  const onRoomIdChange = (e) => {
    setRoomId(e.target.value);
  };

  const onUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const onEnter = async () => {
    if (!roomId || !userName) {
      return alert("Введены неверные данные!");
    }
    const joinData = {
      roomId,
      userName,
    };
    setLoading(true);
    try {
      await axios.post("/rooms", joinData);
      onLogin(joinData);
    } catch (err) {
      setLoading(false);
      if (err.response.status === 401) {
        alert("Пользователь с таким именем уже есть в чате!");
      }
      console.log(err);
    }
  };

  return (
    <div className="join-block">
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={onRoomIdChange}
      />
      <input
        type="text"
        placeholder="Ваше имя"
        value={userName}
        onChange={onUserNameChange}
      />
      <button
        className="btn btn-success"
        onClick={onEnter}
        disabled={isLoading}
      >
        {isLoading ? "ВХОД..." : "ВОЙТИ"}
      </button>
    </div>
  );
};

export default JoinBlock;
