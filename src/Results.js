import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from './context/SocketContext';

function Results({ setViewCurr, setViewNext, players, setPlayers, guesses, setGuesses, roundCount, setRoundCount }) {
    const { roomId } = useParams();
    const { socket } = useSocket();
    const category = "a nothingburger";
    const [correct, setCorrect] = useState([]);
    const [score, setScore] = useState(0);

    function findCorrect() {
        guesses.map(guess => {
            if (guesses != [] && players.find((player) => player.id === guess.userId).isHost) {
                setCorrect(guess.voterIds.map(voterId => (players.find((player) => player.id === voterId.voterId)).name));
            }
        });
    }

    useEffect(() => {
        let mySocketId = null;
        socket.on('yourSocketId', ({ id }) => {
            mySocketId = id;
            setScore(players.find((player) => player.id === mySocketId).totalScore);
        });

        // Setup event listeners for socket
        // Note: When the mechanism for making/voting on guesses is added, add a listener for the guesses here as well
        socket.on('updateUserList', (UpdatedPlayers) => {
            setPlayers(UpdatedPlayers);
            setScore(players.find((player) => player.id === mySocketId).totalScore);
        });

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

    function BonusMessage() {
        if (correct.length > 0) {
            return (
                <p className="sub-header, text-[#ece6c2]">{correct.join(", ")} earned bonus points for guessing correctly.</p>
            );
        }
        else {
            return (
                <p></p>
            );
        }
    }

    function handleNextBtn() {
        setViewCurr(false);
        setViewNext(true);
    }

    return (
        <div className="background pt-4 custom-text min-h-screen max-h-max">
            {/* display room and page title for testing */}
            <p>room: {roomId} &#40;results&#41;</p>
            <p className="large-text text-left ml-4">Fictionary</p>
            <div className="grid lg:grid-cols-2 lg:grid-rows-1 sm:grid-rows-2 p-0 m-0 justify-items-stretch">
                <div className="flex flex-col justify-center items-center max-h-[80vh] p-0 m-4">
                    <MyCanvas />
                    <p className="my-2">Category was</p>
                    <p className="large-text">{category}</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <p className="large-text">Everyone's Guesses</p>
                    <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-4 shrink justify-center items-center">
                        {guesses.map(guess => <div className="large-text bg-[#499b83] text-[#ece6c2] p-2" key={guess.userId}> {guess.userId}</div>)}
                    </div>
                    {/* status board(?) */}
                    <div className="flex flex-col shrink text-left bg-[#6f5643] text-[#ece6c2] border-solid px-4 py-2 max-w-96">
                        <div className="mb-4">
                            {guesses.map(guess => guess.votes != undefined && guess.votes > 0 ? <div key={guess.userId}>{players.find((player) => player.id === guess.userId).name} scored {players.find((player) => player.id === guess.userId).isHost ? guess.votes * 2 : guess.votes} {players.find((player) => player.id === guess.userId).isHost ? "artist" : "trickster"} points.</div> : <div></div>)}
                        </div>
                        <BonusMessage className="flex shrink" />
                    </div>
                    <p className="sub-header">Your Score: {score}</p>
                    <button onClick={handleNextBtn} className="blue-button size-fit px-4 py-2 mt-0" data-testid="results-ctn-btn" >Continue</button>
                </div>
            </div>
        </div>
    );
}

export default Results;