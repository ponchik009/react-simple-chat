export default (state, action) => {
  switch (action.type) {
    // case "JOINED":
    //   return {
    //     ...state,
    //     joined: true,
    //     userName: action.payload.userName,
    //     roomId: action.payload.roomId,
    //   };

    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };

    case "SET_DATA":
      return {
        ...state,
        joined: true,
        userName: action.payload.userName,
        roomId: action.payload.roomId,
        users: action.payload.users,
        messages: action.payload.messages,
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    default:
      return state;
  }
};
