import { useParams, useLocation } from 'react-router-dom';
import './index.css';
import "./output.css";
import React, { useState } from 'react';
import Lobby from "./Lobby.js";
import Categories from "./Categories.js";
import Drawing from "./Drawing.js";
import Voting from "./Voting.js";
import Results from "./Results.js";
import Scoreboard from './Scoreboard';
import FinalScore from './FinalScore.js';
import Artist from './Artist.js';

function Room() {
    const location = useLocation();
    const [isHost, setIsHost] = useState(location.state?.host ? true : false);
    const [guestName] = useState(location.state?.name);
    const [socket, setSocket] = useState(null);
    const [players, setPlayers] = useState([]);
    const [guesses, setGuesses] = useState([]);
    const [viewFinal, setViewFinalScore] = useState(false);
    const [roundCount, setRoundCount] = useState(0);
    const [usedIndexes, setUsedIndexes] = useState([]);
    const [artist, setArtist] = useState(null);
    const [viewArtist, setViewArtist] = useState(false);

    //round counter
    const [round, setRound] = useState(0);

    // modals powered by friendship and GOD
    const [viewLobby, setViewLobby] = useState(true);
    const [viewCategories, setViewCategories] = useState(false);
    const [viewDrawing, setViewDrawing] = useState(false);
    const [viewVoting, setViewVoting] = useState(false);
    const [viewResults, setViewResults] = useState(false);
    const [viewScoreboard, setViewScoreboard] = useState(false);

    return (
        <div>

            {viewLobby && <Lobby players={players} setPlayers={setPlayers} socket={socket} setSocket={setSocket} isHost={isHost} setIsHost={setIsHost} guestName={guestName} setViewCurr={setViewLobby} setViewNext={setViewCategories} />}
            {viewCategories && <Categories viewCurr={viewCategories} setViewCurr={setViewCategories} setViewNext={setViewArtist} players={players} setPlayers={setPlayers} isHost={isHost} setIsHost={setIsHost} round={round} setRound={setRound}/>}
            {viewArtist && <Artist viewCurr={viewArtist} setViewCurr={setViewArtist} setViewNext={setViewDrawing} players={players} setPlayers={setPlayers} isHost={isHost} setIsHost={setIsHost} usedIndexes={usedIndexes}setUsedIndexes= {setUsedIndexes} artist={artist} setArtist={setArtist}/>}
            {viewDrawing && <Drawing viewCurr={viewDrawing} setViewCurr={setViewDrawing} setViewNext={setViewVoting} players={players} setPlayers={setPlayers} guesses={guesses} setGuesses={setGuesses} isHost={isHost} setIsHost={setIsHost} usedIndexes={usedIndexes} setUsedIndexes={setUsedIndexes} artist={artist} setArtist={setArtist} socket={socket} setSocket={setSocket} round={round} setRound={setRound}/>}
            {viewVoting && <Voting viewCurr={viewVoting} setViewCurr={setViewVoting} setViewNext={setViewResults} guesses={guesses} setGuesses={setGuesses} players={players} setPlayers={setPlayers}  /> }
            {viewResults && <Results players={players} setPlayers={setPlayers} guesses={guesses} setGuesses={setGuesses} socket={socket} setSocket={setSocket} setViewCurr={setViewResults} setViewNext={setViewScoreboard} roundCount={roundCount} setRoundCount={setRoundCount} /> }
            {viewScoreboard && <Scoreboard players={players} setPlayers={setPlayers} guesses={guesses} setGuesses={setGuesses} setViewCurr={setViewScoreboard} setViewNext={setViewArtist} setViewNextRound={setViewCategories} setViewFinalScore={setViewFinalScore} roundCount={roundCount} usedIndexes={usedIndexes} setRoundCount={setRoundCount} setUsedIndexes={setUsedIndexes} /> }
            {viewFinal && <FinalScore viewCurr={viewFinal} setViewCurr={setViewFinalScore} setViewNext={setViewLobby} />}
        </div>
    );
}

export default Room;
