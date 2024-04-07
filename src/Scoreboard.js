import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Scoreboard({setViewCurr, setViewNext, players, setPlayers, setViewNextRound, setViewFinalScore, roundCount, usedIndexes, setRoundCount, setUsedIndexes, socket}) {
    const { roomId } = useParams();
    // Note: moved variables to Room.js
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
    const [nextArtist, setNextArtist] = useState(null);
    const [bestTrickster, setBestTrickster] = useState(null);
    const [bestArtist, setBestArist] = useState(null);

    useEffect(() => {
        sortUsers();
    }, []);

    function sortUsers(){
        if(players.length > 0){
            for(let i = 0; i < players.length; i++){
                for(let j = 0; j < players.length; j++){
                    if(players[j].trickScore < players[i].trickScore){
                        let temp = players[j];
                        players[j] = players[i];
                        players[i] = temp;
                    }
                }
            }
            setBestTrickster(players[0].name);
    
            for(let i = 0; i < players.length; i++){
                for(let j = 0; j < players.length; j++){
                    if(players[j].artScore < players[i].artScore){
                        let temp = players[j];
                        players[j] = players[i];
                        players[i] = temp;
                    }
                }
            }
            setBestArist(players[0].name);

            for(let i = 0; i < players.length; i++){
                for(let j = 0; j < players.length; j++){
                    if(players[j].totalScore < players[i].totalScore){
                        let temp = players[j];
                        players[j] = players[i];
                        players[i] = temp;
                    }
                }
            }
        }
    }

    function Title(){
        if(nextArtist != null){
            return(
                <p className="large-text pb-2">Scores:</p>
            );
        }
        else{
            return(
                <p className="large-text pb-2">Final Scores:</p>
            );
        }
    }

    function GameMessage(){
        if(nextArtist != null){
            return(
                <div className="bg-[#d2a24c] flex flex-col justify-evenly w-5/12 aspect-square">
                    <p className="large-text">Next Artist:</p>
                    <p className="large-text">{nextArtist}</p>
                </div>
            );
        }
        else{
            return(
                <div className="bg-[#d2a24c] flex flex-col justify-evenly w-5/12 aspect-square">
                    <p className="header">Bonus Awards:</p>
                    <p className="sub-header">Best Artist:</p>
                    <p className="large-text">{bestArtist}</p>
                    <p className="sub-header">Best Trickster:</p>
                    <p className="large-text">{bestTrickster}</p>
                </div>
            );
        }
    }
    function handleSubmit() {
        socket.emit('score submitted');
    }

    socket.on('game over', () => {
        setViewCurr(false);
        setViewFinalScore(true);
    });

    socket.on('next round', () => {
        setViewCurr(false);
        setViewNextRound(true);
    });

    socket.on('score go next', () => {
        setViewCurr(false);
        setViewNext(true);
    });

    return (
        <div className="background custom-text pb-4 px-6 min-h-screen max-h-max">
            {/* display room and page title for testing */}
            <p>room: {roomId} &#40;scoreboard&#41;</p> 
            <p className="large-text text-center ml-4">Fictionary</p>
            <div className="grid lg:grid-cols-2 lg:grid-rows-1 sm:grid-rows-2 p-0 m-0 justify-center items-center justify-items-stretch">
                <div className="flex flex-col justify-center items-center">
                    <Title />
                    <table className="table">
                        <tr className="borders">
                            <th className="borders table-header">Player</th>
                            <th className="borders table-header">Place</th>
                            <th className="borders table-header">Score</th>
                        </tr>
                        {players.map((player, index) => <tr className="borders">
                            <td className="borders table-data">{player.name}</td>
                            <td className="borders table-data">{(index+1) + ((index+1) > 3 ? "th" : (index+1) === 3 ? "rd" : (index+1) === 2 ? "nd" : "st")}</td>
                            <td className="borders table-data">{player.totalScore} {player.totalScore === 1 ? `pt` : `pts`}</td>
                        </tr>)}
                    </table>
                </div>
                <div className="flex flex-col justify-center items-center mr-6 my-6 gap-6">
                    <GameMessage />
                    <button onClick={handleSubmit} type="button" className="blue-button cursor-pointer size-fit px-4 py-2" data-testid="scoreboard-ctn-btn" >Continue</button>
                </div>
            </div>
        </div>
    )
}

export default Scoreboard;