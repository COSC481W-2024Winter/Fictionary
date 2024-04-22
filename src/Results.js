import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from './context/SocketContext';

const EXPRESS_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;

function Results({setViewCurr, setViewNext, players, setPlayers, guesses, setGuesses, roundCount, setRoundCount,  round, setRound, theWord }) {

    const { roomId } = useParams();
    const { socket } = useSocket();
    //const category = "a nothingburger"; //CHANGE
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [category, setCategory] = useState({ category: "Animals" });
    const [word, setWord] = useState();
    // Note: moved variables to Room.js
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
    // const [players, setPlayers] = useState([
    //     {id: "user_1", name: "user_one", isHost: true, totalScore: 6, trickScore: 0, artScore: 6},
    //     {id: "user_2", name: "user_two", isHost: false, totalScore: 0, trickScore: 0, artScore: 0},
    //     {id: "user_3", name: "user_three", isHost: false, totalScore: 1, trickScore: 0, artScore: 0},
    //     {id: "user_4", name: "user_four", isHost: false, totalScore: 0, trickScore: 0, artScore: 0},
    //     {id: "user_5", name: "user_five", isHost: false, totalScore: 0, trickScore: 0, artScore: 0},
    //     {id: "user_6", name: "user_six", isHost: false, totalScore: 2, trickScore: 1, artScore: 0},
    //     {id: "user_7", name: "user_seven", isHost: false, totalScore: 0, trickScore: 0, artScore: 0},
    //     {id: "user_8", name: "user_eight", isHost: false, totalScore: 0, trickScore: 0, artScore: 0},
    //     {id: "user_9", name: "user_nine", isHost: false, totalScore: 5, trickScore: 4, artScore: 0}
    // ]);
    const [correct, setCorrect] = useState([]);
    const [score, setScore] = useState(0);

    function findCorrect(){
        guesses.map( guess => {
            if(guesses != [] && players.find((player) => player.id === guess.userId).isHost){
                setCorrect(guess.voterIds.map(voterId => (players.find((player) => player.id === voterId.voterId)).name));
            }
        });
    }

    useEffect(() => {
            if (socket) {
                socket.emit('joinRoom', { userid: socket.id, room: roomId, userName: 'User' });

                socket.on('updateUserList', (UpdatedPlayers) => {
                    setPlayers(UpdatedPlayers);
                    setScore(players.find((player) => player.id === socket.id).totalScore);
                });

                socket.on('updateGuesses', (roomGuesses) => {
                    setGuesses(roomGuesses);
                });
      
                socket.on('gameStarted', () => {
                    // Handle game start logic
                });
      
                socket.on('error', (errorMessage) => {
                    console.error(errorMessage);
                });

                socket.on('currentCategory', (selectedCategory) => {
                    setCategory({ category: selectedCategory });
                });
                // Request the current category when the component mounts
                socket.emit('requestCurrentCategory', roomId);
      
                return () => {
                    socket.off('updateUserList');
                    socket.off('updateGuesses');
                    socket.off('gameStarted');
                    socket.off('error');
                };
            }
        }, [socket, roomId, setGuesses, setPlayers, setScore]);
        
        useEffect(() => {
            findCorrect();
        }, []);
    
    function MyCanvas() {
        return (
            <canvas
                // width={996}
                // height={468}
                className="canvas"
            ></canvas>
        );
    }
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
    function BonusMessage() {
        if(correct.length > 0){
            return (
                <p className="sub-header, text-[#ece6c2]">{correct.join(", ")} earned bonus points for guessing correctly.</p>
            );
        }
        else{
            return(
                <p></p>
            );
        }
    }

    function handleNextBtn() {
        setViewCurr(false);
        setViewNext(true);
    }

    function handleClick() {
        setIsButtonDisabled(true);
        socket.emit('resultsSubmitted', { room: roomId});
    }

    useEffect(() => {
        if (socket) {
            socket.on('resultsDone', (data) => {
                handleNextBtn();
            });
    
            return () => {
                socket.off('resultsDone');
            };
        }
    }, [socket, handleNextBtn]);

    return(
        <div className="background pt-4 custom-text min-h-screen max-h-max">
            {/* display room and page title for testing */}
            <p>room: {roomId} &#40;results&#41;</p> 
            <p className="large-text text-left ml-4">Fictionary</p>
            <div className="grid lg:grid-cols-2 lg:grid-rows-1 sm:grid-rows-2 p-0 m-0 justify-items-stretch">
                <div className="flex flex-col justify-center items-center max-h-[80vh] p-0 m-4">
                <div id = "image-container" 
              style={{ width: '443px', height: '350px' }}
              className='bg-white shadow-lg border-2 border-gray-300 m-10'>
          
              </div>
                    <p className="my-2">Category was</p>
                    <p className="large-text">{category.category}</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <p className="large-text">Everyone's Guesses</p>
                    <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-4 shrink justify-center items-center">
                        {guesses.map(guess => <div className="large-text bg-[#499b83] text-[#ece6c2] p-2" key={guess.userId}>{players.find((player) => player.id === guess.userId).name + ": " + guess.text}</div> )}
                    </div>
                    {/* status board(?) */}
                    <div className="flex flex-col shrink text-left bg-[#6f5643] text-[#ece6c2] border-solid px-4 py-2 max-w-96">
                        <div className="mb-4">
                            {guesses.map(guess => guess.voterIds.length > 0 ? <div key={guess.userId}>{players.find((player) => player.id === guess.userId).name} scored {players.find((player) => player.id === guess.userId).isHost ? guess.voterIds.length * 2 : guess.voterIds.length} {players.find((player) => player.id === guess.userId).isHost ? "artist" : "trickster"} points.</div> : <div></div>)}
                        </div>
                        <BonusMessage className="flex shrink"/>
                    </div>
                    <p className="sub-header">Your Score: {score}</p>
                    <button onClick={handleClick} disabled={isButtonDisabled} className="blue-button size-fit px-4 py-2 mt-0" data-testid="results-ctn-btn" >Continue</button>
                </div>
            </div>
        </div>
    );
}

export default Results;