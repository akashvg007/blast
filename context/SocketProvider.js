import React, { useContext, useEffect, useState, createContext } from 'react'
import io from 'socket.io-client';
import { chatService } from '../api/urlConstants';
import { getLocal } from '../helper/logicHelper';

const SocketContext = createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ id, children }) {
  const [socket, setSocket] = useState(null);
  const [myphone, setMyphone] = useState(id);
  //console.log("socketProvider::id", id);
  const getMyPhone = async () => {
    const phone = await getLocal('myphone');
    setMyphone(phone)
  }
  useEffect(() => {
    console.log("socket creation initiated", id);
    if (!myphone || myphone === "") {
      getMyPhone()
      return;
    }
    const newSocket = io(
      // "http://localhost:5500",
      chatService,
      { query: { id: myphone } }
    )
    setSocket(newSocket)
    console.log("socket connection: ", newSocket.connected);
    return () => {
      newSocket.close()
    }
  }, [myphone])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
