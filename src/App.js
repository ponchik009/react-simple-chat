import React from "react";
import axios from "axios";

import socket from "./socket";
import JoinBlock from "./components/JoinBlock";
import Chat from "./components/Chat";
import reducer from "./reducer";

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const setUsers = (users) => {
    dispatch({
      type: "SET_USERS",
      payload: users,
    });
  };

  const addMessage = (message) => {
    dispatch({
      type: "ADD_MESSAGE",
      payload: message,
    });
  };

  React.useEffect(() => {
    socket.on("ROOM.SET_USERS", setUsers);
    socket.on("ROOM.ADD_MESSAGE", addMessage);
  }, []);

  const onLogin = async (joinData) => {
    /*
     уносим в SET_DATA
    dispatch({
      type: "JOINED",
      payload: joinData,
    }); 
    */

    socket.emit("ROOM.JOIN", joinData);

    const { data } = await axios.get(`/rooms/${joinData.roomId}`);
    dispatch({
      type: "SET_DATA",
      payload: { ...data, ...joinData },
    });
  };

  console.log(state);

  return (
    <div className="wrapper">
      {!state.joined ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
