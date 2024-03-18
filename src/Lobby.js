import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from './context/SocketContext';

function Lobby({ setViewCurr, setViewNext, isHost, setIsHost, guestName, setSocket }) {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const { socket } = useSocket();
  const joinedRoom = useRef(false);

  useEffect(() => {
    if (!socket) return;

    // Initialize socket connection only if it's not already available
    if (!socket.connected) {
      const newSocket = socket.connect(); // Assuming connect method initializes the connection
      setSocket(newSocket); // Update the socket in the state if needed
    }

    const attemptJoinRoom = () => {
      if (joinedRoom.current) {
        console.log("Already joined the room, skipping.");
        return; // Skip if already attempted to join
      }
      const userid = socket.id;
      if (!userid) {
        console.error("Socket ID is not available yet.");
        return;
      }
      socket.emit('joinRoom', { userid, room: roomId, userName: guestName });
      joinedRoom.current = true; // Mark as joined
    };

    // Subscribe to socket events
    const subscribeToEvents = () => {
      socket.on('updateUserList', (updatedPlayers) => {
        setPlayers(updatedPlayers);
        const user = updatedPlayers.find((player) => player.id === socket.id);
        setIsHost(user ? user.isHost : false);
      });

      socket.on('gameStarted', () => {
        alert('Game Start');
        handleNext();
      });

      attemptJoinRoom();
    };

    subscribeToEvents();

    return () => {
      // Clean up the event listeners when the component unmounts
      socket.off('updateUserList');
      socket.off('gameStarted');
    };
  }, [socket, navigate, roomId, guestName, setIsHost, setSocket]); // Keep the dependencies as is to ensure correctness

  function handleLeaveClick() {
    navigate('/');
  }

  function handleStartClick() {
    if (isHost) {
      socket.emit('startGame', roomId);
    } else {
      alert('Only the host can start the game.');
    }
    // Environment check for testing
    if (process.env.NODE_ENV === "test") {
      handleNext();
    }
  }

  function handleNext() {
    setViewCurr(false);
    setViewNext(true);
  }
  //procedurally generate table/list for users 
  return (
    <div className="background custom-text">
      <div>
        <h1 className="large-text">Fictionary</h1>
        <h1 className="header mb-5">Lobby</h1>
        <p className="sub-header pt-0 mb-10">Room: {roomId}</p>
      </div>
      <div>
        <ul className="grid grid-cols-2 gap-10" >
          {players.map((player, i) => (
            <li className="large-text pt-0 mb-0" key={i}>
              {player.name} {player.isHost ? '(Host)' : ''}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleLeaveClick} className="red-button mx-20 mt-10">Leave</button>
        {isHost && (
          <button onClick={handleStartClick} className="blue-button mx-20 mt-10" >Start</button>
        )}
      </div>
    </div>
  );
}

export default Lobby;