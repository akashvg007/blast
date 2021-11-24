import React, { useContext, useEffect, useState, createContext } from 'react'
import io from 'socket.io-client';
import { chatService } from '../api/urlConstants';

const SocketContext = createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ id, children }) {
  const [socket, setSocket] = useState(null);
  //console.log("socketProvider::id", id);

  useEffect(() => {
    console.log("socket creation initiated", id);

    const newSocket = io(
      // "http://localhost:5500",
      chatService,
      { query: { id } }
    )
    setSocket(newSocket)
    console.log("socket connection: ", newSocket.connected);
    return () => {
      newSocket.close()
    }
  }, [id])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
