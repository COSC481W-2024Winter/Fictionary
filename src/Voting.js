import React, { useState, useEffect, useCallback } from 'react';

import { useSocket } from './context/SocketContext';
import { useParams } from 'react-router-dom';


const Timer = ({viewCurr, seconds, setSeconds, handleNextBtn}) => {
  

  useEffect(() => {
    // Update the timer every second
    const interval = setInterval(() => {
      if (viewCurr) {
        setSeconds(prevSeconds => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [viewCurr, setSeconds]); // Empty dependency array ensures the effect runs only once on mount

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (seconds <= 0) {
      handleNextBtn();
    }
  }, [seconds, viewCurr, handleNextBtn]);

  
  return (
    <div>
      <h1 className="large-text">Timer</h1>
      <p className="timer">{formatTime(seconds)}</p>
    </div>
  );
};

const Canvas = () => {
  return (
    <div>
      <canvas
      id='my-canvas'
      width={443}
      height={350}
      className="bg-white shadow-lg border-2 border-gray-300 m-10"
      ></canvas>
    </div>
  );
};

function Voting({viewCurr, setViewCurr, setViewNext, guesses, setGuesses, players, setPlayers}) {
    // Note: comment out guesses and setGuesses above, uncomment below to test whether buttons will display
    // const [guesses, setGuesses] = useState([
    //     {text: "one", userId: "user_1", voterIds: [{voterId: "user_3"}, {voterId: "user_6"}, {voterId: "user_9"}]},
    //     {text: "two", userId: "user_2", voterIds: []},
    //     {text: "three", userId: "user_3", voterIds: []},
    //     {text: "four", userId: "user_4", voterIds: []},
    //     {text: "five", userId: "user_5", voterIds: []},
    //     {text: "six", userId: "user_6", voterIds: [{voterId: "user_5"}]},
    //     {text: "seven", userId: "user_7", voterIds: []},
    //     {text: "eight", userId: "user_8", voterIds: []},
    //     {text: "nine", userId: "user_9", voterIds: [{voterId: "user_2"}, {voterId: "user_4"}, {voterId: "user_7"}]}
    // ]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [seconds, setSeconds] = useState(60);
    /* FOR TESTING COMMENT OUT ABOVE LINE, UNCOMMENT BELOW LINE */
    // const [seconds, setSeconds] = useState(10);
    const { roomId } = useParams();
    const { socket } = useSocket();
    const [authorId, setAuthorId] = useState(null);
    const [voterId, setVoterId] = useState(null);
  
    const handleVoteSubmit = () => {
      setIsButtonDisabled(true);
      if(!(authorId === null || voterId === null)){
        socket.emit('updateScores', {room: roomId, authorId: authorId, voterId: voterId});
      }
      socket.emit('voteSubmitted', { room: roomId});
    }
 
    useEffect(() => {
      if (socket) {
          socket.emit('joinRoom', { userid: socket.id, room: roomId, userName: 'User' });

          socket.on('updateGuesses', (roomGuesses) => {
            setGuesses(roomGuesses);
          });

          socket.on('updateUserList', (users) => {
            setPlayers(users);
          });

          socket.on('votingDone', (data) => {
            handleNextBtn();
          });

          socket.on('gameStarted', () => {
              // Handle game start logic
          });

          socket.on('error', (errorMessage) => {
              console.error(errorMessage);
          });

          return () => {
              socket.off('updateUserList');
              socket.off('updateGuesses');
              socket.off('guessVotingDone');
              socket.off('gameStarted');
              socket.off('error');
          };
      }
    }, [socket, roomId, setGuesses, setPlayers]);

    const changeGuesses = useCallback((e) => {
      setAuthorId(e.key);
      if(socket){
        setVoterId(socket.id);
        socket.emit('changeGuesses', {room: roomId, authorId: authorId, voterId: voterId});
      }
    });
    socket.emit('getCanvas', {room: roomId});
    useEffect(() => {
      if (socket) {
          socket.on('returnCanvas', (canvasImg) => {
              const container = document.getElementById('image-container');
              container.innerHTML = '';
              const imgElement = new Image();
              imgElement.src = 'data:image/png;base64,' + canvasImg;
              container.appendChild(imgElement);
          });
 
          return () => {
              socket.off('returnCanvas');
          };
      }
  }, [socket]);

    const handleNextBtn = useCallback(() => {
      setViewNext(true);
      setViewCurr(false);
      setSeconds(60);
      /* FOR TESTING COMMENT OUT ABOVE LINE, UNCOMMENT BELOW LINE */
      // setSeconds(10);
    }, [setViewCurr, setViewNext, setSeconds]);

    return (
      <div className="background custom-text">
        
          <div className= "flex justify-end">
            <Timer viewCurr={viewCurr} seconds={seconds} setSeconds={setSeconds} handleNextBtn={handleNextBtn} />
          </div>
        
          <div className="w-full mx-auto flex flex-row items-center">
              <div id = "image-container" 
              style={{ width: '443px', height: '350px' }}
              className='bg-white shadow-lg border-2 border-gray-300 m-10'>
          
              </div>
              <div className="basis-1/2">
                <p className='header'>CATEGORY IS</p> <br />
                <p className='sub-header'>CATEGORY</p>
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-4 shrink justify-center items-center">
                  {guesses.map((guess) => <button onclick={changeGuesses} className="yellow-button m-2 w-24 h-16" id="test" key={guess.userId}>{guess.text}</button>)}
                </div>
              </div>
              <div className="flex justify-center brown-button">
                <div>
                  <button onClick={handleVoteSubmit} disabled={isButtonDisabled} type="button" >
                    Submit
                  </button>
                </div>
              </div>
          </div>
      </div>
    );
}

export default Voting;